import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsArticleById } from '@/lib/news-service';
import { ArrowLeft, Globe, Sparkles, ExternalLink, Calendar, Eye, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SUPPORTED_LANGS = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
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
      siteName: 'IdeaAI News',
      type: 'article',
      publishedTime: article.createdAt,
    }
  };
}

export default async function NewsArticleDetailPage({ params, searchParams }: ArticlePageProps) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const currentLang = resolvedQuery?.lang || 'en';

  const article = await getNewsArticleById(resolvedParams.id, currentLang);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href={`/news?lang=${currentLang}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-zinc-400 mr-1 hidden sm:block" />
            {SUPPORTED_LANGS.map(lang => (
              <Link
                key={lang.code}
                href={`/news/${article.id}?lang=${lang.code}`}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                  currentLang === lang.code
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{lang.flag}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <article className="bg-white border border-[#e5e5e5] rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-6">
            <span className="px-2.5 py-1 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {article.category}
            </span>
            <span>Source: <strong className="text-zinc-700">{article.source}</strong></span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" /> {article.views} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-zinc-50 border-l-4 border-indigo-500 mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Executive Summary
            </div>
            <p className="text-zinc-700 leading-relaxed text-sm sm:text-base">
              {article.summary}
            </p>
          </div>

          {/* Key Takeaways */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-violet-50/50 border border-indigo-100">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Key Takeaways (Llama 3.2 Analysis)
              </div>
              <ul className="space-y-2.5">
                {article.keyTakeaways.map((takeaway: string, idx: number) => (
                  <li key={idx} className="text-sm text-zinc-800 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* In-depth 3-paragraph Article Content */}
          <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed space-y-4 mb-8">
            {article.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="text-base sm:text-lg">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-zinc-100 mb-8">
              <Tag className="w-3.5 h-3.5 text-zinc-400 mr-1" />
              {article.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}

          {/* External Citation Link */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Verified from primary source: <strong className="text-zinc-700">{article.source}</strong>
            </span>
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Original Article <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
