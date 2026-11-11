import 'server-only';
import { fetchExternalNewsCandidates } from './news-sources';
import { scrapeArticleTextAndImage } from './scraper';
import { filterRelevance, processAndTranslate, type NewsTranslation, type ProcessedNewsArticle } from './ollama-pipeline';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from './firebase-admin';
import fs from 'fs';
import path from 'path';

function getNewsDatabase() {
  try {
    return getAdminDb();
  } catch (error) {
    console.warn('[News] Firebase Admin database unavailable; using local news storage:', error);
    return null;
  }
}
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
 * Checks Firestore first. A prior local-only record can be reprocessed if its
 * Firestore write failed, allowing a later run to complete the sync.
 */
function normalizeArticleUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return value.trim();
  }
}

function createRawArticleRecord(item: Awaited<ReturnType<typeof fetchExternalNewsCandidates>>[number]): ProcessedNewsArticle {
  const summary = (item.contentSnippet || '').trim().slice(0, 600);
  const translation: NewsTranslation = {
    title: item.title.trim(),
    summary,
    content: (item.rawText || item.contentSnippet || '').trim().slice(0, 3000),
    keyTakeaways: [],
    tags: [],
  };
  const timestamp = new Date().toISOString();
  const sourcePublishedAt = item.pubDate && Number.isFinite(Date.parse(item.pubDate))
    ? new Date(item.pubDate).toISOString()
    : undefined;
  const titleAndSnippet = `${item.title} ${summary}`;
  const category: ProcessedNewsArticle['category'] = /\b(ai|llm|artificial intelligence|machine learning|model)\b/i.test(titleAndSnippet)
    ? 'AI'
    : /\b(startup|funding|venture|seed round)\b/i.test(titleAndSnippet)
      ? 'Startups'
      : 'Tech';

  return {
    id: item.id,
    originalUrl: item.link,
    source: item.source,
    category,
    createdAt: timestamp,
    modifiedAt: timestamp,
    ...(sourcePublishedAt ? { sourcePublishedAt } : {}),
    ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
    translations: { en: translation, tr: translation, es: translation, fr: translation, it: translation, ja: translation, de: translation },
    views: 0,
    isFeatured: false,
  };
}

/** Fast mode persists source metadata without waiting on page scraping or Ollama. */
async function ingestRawCandidates(items: Awaited<ReturnType<typeof fetchExternalNewsCandidates>>, maxItems: number) {
  const localArticles = readLocalNews();
  const knownIds = new Set(localArticles.map((article) => article.id));
  const knownUrls = new Set(localArticles.map((article) => normalizeArticleUrl(article.originalUrl || '')));
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const freshCandidates = items.filter((item) => {
    const normalizedUrl = normalizeArticleUrl(item.link);
    if (knownIds.has(item.id) || knownUrls.has(normalizedUrl) || seenIds.has(item.id) || seenUrls.has(normalizedUrl)) return false;
    seenIds.add(item.id);
    seenUrls.add(normalizedUrl);
    return true;
  }).slice(0, maxItems);

  const newsDb = getNewsDatabase();
  const existingIds = new Set<string>();
  const existingUrls = new Set<string>();
  if (newsDb && freshCandidates.length) {
    try {
      for (let offset = 0; offset < freshCandidates.length; offset += 400) {
        const chunk = freshCandidates.slice(offset, offset + 400);
        const refs = chunk.map((item) => newsDb.collection(NEWS_COLLECTION).doc(item.id));
        const snapshots = await newsDb.getAll(...refs);
        snapshots.forEach((snapshot) => { if (snapshot.exists) existingIds.add(snapshot.id); });
      }
      const links = [...new Set(freshCandidates.map((item) => item.link))];
      const urlQueries = [];
      for (let offset = 0; offset < links.length; offset += 30) {
        const chunk = links.slice(offset, offset + 30);
        if (chunk.length) urlQueries.push(newsDb.collection(NEWS_COLLECTION).where('originalUrl', 'in', chunk).get());
      }
      const urlSnapshots = await Promise.all(urlQueries);
      urlSnapshots.forEach((snapshot) => snapshot.docs.forEach((doc) => {
        const originalUrl = doc.get('originalUrl');
        if (typeof originalUrl === 'string') existingUrls.add(normalizeArticleUrl(originalUrl));
      }));
    } catch (error) {
      console.warn('[Pipeline] Fast Firestore duplicate scan failed; retaining deterministic ID and local duplicate checks:', error);
    }
  }

  const newRecords = freshCandidates
    .filter((item) => !existingIds.has(item.id) && !existingUrls.has(normalizeArticleUrl(item.link)))
    .map(createRawArticleRecord);

  let firestoreSyncedCount = 0;
  if (newRecords.length) {
    saveLocalNews([...newRecords, ...localArticles]);
    const dbBatchSize = 400;
    if (newsDb) {
      for (let offset = 0; offset < newRecords.length; offset += dbBatchSize) {
        const chunk = newRecords.slice(offset, offset + dbBatchSize);
        try {
          const batch = newsDb.batch();
          chunk.forEach((record) => batch.set(newsDb.collection(NEWS_COLLECTION).doc(record.id), record));
          await batch.commit();
          firestoreSyncedCount += chunk.length;
        } catch (error) {
          console.error(`[Pipeline] Fast Firestore batch failed at offset ${offset}; local copy retained:`, error);
        }
      }
    }
  }

  return {
    processedCount: newRecords.length,
    firestoreSyncedCount,
    candidateCount: items.length,
    duplicateCount: items.length - newRecords.length,
    fastMode: true,
    stoppedForTimeBudget: false,
  };
}

