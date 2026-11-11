import React from 'react';
import Link from 'next/link';
import { Newspaper, Sparkles, Globe, TrendingUp, ExternalLink, Flame, ArrowRight, Clock } from 'lucide-react';
import { getLatestNews } from '@/lib/news-service';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SUPPORTED_LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'tr', label: 'TR', name: 'Türkçe' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'ja', label: 'JA', name: '日本語' },
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
    description: 'Autonomous global tech and SaaS media platform powered by local Llama 3.2 intelligence.',
    alternates: {
      canonical: `https://news.togetlink.com/news?lang=${lang}`
    }
  };
}

export default async function NewsPlatformPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const currentLang = resolved?.lang || 'en';

  const articles = await getLatestNews(currentLang, 30);
  const heroPrimary = articles[0]; // Big Lead Story
  const heroSecondary = articles[1]; // Secondary Sub-hero next to it
  const topHeadlines = articles.slice(2, 6); // Top headlines sidebar
  const latestFeed = articles.slice(1); // Grid & stream below

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111613] selection:bg-[#CEF23A] selection:text-[#111613] antialiased">
      {/* Category Navigation Bar (inspired by TechCrunch 2nd/3rd screenshot) */}
      <div className="bg-[#111613] text-white text-[11px] font-bold tracking-wider uppercase border-b border-black">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <span className="text-[#CEF23A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CEF23A] animate-pulse"></span>
              Live Feed
            </span>
            <span className="text-white/80 hover:text-white cursor-pointer">AI & LLMs</span>
            <span className="text-white/80 hover:text-white cursor-pointer">Startups</span>
            <span className="text-white/80 hover:text-white cursor-pointer">DevTools</span>
            <span className="text-white/80 hover:text-white cursor-pointer">Hardware</span>
            <span className="text-white/80 hover:text-white cursor-pointer">Enterprise</span>
          </div>
          <div className="flex items-center gap-1 pl-4">
            {SUPPORTED_LANGS.map(lang => (
              <Link
                key={lang.code}
                href={`/news?lang=${lang.code}`}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  currentLang === lang.code
                    ? 'bg-[#CEF23A] text-[#111613]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header / Masthead */}
      <header className="border-b border-black/[0.08] bg-[#FBFBFA]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#111613] text-[#CEF23A] flex items-center justify-center font-extrabold text-sm tracking-wider shadow-sm">
              TC
            </div>
            <Link href={`/news?lang=${currentLang}`} className="text-2xl font-black tracking-tight text-[#111613] flex items-center gap-1">
              IdeaAI <span className="text-[#059669]">Intelligence</span>
            </Link>
            <span className="ml-2 hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#CEF23A] text-[#111613]">
              Autonomous Edition
            </span>
          </div>

          <div className="text-xs text-black/50 font-medium hidden sm:block">
            {new Date().toLocaleDateString(currentLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Hero Showcase (Exact Layout of TechCrunch 2nd/3rd screenshots) */}
      <section className="bg-[#059669] text-white py-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Top Stories
            </h2>
            <span className="text-xs font-bold tracking-widest uppercase bg-black/20 text-white px-3 py-1 rounded-full">
              Real-time Ingestion
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Featured Big Story (Left) */}
            {heroPrimary && (
              <div className="lg:col-span-8 group">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/20 mb-4 shadow-xl border border-white/10">
                  {heroPrimary.imageUrl ? (
                    <img
                      src={heroPrimary.imageUrl}
                      alt={heroPrimary.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111613] flex items-center justify-center">
                      <span className="text-[#CEF23A] font-bold text-lg">IdeaAI Intelligence</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#111613] text-[#CEF23A] shadow-md">
                      {heroPrimary.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-white/80 font-semibold mb-2">
                  <span>Source: {heroPrimary.source}</span>
                  <span>•</span>
                  <span>{heroPrimary.createdAt ? new Date(heroPrimary.createdAt).toLocaleTimeString(currentLang, { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                </div>

                <Link href={`/news/${heroPrimary.id}?lang=${currentLang}`}>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-white hover:text-[#CEF23A] transition-colors leading-[1.2]">
                    {heroPrimary.title}
                  </h3>
                </Link>
                <p className="mt-3 text-sm md:text-base text-white/90 font-normal leading-relaxed line-clamp-2 max-w-3xl">
                  {heroPrimary.summary}
                </p>
              </div>
            )}

            {/* Right Sidebar: Top Headlines List (Matches TechCrunch 2nd/3rd screenshot sidebar) */}
            <div className="lg:col-span-4 bg-[#047857]/40 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <h4 className="text-lg font-black tracking-tight text-white mb-4 pb-2 border-b border-white/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CEF23A]"></span>
                Top Headlines
              </h4>

              <div className="space-y-5">
                {topHeadlines.map((item, idx) => (
                  <div key={item.id} className="group/item flex items-start gap-3">
                    <span className="w-2 h-2 rounded-sm bg-[#CEF23A] mt-1.5 flex-shrink-0"></span>
                    <div>
                      <Link href={`/news/${item.id}?lang=${currentLang}`}>
                        <h5 className="text-sm font-bold text-white hover:text-[#CEF23A] transition-colors leading-snug">
                          {item.title}
                        </h5>
                      </Link>
                      <div className="mt-1 text-[11px] text-white/70 flex items-center gap-2">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span className="text-[#CEF23A] font-semibold">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Latest News Stream (Matches TechCrunch 3rd & 4th screenshot with left images) */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Articles Stream (Left 8 Columns) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-black">
              <h3 className="text-3xl font-black tracking-tight text-[#111613]">
                Latest News
              </h3>
              <span className="text-xs font-bold text-black/50">
                {articles.length} Stories Ingested
              </span>
            </div>

            <div className="space-y-8 divide-y divide-black/[0.08]">
              {latestFeed.map((article) => (
                <article key={article.id} className="pt-8 first:pt-0 group flex flex-col sm:flex-row gap-6 items-start">
                  {/* Article Thumbnail */}
                  <div className="w-full sm:w-56 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-black/[0.04] flex-shrink-0 border border-black/[0.08] relative">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111613] text-[#CEF23A] flex items-center justify-center font-bold text-xs p-4 text-center">
                        IdeaAI Wire
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#111613] text-[#CEF23A]">
                      {article.category}
                    </span>
                  </div>

                  {/* Article Content */}
                  <div className="flex-1">
                    <div className="text-[11px] font-bold tracking-wider uppercase text-black/40 mb-1 flex items-center gap-2">
                      <span className="text-[#059669]">{article.category}</span>
                      <span>•</span>
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString(currentLang, { month: 'short', day: 'numeric' }) : 'Today'}</span>
                    </div>

                    <Link href={`/news/${article.id}?lang=${currentLang}`}>
                      <h4 className="text-xl font-extrabold text-[#111613] group-hover:text-[#059669] transition-colors leading-snug">
                        {article.title}
                      </h4>
                    </Link>

                    <p className="mt-2 text-sm text-black/65 font-normal leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>

                    {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-black/[0.06] text-xs text-black/75">
                        <span className="font-bold text-[#111613] mr-1.5">Key Insight:</span>
                        {article.keyTakeaways[0]}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Most Popular (Exact Match to 4th screenshot Purple/Lime card) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-[#4338CA] text-white rounded-2xl p-6 shadow-xl border border-black/10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                <h4 className="text-2xl font-black tracking-tight text-white">
                  Most Popular
                </h4>
                <div className="w-10 h-10 rounded-lg bg-[#CEF23A] text-[#111613] flex items-center justify-center font-bold text-lg">
                  ↗
                </div>
              </div>

              <div className="space-y-6">
                {articles.map((item, idx) => (
                  <div key={item.id} className="group/pop flex items-start gap-3">
                    <span className="w-2 h-2 rounded-sm bg-[#CEF23A] mt-2 flex-shrink-0"></span>
                    <div>
                      <Link href={`/news/${item.id}?lang=${currentLang}`}>
                        <h5 className="text-sm font-bold text-white group-hover/pop:text-[#CEF23A] transition-colors leading-snug">
                          {item.title}
                        </h5>
                      </Link>
                      <div className="text-[11px] text-white/60 mt-1">
                        {item.views} readers · {item.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter / RSS Automation Box */}
            <div className="bg-white rounded-2xl p-6 border border-black/[0.08] shadow-sm">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#059669]">
                Continuous Autonomous Ingestion
              </span>
              <h5 className="text-lg font-bold text-[#111613] mt-1 mb-2">
                Powered by IdeaAI & Local Llama 3.2
              </h5>
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                Articles are scraped directly from TechCrunch, Hacker News, and VentureBeat with verified source imagery and translated into 7 languages.
              </p>
              <Link
                href="/news/sitemap.xml"
                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-[#111613] text-[#CEF23A] text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Access XML Feed
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-black/[0.08] mt-24 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-black/50">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#111613] tracking-tight">IdeaAI News Intelligence</span>
            <span>·</span>
            <span>Live RSS & Original Editorial Imagery Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://ideaai.togetlink.com" className="hover:text-black transition-colors">
              IdeaAI Desktop
            </a>
            <a href="https://togetlink.com" className="hover:text-black transition-colors">
              TogetLink
            </a>
            <Link href={`/news/sitemap.xml`} className="hover:text-black transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
