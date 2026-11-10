import React from 'react';
import Link from 'next/link';
import { Newspaper, Sparkles, Globe, TrendingUp, ExternalLink, Flame, Bookmark } from 'lucide-react';
import { getLatestNews } from '@/lib/news-service';
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

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const lang = resolved?.lang || 'en';

  const titles: Record<string, string> = {
    en: 'IdeaAI News | Global Tech, SaaS & AI Intelligence',
    tr: 'IdeaAI Haberler | Küresel Yapay Zeka, SaaS ve Teknoloji Gündemi',
    es: 'IdeaAI Noticias | Inteligencia Global de IA, SaaS y Tecnología',
    fr: 'IdeaAI Actualités | Veille Mondiale Tech, IA & SaaS',
    it: 'IdeaAI Notizie | Notizie Globali su IA, SaaS e Tecnologia',
    de: 'IdeaAI Nachrichten | Globale KI-, SaaS- & Tech-News',
    ja: 'IdeaAI ニュース | 世界のAI・SaaS・最新テクノロジー速報'
  };

  return {
    title: titles[lang] || titles.en,
    description: 'Autonomous global tech news platform powered by local Llama 3.2 Ollama intelligence.',
    alternates: {
      canonical: `https://news.togetlink.com/news?lang=${lang}`
    }
  };
}

export default async function NewsPlatformPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const currentLang = resolved?.lang || 'en';

  const articles = await getLatestNews(currentLang, 25);
  const featured = articles.find(a => a.isFeatured) || articles[0];
  const listArticles = articles.filter(a => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/news?lang=${currentLang}`} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-zinc-900">IdeaAI<span className="text-indigo-600">News</span></span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-600 rounded">Llama 3.2 Live</span>
              </div>
            </Link>
          </div>

          {/* i18n Language Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <Globe className="w-4 h-4 text-zinc-400 mr-1 hidden md:block" />
            {SUPPORTED_LANGS.map(lang => (
              <Link
                key={lang.code}
                href={`/news?lang=${lang.code}`}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  currentLang === lang.code
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span className="mr-1">{lang.flag}</span>
                <span className="hidden lg:inline">{lang.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Featured Article */}
        {featured ? (
          <section className="mb-12">
            <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-indigo-600" />
                  {featured.category || 'Featured'}
                </span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs text-zinc-500 font-medium">{featured.source}</span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs text-zinc-400">{new Date(featured.createdAt).toLocaleDateString()}</span>
              </div>

              <Link href={`/news/${featured.id}?lang=${currentLang}`} className="group">
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors mb-4 leading-tight">
                  {featured.title}
                </h1>
              </Link>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-6 max-w-4xl">
                {featured.summary}
              </p>

              {/* Key Takeaways Preview */}
              {featured.keyTakeaways && featured.keyTakeaways.length > 0 && (
                <div className="bg-zinc-50 border border-zinc-200/70 rounded-2xl p-4 sm:p-5 mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Key Takeaways (Ollama Analysis)
                  </div>
                  <ul className="space-y-2">
                    {featured.keyTakeaways.slice(0, 3).map((item: string, idx: number) => (
                      <li key={idx} className="text-sm text-zinc-700 flex items-start gap-2">
                        <span className="text-indigo-500 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <Link
                  href={`/news/${featured.id}?lang=${currentLang}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Read full analysis →
                </Link>

                <a
                  href={featured.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Original Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center py-20 bg-white border border-[#e5e5e5] rounded-3xl mb-12">
            <Newspaper className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-zinc-700">No articles in database yet</h3>
            <p className="text-sm text-zinc-500 mt-1 mb-6">Trigger the ingestion pipeline to fetch live news from RSS & Reddit.</p>
            <a
              href="/api/news/sync"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Trigger Pipeline Now
            </a>
          </div>
        )}

        {/* Latest Stream Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Latest Localized Stories
            </h2>
            <span className="text-xs text-zinc-500">Auto-translated by Llama 3.2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listArticles.map((article: any) => (
              <article
                key={article.id}
                className="bg-white border border-[#e5e5e5] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-zinc-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-[11px]">
                      {article.category || 'Tech'}
                    </span>
                    <span>{article.source}</span>
                  </div>

                  <Link href={`/news/${article.id}?lang=${currentLang}`}>
                    <h3 className="font-bold text-base text-zinc-900 group-hover:text-indigo-600 transition-colors mb-2.5 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/news/${article.id}?lang=${currentLang}`}
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
