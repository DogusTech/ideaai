import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { runIngestionPipeline } from '@/lib/news-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET
  if (!configuredSecret?.trim()) return false

  const { searchParams } = new URL(request.url)
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const providedSecret = searchParams.get('secret')?.trim() || bearer?.trim() || ''
  const expected = Buffer.from(configuredSecret.trim())
  const actual = Buffer.from(providedSecret)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const fast = searchParams.get('fast')?.toLowerCase() === 'true'
    const configuredBatch = Number.parseInt(process.env.NEWS_INGEST_BATCH_SIZE || '50', 10)
    const configuredMax = Number.parseInt(process.env.NEWS_INGEST_MAX_ITEMS || '50', 10)
    const maxAllowed = fast ? 1_000 : Number.isFinite(configuredMax) ? Math.min(Math.max(configuredMax, 1), 50) : 50
    const defaultLimit = fast
      ? 1_000
      : Number.isFinite(configuredBatch) ? Math.min(Math.max(configuredBatch, 1), maxAllowed) : maxAllowed
    const requestedLimit = Number(searchParams.get('limit') || defaultLimit)
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), maxAllowed) : defaultLimit
    const result = await runIngestionPipeline({ maxItems: limit, fast })
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal pipeline error'
    console.error('[News Sync] Pipeline failed:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
