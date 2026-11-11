import 'server-only'
import { createHash } from 'node:crypto'
import { fetchRssFeeds, type RawNewsItem, type RssFeedConfig } from './scraper'

const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/top-headlines'
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0'
const REDDIT_SUBREDDITS = ['technology', 'artificial', 'MachineLearning', 'programming']
const REQUEST_TIMEOUT_MS = 10_000
const TECH_RSS_FEEDS: RssFeedConfig[] = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  { name: 'Hacker News RSS', url: 'https://news.ycombinator.com/rss' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml' },
  { name: 'WIRED', url: 'https://www.wired.com/feed/rss' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/feed' },
  { name: 'Google News Technology', url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en' },
]

function rssItemsPerFeed() {
  const configured = Number.parseInt(process.env.NEWS_RSS_ITEMS_PER_FEED || '100', 10)
  return Number.isFinite(configured) ? Math.min(Math.max(configured, 5), 100) : 100
}

async function fetchConfiguredRssItems() {
  return fetchRssFeeds(TECH_RSS_FEEDS, rssItemsPerFeed())
}

function stableId(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 32)
}

function normalizeLink(link: string) {
  try {
    const url = new URL(link)
    url.hash = ''
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref$)/i.test(key)) url.searchParams.delete(key)
    }
    return url.toString().replace(/\/$/, '')
  } catch {
    return link.trim()
  }
}

/** Fetches the NewsAPI technology headlines when a server key is configured. */
export async function fetchNewsApiItems(): Promise<RawNewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return []

  const url = new URL(NEWS_API_ENDPOINT)
  url.search = new URLSearchParams({ category: 'technology', language: 'en', pageSize: '100' }).toString()
  const response = await fetch(url, {
    headers: { 'X-Api-Key': apiKey },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`NewsAPI request failed (${response.status})`)

  const payload = await response.json() as {
    articles?: Array<{ title?: string; url?: string; publishedAt?: string; description?: string; source?: { name?: string }; urlToImage?: string | null }>
  }

  return (payload.articles || []).flatMap((article): RawNewsItem[] => {
    if (!article.title || !article.url) return []
    return [{
      id: stableId(normalizeLink(article.url)),
      title: article.title.trim(),
      link: article.url,
      pubDate: article.publishedAt,
      contentSnippet: article.description || '',
      source: article.source?.name || 'NewsAPI',
      imageUrl: article.urlToImage || undefined,
    }]
  })
}

/** Uses the official Hacker News API for current top stories. */
export async function fetchHackerNewsItems(limit = 50): Promise<RawNewsItem[]> {
  const response = await fetch(`${HACKER_NEWS_API}/topstories.json`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: 300 },
  })
  if (!response.ok) throw new Error(`Hacker News top stories failed (${response.status})`)
  const ids = (await response.json() as number[]).slice(0, Math.min(Math.max(limit, 1), 50))
  const stories = await Promise.allSettled(ids.map(async (id) => {
    const itemResponse = await fetch(`${HACKER_NEWS_API}/item/${id}.json`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: 300 },
    })
    if (!itemResponse.ok) throw new Error(`Hacker News item ${id} failed (${itemResponse.status})`)
    return await itemResponse.json() as { id: number; title?: string; url?: string; time?: number; text?: string; type?: string; dead?: boolean; deleted?: boolean }
  }))

  return stories.flatMap((result): RawNewsItem[] => {
    if (result.status !== 'fulfilled') return []
    const story = result.value
    if (story.type !== 'story' || story.dead || story.deleted || !story.title) return []
    const link = story.url || `https://news.ycombinator.com/item?id=${story.id}`
    return [{
      id: stableId(normalizeLink(link)),
      title: story.title.trim(),
      link,
      pubDate: story.time ? new Date(story.time * 1000).toISOString() : undefined,
      contentSnippet: story.text || '',
      source: 'Hacker News',
    }]
  })
}

async function fetchRedditOAuthPosts(): Promise<RawNewsItem[]> {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET
  if (!clientId || !clientSecret) return []

  const userAgent = process.env.REDDIT_USER_AGENT
  if (!userAgent || /YOUR_REDDIT_USERNAME/i.test(userAgent)) {
    console.warn('[Ingestion] Reddit source is disabled until REDDIT_USER_AGENT is configured.')
    return []
  }
  const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!tokenResponse.ok) throw new Error(`Reddit OAuth token request failed (${tokenResponse.status})`)
  const tokenData = await tokenResponse.json() as { access_token?: string }
  if (!tokenData.access_token) throw new Error('Reddit OAuth response did not include an access token')

  const results = await Promise.allSettled(REDDIT_SUBREDDITS.map(async (subreddit) => {
    const url = new URL(`https://oauth.reddit.com/r/${subreddit}/hot.json`)
    url.search = new URLSearchParams({ limit: '15', raw_json: '1' }).toString()
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': userAgent },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`Reddit r/${subreddit} failed (${response.status})`)
    const payload = await response.json() as { data?: { children?: Array<{ data?: { id?: string; title?: string; permalink?: string; created_utc?: number; selftext?: string; stickied?: boolean; over_18?: boolean; thumbnail?: string } }> } }
    return (payload.data?.children || []).flatMap((child): RawNewsItem[] => {
      const post = child.data
      if (!post?.id || !post.title || !post.permalink || post.stickied || post.over_18) return []
      const link = `https://www.reddit.com${post.permalink}`
      return [{
        id: stableId(normalizeLink(link)),
        title: post.title.trim(),
        link,
        pubDate: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : undefined,
        contentSnippet: (post.selftext || '').slice(0, 800),
        source: `Reddit r/${subreddit}`,
        imageUrl: post.thumbnail?.startsWith('http') ? post.thumbnail : undefined,
      }]
    })
  }))

  const failed = results.filter((result) => result.status === 'rejected').length
  if (failed === results.length) throw new Error('All Reddit subreddit requests failed')
  return results.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
}

function deduplicate(items: RawNewsItem[]) {
  const seenLinks = new Set<string>()
  const seenTitles = new Set<string>()
  return items
    .filter((item) => item.title.trim() && item.link.trim())
    .sort((a, b) => Date.parse(b.pubDate || '') - Date.parse(a.pubDate || ''))
    .filter((item) => {
      const link = normalizeLink(item.link)
      const title = item.title.toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]/gu, '')
      if (seenLinks.has(link) || seenTitles.has(title)) return false
      seenLinks.add(link)
      seenTitles.add(title)
      item.id = stableId(link)
      return true
    })
}

/**
 * Collects Google News and publisher RSS feeds, NewsAPI, Hacker News, and Reddit.
 * Google News and HN also have RSS feeds in the legacy scraper; deduplication
 * removes overlap with their API adapters before handing candidates to Ollama.
 */
export async function fetchExternalNewsCandidates(): Promise<RawNewsItem[]> {
  const sources = [
    ['RSS / Google News', fetchConfiguredRssItems],
    ['NewsAPI', fetchNewsApiItems],
    ['Hacker News API', fetchHackerNewsItems],
    ['Reddit API', fetchRedditOAuthPosts],
  ] as const

  const results = await Promise.allSettled(sources.map(([, fetchSource]) => fetchSource()))
  const items: RawNewsItem[] = []
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') items.push(...result.value)
    else console.warn(`[Ingestion] ${sources[index][0]} source failed:`, result.reason)
  })

  return deduplicate(items)
}


