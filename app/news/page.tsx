import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Sparkles, Globe, TrendingUp, ExternalLink, Flame, ArrowRight, Clock } from 'lucide-react';
import { getLatestNews } from '@/lib/news-service';
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

  const articles = await getLatestNews(currentLang, 25);
  const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
  const listArticles = articles.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111613] selection:bg-[#CEF23A] selection:text-[#111613] antialiased">
      {/* Top Header Bar */}
      <header className="border-b border-black/[0.08] bg-[#FBFBFA]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-[#111613] text-[#CEF23A] flex items-center justify-center font-bold text-xs tracking-wider">
              N
            </span>
            <Link href={`/news?lang=${currentLang}`} className="text-[17px] font-bold tracking-tight text-[#111613]">
              IdeaAI <span className="font-medium text-black/45">News</span>
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#CEF23A]/30 text-[#1f2803] border border-[#CEF23A]">
              Autonomous Intel
            </span>
          </div>

          {/* Minimal Language Switcher */}
          <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-full border border-black/[0.06]">
            {SUPPORTED_LANGS.map(lang => (
              <Link
                key={lang.code}
                href={`/news?lang=${lang.code}`}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
                  currentLang === lang.code
                    ? 'bg-[#111613] text-white shadow-sm'
                    : 'text-black/60 hover:text-black hover:bg-black/[0.04]'
                }`}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Section Pill & Subhead */}
        <div className="mb-8">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1f2803] flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#CEF23A] ring-2 ring-[#CEF23A]/40 inline-block animate-pulse"></span>
            GLOBAL TECH · SAAS · AI DISCOVERY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#111613] max-w-3xl leading-[1.12]">
            Turn complex AI breakthroughs into actionable intelligence.
          </h1>
          <p className="mt-4 text-base md:text-lg text-black/65 max-w-2xl font-normal leading-relaxed">
            Curated from leading technology research hubs, filtered by autonomous agents, and analyzed across 7 languages.
          </p>
        </div>

        {/* Featured Top Story (Hero Card matching PDF Style) */}
        {featuredArticle && (
          <section className="mb-16">
            <div className="group relative rounded-3xl bg-[#111613] text-white p-8 md:p-12 overflow-hidden shadow-xl border border-black/10">
              {/* Background Geometric Accent (inspired by PDF cover) */}
              <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#CEF23A]/15 blur-3xl pointer-events-none"></div>
              <div className="absolute right-12 top-12 w-48 h-48 rounded-full border border-white/[0.08] pointer-events-none hidden md:block"></div>
              <div className="absolute right-24 top-24 w-72 h-72 rounded-full border border-white/[0.04] pointer-events-none hidden md:block"></div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#CEF23A] text-[#111613]">
                      01 · {featuredArticle.category} BREAKTHROUGH
                    </span>
                    <span className="text-xs text-white/50 font-medium">
                      Source: {featuredArticle.source}
                    </span>
                  </div>

                  <Link href={`/news/${featuredArticle.id}?lang=${currentLang}`}>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white group-hover:text-[#CEF23A] transition-colors leading-[1.2]">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="mt-4 text-sm md:text-base text-white/75 font-normal leading-relaxed line-clamp-3">
                    {featuredArticle.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/news/${featuredArticle.id}?lang=${currentLang}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#CEF23A] text-[#111613] font-bold text-xs uppercase tracking-wider hover:bg-[#d8fb48] transition-colors shadow-sm"
                    >
                      Read Full Analysis
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={featuredArticle.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white/80 text-xs font-semibold tracking-wider transition-colors"
                    >
                      Original Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Lead Image or Decorative Visual Container */}
                <div className="lg:col-span-5 relative">
                  {featuredArticle.imageUrl ? (
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] w-full rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between p-6">
                      <div className="text-[11px] font-bold tracking-[0.15em] text-[#CEF23A] uppercase">
                        AI DECISION LAYER
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 w-3/4 bg-white/20 rounded"></div>
                        <div className="h-1.5 w-1/2 bg-white/10 rounded"></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>7 Languages Verified</span>
                        <span>Llama 3.2</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section Header: The Innovation & Field Intelligence */}
        <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-black/40">
              02 · THE FIELD INTELLIGENCE
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#111613] mt-0.5">
              Verified Technology Transmissions
            </h3>
          </div>
          <span className="text-xs font-semibold text-black/50">
            {articles.length} Total Verified
          </span>
        </div>

        {/* Minimalist Grid (PDF 4-column structured style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listArticles.map((article, index) => {
            const numLabel = String(index + 2).padStart(2, '0');
            return (
              <article
                key={article.id}
                className="group relative rounded-2xl bg-white border border-black/[0.08] hover:border-black/[0.2] transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md"
              >
                {/* Article Image */}
                {article.imageUrl && (
                  <div className="relative aspect-[16/10] w-full bg-black/[0.03] overflow-hidden border-b border-black/[0.06]">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#111613] text-[#CEF23A]">
                        {article.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-black/40 mb-3 font-semibold">
                      <span>{numLabel} · {article.source}</span>
                      <span className="text-[11px] font-mono">
                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString(currentLang, { month: 'short', day: 'numeric' }) : 'Live'}
                      </span>
                    </div>

                    <Link href={`/news/${article.id}?lang=${currentLang}`}>
                      <h4 className="text-lg font-bold tracking-tight text-[#111613] group-hover:text-black/75 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                    </Link>

                    <p className="mt-3 text-xs md:text-sm text-black/60 font-normal leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  {/* Takeaways snippet if available */}
                  {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-black/[0.06] bg-[#FBFBFA] -mx-6 -mb-6 p-4 px-6">
                      <div className="text-[10px] font-bold tracking-wider uppercase text-black/45 mb-2">
                        Core Takeaway
                      </div>
                      <p className="text-xs text-black/80 font-medium line-clamp-2 leading-relaxed">
                        • {article.keyTakeaways[0]}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs font-bold">
                        <Link
                          href={`/news/${article.id}?lang=${currentLang}`}
                          className="inline-flex items-center gap-1 text-[#111613] group-hover:underline"
                        >
                          Deep Read <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-black/[0.08] mt-24 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-black/50">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#111613] tracking-tight">IdeaAI News Intelligence</span>
            <span>·</span>
            <span>Autonomous Llama 3.2 Pipeline</span>
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
