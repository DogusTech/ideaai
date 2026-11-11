import { NextRequest, NextResponse } from 'next/server'
import { getLatestNews, getNewsArticleById, getNewsPage } from '@/lib/news-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const lang = searchParams.get('lang') || 'en'

    if (id) {
      const article = await getNewsArticleById(id, lang)
      if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      return NextResponse.json({ success: true, article })
    }

    const cursor = searchParams.get('cursor') || undefined
    const requestedSize = Number(searchParams.get('limit') || 12)
    const pageSize = Number.isFinite(requestedSize) ? Math.min(Math.max(requestedSize, 1), 24) : 12
    if (cursor) {
      const page = await getNewsPage(lang, pageSize, cursor)
      return NextResponse.json(page, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } })
    }

    const limit = Number(searchParams.get('limit')) || 20
    const news = await getLatestNews(lang, limit)
    return NextResponse.json({ success: true, news })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch news'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}