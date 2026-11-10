#!/usr/bin/env node
/**
 * Standalone Automation Script for news.togetlink.com
 * Fetches RSS/Reddit feeds, filters SaaS/AI/Tech stories, generates
 * 7-language structured content via local Ollama (Llama 3.2),
 * and persists them into the Firestore 'news' collection.
 *
 * Usage:
 *   node scripts/run-news-cron.js
 * Or with options:
 *   LIMIT=5 OLLAMA_BASE_URL=http://localhost:11434 node scripts/run-news-cron.js
 */

const { processNewsPipeline } = require('../lib/news-service');

async function main() {
  const limit = parseInt(process.env.LIMIT || '5', 10);
  console.log(`[NEWS CRON] Starting autonomous ingestion & Ollama translation pipeline...`);
  console.log(`[NEWS CRON] Target limit: ${limit} articles`);
  console.log(`[NEWS CRON] Ollama URL: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);

  const start = Date.now();
  try {
    const results = await processNewsPipeline(limit);
    const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[NEWS CRON] Finished in ${elapsedSec}s. Ingested ${results.length} articles.`);
    results.forEach((art, idx) => {
      console.log(`  ${idx + 1}. [${art.category}] ${art.translations?.en?.title || art.id} (${art.source})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(`[NEWS CRON] Pipeline failed:`, err);
    process.exit(1);
  }
}

main();
