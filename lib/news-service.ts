import { aggregateRawNews, scrapeArticleText, RawNewsItem } from './scraper';
import { filterRelevance, processAndTranslate, ProcessedNewsArticle } from './ollama-pipeline';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, updateDoc, increment } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const NEWS_COLLECTION = 'news';
const LOCAL_NEWS_FILE = path.join(process.cwd(), 'content', 'news-data.json');

function readLocalNews(): ProcessedNewsArticle[] {
  try {
    if (fs.existsSync(LOCAL_NEWS_FILE)) {
      const raw = fs.readFileSync(LOCAL_NEWS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return [];
}

function saveLocalNews(articles: ProcessedNewsArticle[]) {
  try {
    const dir = path.dirname(LOCAL_NEWS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_NEWS_FILE, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (e) {
    console.error('[saveLocalNews] error:', e);
  }
}

/**
 * Checks if article link or id already exists in Firestore or local store
 */
async function isAlreadyProcessed(id: string): Promise<boolean> {
  const localList = readLocalNews();
  if (localList.some(item => item.id === id)) return true;

  if (!db) return false;
  try {
    const ref = doc(db, NEWS_COLLECTION, id);
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (e) {
    return false;
  }
}

/**
 * Executes one complete cycle: Ingestion -> Filtering -> LLM Translation -> Firestore Storage
 */
export async function runIngestionPipeline(options: { maxItems?: number } = {}) {
  const maxItems = options.maxItems || 5;
  console.log(`[Pipeline] Starting News Ingestion & Ollama analysis (target: ${maxItems} items)...`);

  const rawItems = await aggregateRawNews();
  console.log(`[Pipeline] Collected ${rawItems.length} raw candidates from RSS & Reddit.`);

  let processedCount = 0;

  for (const item of rawItems) {
    if (processedCount >= maxItems) break;

    // Skip if already in database
    const exists = await isAlreadyProcessed(item.id);
    if (exists) {
      console.log(`[Pipeline] Skipping already processed item: "${item.title}"`);
      continue;
    }

    // Step 1: Content Relevance Filtering
    const relevance = await filterRelevance(item.title, item.contentSnippet || '');
    if (!relevance.isRelevant) {
      console.log(`[Pipeline] Filtered out irrelevant topic: "${item.title}"`);
      continue;
    }

    console.log(`[Pipeline] Processing relevant item [${relevance.category}]: "${item.title}"`);

    // Step 2: Fetch full text if snippet is too short
    let bodyText = item.contentSnippet || '';
    if (bodyText.length < 300) {
      const scraped = await scrapeArticleText(item.link);
      if (scraped.length > bodyText.length) {
        bodyText = scraped;
      }
    }

    // Step 3: LLM 7-Language In-Depth Processing with Ollama
    try {
      const translations = await processAndTranslate(item.title, bodyText || item.title, relevance.category);

      const newsRecord: ProcessedNewsArticle = {
        id: item.id,
        originalUrl: item.link,
        source: item.source,
        category: relevance.category,
        createdAt: new Date().toISOString(),
        translations,
        views: 0,
        isFeatured: processedCount === 0 // Mark first top item as featured
      };

      // Step 4: Save to Local Storage & Firestore
      const currentList = readLocalNews();
      const existingIdx = currentList.findIndex(x => x.id === newsRecord.id);
      if (existingIdx >= 0) {
        currentList[existingIdx] = newsRecord;
      } else {
        currentList.unshift(newsRecord);
      }
      saveLocalNews(currentList);
      console.log(`[Pipeline] ✔ Saved to local store: "${newsRecord.translations.en.title}"`);

      if (db) {
        try {
          await setDoc(doc(db, NEWS_COLLECTION, item.id), newsRecord);
          console.log(`[Pipeline] ✔ Successfully synced "${newsRecord.translations.en.title}" to Firestore.`);
        } catch (dbErr: any) {
          console.warn(`[Pipeline] Firestore write fallback to local:`, dbErr.message);
        }
      }

      processedCount++;
    } catch (err: any) {
      console.error(`[Pipeline] Error processing article "${item.title}":`, err.message);
    }
  }

  console.log(`[Pipeline] Finished. ${processedCount} new articles ingested & localized.`);
  return { processedCount };
}

/**
 * Retrieves latest news articles with automatic language fallback to 'en'
 */
export async function getLatestNews(lang: string = 'en', count: number = 20): Promise<Array<any>> {
  let articles: ProcessedNewsArticle[] = [];

  // 1. Try Firestore first
  if (db) {
    try {
      const q = query(
        collection(db, NEWS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      const snap = await getDocs(q);
      articles = snap.docs.map(doc => doc.data() as ProcessedNewsArticle);
    } catch (err: any) {
      console.warn('[getLatestNews] Firestore fetch error, falling back to local news:', err.message);
    }
  }

  // 2. Fallback to local store
  if (articles.length === 0) {
    articles = readLocalNews().slice(0, count);
  }

  return articles.map(data => {
    const trans = data.translations[lang] || data.translations['en'] || Object.values(data.translations)[0];

    return {
      id: data.id,
      originalUrl: data.originalUrl,
      source: data.source,
      category: data.category,
      createdAt: data.createdAt,
      views: data.views || 0,
      isFeatured: Boolean(data.isFeatured),
      title: trans?.title || 'Untitled',
      summary: trans?.summary || '',
      content: trans?.content || '',
      keyTakeaways: trans?.keyTakeaways || [],
      tags: trans?.tags || []
    };
  });
}

/**
 * Retrieves a single news article by slug with language fallback
 */
export async function getNewsArticleById(id: string, lang: string = 'en'): Promise<any | null> {
  let data: ProcessedNewsArticle | null = null;

  if (db) {
    try {
      const ref = doc(db, NEWS_COLLECTION, id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        data = snap.data() as ProcessedNewsArticle;
        updateDoc(ref, { views: increment(1) }).catch(() => {});
      }
    } catch (err) {
      // fallback
    }
  }

  if (!data) {
    const localList = readLocalNews();
    data = localList.find(x => x.id === id) || null;
  }

  if (!data) return null;

  const trans = data.translations[lang] || data.translations['en'] || Object.values(data.translations)[0];

  return {
    id: data.id,
    originalUrl: data.originalUrl,
    source: data.source,
    category: data.category,
    createdAt: data.createdAt,
    views: (data.views || 0) + 1,
    isFeatured: Boolean(data.isFeatured),
    title: trans?.title || 'Untitled',
    summary: trans?.summary || '',
    content: trans?.content || '',
    keyTakeaways: trans?.keyTakeaways || [],
    tags: trans?.tags || [],
    availableLanguages: Object.keys(data.translations)
  };
}
