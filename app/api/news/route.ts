import { NextRequest, NextResponse } from 'next/server';
import { getLatestNews, getNewsArticleById } from '@/lib/news-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const lang = searchParams.get('lang') || 'en';
    const limit = Number(searchParams.get('limit')) || 20;

    if (id) {
      const article = await getNewsArticleById(id, lang);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, article });
    }

    const news = await getLatestNews(lang, limit);
    return NextResponse.json({ success: true, news });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