async function isAlreadyProcessed(
  id: string,
  originalUrl: string,
  knownIds: Set<string>,
  knownUrls: Set<string>,
): Promise<boolean> {
  const normalizedUrl = normalizeArticleUrl(originalUrl);
  const localExists = knownIds.has(id) || knownUrls.has(normalizedUrl);
  const newsDb = getNewsDatabase();
  if (!newsDb) return localExists;
  try {
    const snapshot = await newsDb.collection(NEWS_COLLECTION).doc(id).get();
    if (snapshot.exists) return true;
    const urlQueries = [normalizedUrl, ...(originalUrl !== normalizedUrl ? [originalUrl] : [])]
      .map((url) => newsDb.collection(NEWS_COLLECTION).where('originalUrl', '==', url).limit(1).get());
    const matchingUrls = await Promise.all(urlQueries);
    return matchingUrls.some((result) => !result.empty) || localExists;
  } catch {
    return localExists;
  }
}

/** Collects sources, processes candidates through Ollama, then persists results. */
export async function runIngestionPipeline(options: { maxItems?: number; fast?: boolean; noTimeout?: boolean } = {}) {
  const fast = options.fast === true;
  const noTimeout = options.noTimeout === true;
  const startedAt = Date.now();
  const hardLimit = fast || noTimeout ? 1_000 : 50;
  const configuredMax = Number.parseInt(process.env.NEWS_INGEST_MAX_ITEMS || String(hardLimit), 10);
  const maxAllowed = fast || noTimeout
    ? hardLimit
    : Number.isFinite(configuredMax) ? Math.min(Math.max(configuredMax, 1), hardLimit) : hardLimit;
  const requestedMax = Number.isFinite(options.maxItems) ? Number(options.maxItems) : fast || noTimeout ? hardLimit : 50;
  const maxItems = Math.min(Math.max(Math.floor(requestedMax), 1), maxAllowed);
  const configuredBudget = Number.parseInt(process.env.NEWS_INGEST_TIME_BUDGET_MS || '270000', 10);
  const timeBudgetMs = noTimeout ? Number.POSITIVE_INFINITY : Number.isFinite(configuredBudget) ? Math.min(Math.max(configuredBudget, 30_000), 270_000) : 240_000;
  console.log(`[Pipeline] Collecting multi-source news (target: ${maxItems} processed articles)...`);

  const rawItems = await fetchExternalNewsCandidates();
  if (fast) return ingestRawCandidates(rawItems, maxItems);
  const candidateLimit = Math.min(rawItems.length, maxItems * 8);
  console.log(`[Pipeline] Collected ${rawItems.length} candidates; processing up to ${candidateLimit}.`);

  let processedCount = 0;
  let firestoreSyncedCount = 0;
  let stoppedForTimeBudget = false;
  const localArticles = readLocalNews();
  const knownIds = new Set(localArticles.map((article) => article.id));
  const knownUrls = new Set(localArticles.map((article) => normalizeArticleUrl(article.originalUrl || '')));
  const newsDb = getNewsDatabase();

  for (const item of rawItems.slice(0, candidateLimit)) {
    if (processedCount >= maxItems) break;
    const remainingMs = timeBudgetMs - (Date.now() - startedAt);
    if (remainingMs < 12_000) {
      console.log('[Pipeline] Stopping before the configured execution time budget.');
      stoppedForTimeBudget = true;
      break;
    }
    if (await isAlreadyProcessed(item.id, item.link, knownIds, knownUrls)) continue;

    let bodyText = item.rawText || item.contentSnippet || '';
    let imageUrl = item.imageUrl;
    try {
      const scraped = await scrapeArticleTextAndImage(item.link);
      if (scraped.text.length > bodyText.length) bodyText = scraped.text;
      if (!imageUrl && scraped.imageUrl) imageUrl = scraped.imageUrl;
    } catch (error) {
      console.warn(`[Pipeline] Could not enrich article ${item.id}:`, error);
    }

    const filterBudget = timeBudgetMs - (Date.now() - startedAt);
    if (filterBudget < 8_000) {
      stoppedForTimeBudget = true;
      break;
    }
    const relevance = await filterRelevance(item.title, bodyText, noTimeout ? 0 : Math.min(30_000, filterBudget - 5_000));
    if (!relevance.isRelevant) continue;

    try {
      const translationBudget = timeBudgetMs - (Date.now() - startedAt);
      if (translationBudget < 10_000) {
        stoppedForTimeBudget = true;
        break;
      }
      const translations = await processAndTranslate(item.title, bodyText || item.title, relevance.category, noTimeout ? 0 : Math.min(180_000, translationBudget - 5_000));
      const sourcePublishedAt = item.pubDate && Number.isFinite(Date.parse(item.pubDate))
        ? new Date(item.pubDate).toISOString()
        : undefined;
      const publishedAt = new Date().toISOString();
      const newsRecord: ProcessedNewsArticle = {
        id: item.id,
        originalUrl: item.link,
        source: item.source,
        category: relevance.category,
        createdAt: publishedAt,
        modifiedAt: publishedAt,
        ...(sourcePublishedAt ? { sourcePublishedAt } : {}),
        ...(imageUrl ? { imageUrl } : {}),
        translations,
        views: 0,
        isFeatured: processedCount === 0,
      };

      const existingIndex = localArticles.findIndex((article) => article.id === newsRecord.id);
      if (existingIndex >= 0) localArticles[existingIndex] = newsRecord;
      else localArticles.unshift(newsRecord);
      saveLocalNews(localArticles);
      knownIds.add(newsRecord.id);
      knownUrls.add(normalizeArticleUrl(newsRecord.originalUrl));

      if (newsDb) {
        try {
          await newsDb.collection(NEWS_COLLECTION).doc(newsRecord.id).set(newsRecord);
          firestoreSyncedCount++;
        } catch (error) {
          console.error(`[Pipeline] Firestore write failed for ${newsRecord.id}; retained in local store:`, error);
        }
      }

      processedCount++;
      console.log(`[Pipeline] Processed ${newsRecord.translations.en.title} (${relevance.category}, ${item.source}).`);
    } catch (error) {
      console.error(`[Pipeline] Ollama processing failed for ${item.id}:`, error);
    }
  }

  console.log(`[Pipeline] Finished: ${processedCount} processed, ${firestoreSyncedCount} synced to Firestore.`);
  return { processedCount, firestoreSyncedCount, candidateCount: rawItems.length, stoppedForTimeBudget };
}

