import { aggregateRawNews, scrapeArticleText, RawNewsItem } from './scraper';
import { filterRelevance, processAndTranslate, ProcessedNewsArticle } from './ollama-pipeline';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, updateDoc, increment } from 'firebase/firestore';

const NEWS_COLLECTION = 'news';

/**
 * Checks if article link or id already exists in Firestore
 */
async function isAlreadyProcessed(id: string): Promise<boolean> {
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

      // Step 4: Save to Firestore
      if (db) {
        await setDoc(doc(db, NEWS_COLLECTION, item.id), newsRecord);
        console.log(`[Pipeline] ✔ Successfully saved "${newsRecord.translations.en.title}" to Firestore.`);
      } else {
        console.warn(`[Pipeline] Firestore not configured, generated locally: ${newsRecord.id}`);
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
  if (!db) return [];

  try {
    const q = query(
      collection(db, NEWS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);

    return snap.docs.map(doc => {
      const data = doc.data() as ProcessedNewsArticle;
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
  } catch (err: any) {
    console.error('[getLatestNews] Firestore fetch error:', err.message);
    return [];
  }
}

/**
 * Retrieves a single news article by slug with language fallback
 */
export async function getNewsArticleById(id: string, lang: string = 'en'): Promise<any | null> {
  if (!db) return null;

  try {
    const ref = doc(db, NEWS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as ProcessedNewsArticle;
    const trans = data.translations[lang] || data.translations['en'] || Object.values(data.translations)[0];

    // Increment view count asynchronously
    updateDoc(ref, { views: increment(1) }).catch(() => {});

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
  } catch (err) {
    return null;
  }
}
