import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { runIngestionPipeline } = await import('../lib/news-service');

function parseLimit(args: string[]) {
  const equalsArg = args.find((arg) => arg.startsWith('--limit='));
  const indexArg = args.indexOf('--limit');
  const raw = equalsArg?.slice('--limit='.length)
    ?? (indexArg >= 0 ? args[indexArg + 1] : undefined)
    ?? process.env.LIMIT
    ?? '1000';
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 1_000) : 1_000;
}

async function main() {
  const args = process.argv.slice(2);
  const fast = args.includes('--fast');
  const limit = parseLimit(args);
  const start = Date.now();

  console.log(`[NEWS SYNC] Starting ${fast ? 'fast metadata' : 'Ollama AI'} ingestion for up to ${limit} articles.`);
  console.log(`[NEWS SYNC] Ollama URL: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);

  try {
    const result = await runIngestionPipeline({ maxItems: limit, fast, noTimeout: true });
    console.log(`[NEWS SYNC] Completed in ${((Date.now() - start) / 1_000).toFixed(1)}s.`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('[NEWS SYNC] Ingestion failed:', error);
    process.exitCode = 1;
  }
}

void main();