/** Loads the newest published records for XML sitemaps, with local storage fallback. */
export async function getNewsForSitemap(maxCount = 50_000): Promise<Array<any>> {
  const safeCount = Math.min(Math.max(Math.floor(maxCount), 1), 50_000);
  const articles: ProcessedNewsArticle[] = [];
  const newsDb = getNewsDatabase();
  if (newsDb) {
    try {
      let cursor: any;
      while (articles.length < safeCount) {
        const query = newsDb.collection(NEWS_COLLECTION).orderBy('createdAt', 'desc');
        const pageLimit = Math.min(500, safeCount - articles.length);
        const snapshot = await (cursor ? query.startAfter(cursor) : query).limit(pageLimit).get();
        if (snapshot.empty) break;
        articles.push(...snapshot.docs.map((doc) => doc.data() as ProcessedNewsArticle));
        cursor = snapshot.docs[snapshot.docs.length - 1];
        if (snapshot.size < pageLimit) break;
      }
      if (articles.length) return articles.map((article) => ({
        ...localizeNewsArticle(article, 'en'),
        modifiedAt: article.modifiedAt || article.createdAt,
        sourcePublishedAt: article.sourcePublishedAt,
      }));
    } catch (error) {
      console.warn('[getNewsForSitemap] Firestore fetch error, falling back to local news:', error);
    }
  }
  return readLocalNews().slice(0, safeCount).map((article) => ({
    ...localizeNewsArticle(article, 'en'),
    modifiedAt: article.modifiedAt || article.createdAt,
    sourcePublishedAt: article.sourcePublishedAt,
  }));
}
function localizeNewsArticle(data: ProcessedNewsArticle, lang: string) {
  const translation = data.translations?.[lang] || data.translations?.en || { title: 'Untitled', summary: '', content: '', keyTakeaways: [], tags: [] };
  return {
    id: data.id,
    originalUrl: data.originalUrl,
    source: data.source,
    category: data.category,
    createdAt: data.createdAt,
    modifiedAt: data.modifiedAt || data.createdAt,
    sourcePublishedAt: data.sourcePublishedAt,
    imageUrl: data.imageUrl,
    views: data.views || 0,
    isFeatured: Boolean(data.isFeatured),
    title: translation?.title || 'Untitled',
    summary: translation?.summary || '',
    content: translation?.content || '',
    keyTakeaways: translation?.keyTakeaways || [],
    tags: translation?.tags || [],
  };
}

