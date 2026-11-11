import 'server-only'
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

export interface RawNewsItem {
  id: string;
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  source: string;
  rawText?: string;
  imageUrl?: string;
}

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) IdeaAI-NewsBot/1.0',
    'Accept': 'application/rss+xml, text/xml, */*'
  }
});

export interface RssFeedConfig { name: string; url: string }

const RSS_FEEDS: RssFeedConfig[] = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { name: 'Google News Tech', url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en' }
];

const REDDIT_SUBREDDITS = ['SaaS', 'ArtificialIntelligence', 'webdev'];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 90) + '-' + Math.random().toString(36).substring(2, 7);
}

/**
 * Scrapes clean readable text and lead image from target webpage URL using Cheerio
 */
export async function scrapeArticleTextAndImage(url: string): Promise<{ text: string; imageUrl?: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) IdeaAI-NewsBot/1.0',
        'Accept': 'text/html,application/xhtml+xml'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) return { text: '' };
    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract high-resolution OpenGraph or Twitter preview image
    let imageUrl = 
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('article img').first().attr('src');

    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        imageUrl = new URL(imageUrl, url).href;
      } catch {
        imageUrl = undefined;
      }
    }

    // Remove noise
    $('script, style, noscript, nav, header, footer, svg, iframe, form').remove();

    // Prioritize main article selectors
    let text = $('article, main, .article-content, .entry-content, .post-content').text();
    if (!text || text.trim().length < 200) {
      text = $('body').text();
    }

    return {
      text: text.replace(/\s+/g, ' ').trim().slice(0, 3000),
      imageUrl
    };
  } catch (error) {
    return { text: '' };
  }
}

export async function scrapeArticleText(url: string): Promise<string> {
  const res = await scrapeArticleTextAndImage(url);
  return res.text;
}

/** Fetches a bounded number of recent entries from each configured RSS feed. */
export async function fetchRssFeeds(feeds: RssFeedConfig[] = RSS_FEEDS, itemsPerFeed = 4): Promise<RawNewsItem[]> {
  const perFeedLimit = Math.min(Math.max(Math.floor(itemsPerFeed), 1), 100);
  const results = await Promise.allSettled(feeds.map(async (feed) => {
    const feedData = await parser.parseURL(feed.url);
    return (feedData.items || []).slice(0, perFeedLimit).flatMap((entry): RawNewsItem[] => {
      if (!entry.title || !entry.link) return [];
      const entryAny = entry as any;
      const imageUrl = entryAny.enclosure?.url ||
        entryAny['media:content']?.['$']?.url ||
        entryAny['media:thumbnail']?.['$']?.url;
      return [{
        id: generateSlug(entry.title),
        title: entry.title.trim(),
        link: entry.link.trim(),
        pubDate: entry.pubDate || new Date().toISOString(),
        contentSnippet: entry.contentSnippet || entry.summary || '',
        source: feed.name,
        imageUrl: imageUrl || undefined,
      }];
    });
  }));

  const items: RawNewsItem[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') items.push(...result.value);
    else console.warn(`[Ingestion] Failed to parse RSS feed ${feeds[index].name}:`, result.reason);
  });
  return items;
}
/**
 * Ingests latest relevant discussions from Reddit JSON endpoints
 */
export async function fetchRedditPosts(): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = [];

  for (const sub of REDDIT_SUBREDDITS) {
    try {
      const url = `https://www.reddit.com/r/${sub}/hot.json?limit=5`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) IdeaAI-Bot/1.0'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!res.ok) continue;
      const data = await res.json();
      const posts = data?.data?.children || [];

      for (const p of posts) {
        const post = p.data;
        if (!post || post.stickied || post.over_18) continue;
        items.push({
          id: generateSlug(post.title),
          title: post.title.trim(),
          link: `https://reddit.com${post.permalink}`,
          pubDate: new Date(post.created_utc * 1000).toISOString(),
          contentSnippet: (post.selftext || '').slice(0, 400),
          source: `Reddit r/${sub}`
        });
      }
    } catch (err: any) {
      console.warn(`[Ingestion] Failed to fetch Reddit r/${sub}:`, err.message);
    }
  }

  return items;
}

/**
 * Aggregates all raw news items from every source
 */
export async function aggregateRawNews(): Promise<RawNewsItem[]> {
  const [rssItems, redditItems] = await Promise.all([
    fetchRssFeeds(),
    fetchRedditPosts()
  ]);

  // Combine and deduplicate by clean title
  const seenTitles = new Set<string>();
  const aggregated: RawNewsItem[] = [];

  for (const item of [...rssItems, ...redditItems]) {
    const key = item.title.toLowerCase().replace(/\W/g, '');
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      aggregated.push(item);
    }
  }

  return aggregated;
}
