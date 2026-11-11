import { NextResponse } from 'next/server'
import { getNewsForSitemap } from '@/lib/news-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const NEWS_WINDOW_MS = 2 * 24 * 60 * 60 * 1000
const MAX_GOOGLE_NEWS_ENTRIES = 1000

function xml(value: unknown) {
  return String(value ?? '').replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[character]!))
}

function validDate(value?: string) {
  const parsed = value ? new Date(value) : null
  return parsed && Number.isFinite(parsed.getTime()) ? parsed : null
}

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_NEWS_DOMAIN || 'https://news.togetlink.com').replace(/\/$/, '')
  const articles = await getNewsForSitemap(1_000)
  const now = Date.now()
  let newsEntries = 0
  const entries = articles.map((article: any) => {
    const published = validDate(article.createdAt)
    const modified = validDate(article.modifiedAt)
    const newsEligible = published && now - published.getTime() <= NEWS_WINDOW_MS && published.getTime() <= now && newsEntries < MAX_GOOGLE_NEWS_ENTRIES
    const newsXml = newsEligible ? (() => {
      newsEntries++
      return `<news:news><news:publication><news:name>TogetLink News</news:name><news:language>en</news:language></news:publication><news:publication_date>${published!.toISOString()}</news:publication_date><news:title>${xml(article.title)}</news:title></news:news>`
    })() : ''
    const lastmod = modified || published
    return `<url><loc>${xml(`${baseUrl}/news/${encodeURIComponent(article.id)}`)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''}${newsXml}</url>`
  }).join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"><url><loc>${xml(`${baseUrl}/news`)}</loc></url>${entries}</urlset>`
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=0, must-revalidate',
    },
  })
}