/** Retrieves a bounded page from Firestore, with local-file fallback and English locale fallback. */
export async function getLatestNews(lang: string = 'en', count: number = 20): Promise<Array<any>> {
  const safeCount = Math.min(Math.max(Math.floor(count), 1), 100);
  let articles: ProcessedNewsArticle[] = [];
  const newsDb = getNewsDatabase();
  if (newsDb) {
    try {
      const snapshot = await newsDb.collection(NEWS_COLLECTION).orderBy('createdAt', 'desc').limit(safeCount).get();
      articles = snapshot.docs.map((item) => item.data() as ProcessedNewsArticle);
    } catch (error) {
      console.warn('[getLatestNews] Firestore fetch error, falling back to local news:', error);
    }
  }
  if (articles.length === 0) articles = readLocalNews().slice(0, safeCount);
  return articles.map((article) => localizeNewsArticle(article, lang));
}

/** Fetches one cursor-based page for the news feed. The cursor is the last article id. */
export async function getNewsPage(lang: string = 'en', pageSize: number = 12, cursor?: string) {
  const safePageSize = Math.min(Math.max(Math.floor(pageSize), 1), 24);
  let records: ProcessedNewsArticle[] = [];
  let fallbackToLocal = true;
  const newsDb = getNewsDatabase();

  if (newsDb) {
    try {
      let pageQuery = newsDb.collection(NEWS_COLLECTION).orderBy('createdAt', 'desc');
      if (cursor) {
        const cursorSnapshot = await newsDb.collection(NEWS_COLLECTION).doc(cursor).get();
        if (cursorSnapshot.exists) pageQuery = pageQuery.startAfter(cursorSnapshot);
        else fallbackToLocal = false;
      }
      if (!cursor || fallbackToLocal) {
        const snapshot = await pageQuery.limit(safePageSize + 1).get();
        records = snapshot.docs.map((item) => item.data() as ProcessedNewsArticle);
        fallbackToLocal = !cursor && records.length === 0;
      }
    } catch (error) {
      console.warn('[getNewsPage] Firestore fetch error, falling back to local news:', error);
    }
  }

  if (fallbackToLocal) {
    const local = readLocalNews();
    const cursorIndex = cursor ? local.findIndex((article) => article.id === cursor) : -1;
    records = local.slice(cursorIndex + 1, cursorIndex + 1 + safePageSize + 1);
  }

  const hasMore = records.length > safePageSize;
  const page = records.slice(0, safePageSize);
  return {
    articles: page.map((article) => localizeNewsArticle(article, lang)),
    nextCursor: hasMore ? page[page.length - 1]?.id : undefined,
  };
}

/** Retrieves a single article and increments its view count. */
export async function getNewsArticleById(id: string, lang: string = 'en'): Promise<any | null> {
  let data: ProcessedNewsArticle | null = null;
  const newsDb = getNewsDatabase();
  if (newsDb) {
    try {
      const ref = newsDb.collection(NEWS_COLLECTION).doc(id);
      const snapshot = await ref.get();
      if (snapshot.exists) {
        data = snapshot.data() as ProcessedNewsArticle;
        void ref.update({ views: FieldValue.increment(1) }).catch(() => {});
      }
    } catch {
      // Fall through to local storage when Firestore is unavailable.
    }
  }
  if (!data) data = readLocalNews().find((article) => article.id === id) || null;
  if (!data) return null;

  return {
    ...localizeNewsArticle(data, lang),
    views: (data.views || 0) + 1,
    availableLanguages: Object.keys(data.translations || {}),
  };
}
