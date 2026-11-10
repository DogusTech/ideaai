/**
 * Standalone Automation Script for news.togetlink.com
 * Fetches RSS/Reddit feeds, filters SaaS/AI/Tech stories, generates
 * 7-language structured content via local Ollama (Llama 3.2),
 * and persists them into the Firestore 'news' collection.
 *
 * Usage:
 *   pnpm dlx tsx scripts/run-news-cron.ts
 * Or:
 *   LIMIT=5 OLLAMA_BASE_URL=http://localhost:11434 pnpm dlx tsx scripts/run-news-cron.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { runIngestionPipeline } from '../lib/news-service';

async function main() {
  const limitCount = parseInt(process.env.LIMIT || '1', 10);
  console.log(`[NEWS CRON] Starting autonomous ingestion & Ollama translation pipeline...`);
  console.log(`[NEWS CRON] Target limit: ${limitCount} articles`);
  console.log(`[NEWS CRON] Ollama URL: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);

  const start = Date.now();
  try {
    const result = await runIngestionPipeline({ maxItems: limitCount });
    const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[NEWS CRON] Finished in ${elapsedSec}s. Successfully processed ${result.processedCount} articles.`);
    process.exit(0);
  } catch (err) {
    console.error(`[NEWS CRON] Pipeline failed:`, err);
    process.exit(1);
  }
}

main();
