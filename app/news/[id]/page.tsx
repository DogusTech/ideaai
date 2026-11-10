import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsArticleById } from '@/lib/news-service';
import { ArrowLeft, Globe, Sparkles, ExternalLink, Calendar, Eye, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SUPPORTED_LANGS = [
  { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'tr', label: 'TR', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
  { code: 'it', label: 'IT', flag: '🇮🇹', name: 'Italiano' },
  { code: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'ja', label: 'JA', flag: '🇯🇵', name: '日本語' },
];

interface ArticlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const lang = resolvedQuery?.lang || 'en';

  const article = await getNewsArticleById(resolvedParams.id, lang);
  if (!article) return { title: 'Article Not Found | IdeaAI News' };

  return {
    title: `${article.title} | IdeaAI News`,
    description: article.summary,
    alternates: {
      canonical: `https://news.togetlink.com/news/${resolvedParams.id}?lang=${lang}`,
      languages: {
        'en': `https://news.togetlink.com/news/${resolvedParams.id}?lang=en`,
        'tr': `https://news.togetlink.com/news/${resolvedParams.id}?lang=tr`,
        'es': `https://news.togetlink.com/news/${resolvedParams.id}?lang=es`,
        'fr': `https://news.togetlink.com/news/${resolvedParams.id}?lang=fr`,
        'it': `https://news.togetlink.com/news/${resolvedParams.id}?lang=it`,
        'de': `https://news.togetlink.com/news/${resolvedParams.id}?lang=de`,
        'ja': `https://news.togetlink.com/news/${resolvedParams.id}?lang=ja`,
      }
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://news.togetlink.com/news/${resolvedParams.id}?lang=${lang}`,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    }
  };
}

export default async function NewsArticleDetailPage({ params, searchParams }: ArticlePageProps) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const lang = resolvedQuery?.lang || 'en';

  const article = await getNewsArticleById(resolvedParams.id, lang);
  if (!article) notFound();

  // Split multi-paragraph content
  const paragraphs = article.content
    ? article.content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0)
    : [article.summary];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111613] selection:bg-[#CEF23A] selection:text-[#111613] antialiased">
      {/* Top Bar */}
      <header className="border-b border-black/[0.08] bg-[#FBFBFA]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={`/news?lang=${lang}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Transmissions
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-full border border-black/[0.06]">
            {SUPPORTED_LANGS.map(l => (
              <Link
                key={l.code}
                href={`/news/${article.id}?lang=${l.code}`}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
                  lang === l.code
                    ? 'bg-[#111613] text-white shadow-sm'
                    : 'text-black/60 hover:text-black hover:bg-black/[0.04]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Header Breadcrumbs / Tags */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-black/45 mb-4">
          <span className="text-[#1f2803] bg-[#CEF23A] px-2 py-0.5 rounded text-[10px] font-bold">
            {article.category}
          </span>
          <span>·</span>
          <span>SOURCE: {article.source}</span>
          <span>·</span>
          <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Live'}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#111613] leading-[1.14] mb-6">
          {article.title}
        </h1>

        {/* Lead Executive Summary Pill Box (PDF Style Accent Card) */}
        <div className="rounded-2xl bg-[#111613] text-white p-6 md:p-8 mb-10 shadow-lg border border-black/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#CEF23A]/10 blur-3xl pointer-events-none"></div>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#CEF23A] mb-2">
            01 · EXECUTIVE SUMMARY & CONTEXT
          </div>
          <p className="text-base md:text-lg text-white/90 leading-relaxed font-normal">
            {article.summary}
          </p>
        </div>

        {/* High Resolution Article Image if available */}
        {article.imageUrl && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-black/[0.08] shadow-sm bg-black/[0.02]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full max-h-[480px] object-cover"
            />
            <div className="p-3 px-4 bg-[#FBFBFA] border-t border-black/[0.06] text-[11px] text-black/50 flex items-center justify-between font-mono">
              <span>Verified editorial visual</span>
              <span>Source: {article.source}</span>
            </div>
          </div>
        )}

        {/* Key Takeaways Section (PDF 4-Quadrant or Structured Card Style) */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mb-12 rounded-3xl bg-white border border-black/[0.08] p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-5 h-5 rounded-md bg-[#CEF23A] text-[#111613] flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <h2 className="text-sm font-bold tracking-[0.18em] uppercase text-[#111613]">
                02 · CRITICAL INTELLIGENCE & KEY TAKEAWAYS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.keyTakeaways.map((item: string, idx: number) => {
                const num = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FBFBFA] border border-black/[0.05] flex items-start gap-3"
                  >
                    <span className="text-xs font-mono font-bold text-black/35 mt-0.5">
                      {num}
                    </span>
                    <p className="text-xs md:text-sm text-[#111613] font-medium leading-relaxed">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Body Paragraphs (Deep Reading) */}
        <div className="mb-12">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 border-b border-black/[0.06] pb-2">
            03 · THE IN-DEPTH ANALYSIS
          </div>

          <div className="space-y-6 text-base md:text-lg text-black/85 leading-relaxed font-normal">
            {paragraphs.map((p: string, idx: number) => (
              <p key={idx} className="leading-[1.75]">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Tags & External Source Citation Footer */}
        <div className="border-t border-black/[0.08] pt-8 mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {(article.tags || []).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] text-black/70 border border-black/[0.06]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111613] text-white hover:bg-[#CEF23A] hover:text-[#111613] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Read Original Coverage
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </article>

      {/* Minimal Footer */}
      <footer className="border-t border-black/[0.08] py-12 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-black/50">
          <span>IdeaAI News · Autonomous 7-Language Intelligence</span>
          <Link href={`/news?lang=${lang}`} className="hover:text-black font-semibold">
            All Stories →
          </Link>
        </div>
      </footer>
    </div>
  );
}
