import { NextRequest, NextResponse } from 'next/server';
import { runIngestionPipeline } from '@/lib/news-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow sufficient time for local Ollama analysis

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET || 'ideaai_news_cron_secret';

    // Optional lightweight secret check for cron triggers
    if (secret && secret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limitParam = Number(searchParams.get('limit')) || 3;
    const result = await runIngestionPipeline({ maxItems: limitParam });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (error: any) {
    console.error('Error in news sync API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal pipeline error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
