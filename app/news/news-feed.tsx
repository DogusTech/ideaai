'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

type Article = {
  id: string
  title: string
  summary?: string
  imageUrl?: string
  source?: string
  category?: string
  createdAt?: string
  lang?: string
}

type NewsPage = { articles: Article[]; nextCursor?: string }

function FallbackCover({ category }: { category?: string }) {
  return (
    <div aria-label="IdeaAI News cover image" role="img" className="relative grid h-full w-full place-items-center overflow-hidden bg-[#17231f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_18%,rgba(47,122,231,0.5),transparent_38%),radial-gradient(ellipse_at_20%_90%,rgba(85,161,112,0.42),transparent_45%),linear-gradient(135deg,#17231f,#263b36)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(255,255,255,.18) 32px),repeating-linear-gradient(90deg,transparent,transparent 31px,rgba(255,255,255,.18) 32px),radial-gradient(circle at 80% 15%,transparent 0 70px,rgba(255,255,255,.32) 71px 72px,transparent 73px 102px,rgba(255,255,255,.24) 103px 104px,transparent 105px)" }} />
      <div className="relative flex flex-col items-center gap-3">
        <span className="grid size-12 place-items-center rounded-[calc(var(--radius)*0.8)] border border-white/20 bg-white/10 text-lg font-semibold shadow-lg backdrop-blur">i</span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/75">{category || 'Technology'} · IdeaAI News</span>
      </div>
    </div>
  )
}

export function NewsCover({ imageUrl, title, category, className = '' }: { imageUrl?: string; title: string; category?: string; className?: string }) {
  const [imageFailed, setImageFailed] = useState(false)
  return imageUrl && !imageFailed
    ? <img src={imageUrl} alt={title} loading="lazy" decoding="async" onError={() => setImageFailed(true)} className={`h-full w-full object-cover ${className}`} />
    : <FallbackCover category={category} />
}
function NewsCard({ article, lang }: { article: Article; lang: string }) {
  const date = article.createdAt ? new Date(article.createdAt) : null
  const dateLabel = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric' }).format(date)
    : 'Latest'

  return (
    <article className="group min-w-0 overflow-hidden rounded-[var(--radius)] border border-black/[0.07] bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_-20px_rgba(17,22,19,0.32)] motion-reduce:transform-none motion-reduce:transition-none">
      <Link href={`/news/${encodeURIComponent(article.id)}?lang=${encodeURIComponent(lang)}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-inset" aria-label={`Read ${article.title}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)] bg-brand-surface">
          <NewsCover imageUrl={article.imageUrl} title={article.title} category={article.category} className="transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none" />
          <span className="absolute left-3 top-3 rounded-[calc(var(--radius)*0.7)] border border-white/15 bg-[#202522]/90 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-sm">{article.category || 'Technology'}</span>
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2 overflow-hidden text-[11px] font-medium text-black/45">
            <span className="truncate">{article.source || 'IdeaAI News'}</span><span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-brand-blue/70" /><time className="shrink-0">{dateLabel}</time>
          </div>
          <h3 className="line-clamp-3 text-[18px] font-semibold leading-[1.3] tracking-[-0.025em] text-[#1a1d23] transition-colors group-hover:text-brand-blue">{article.title}</h3>
          {article.summary && <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">{article.summary}</p>}
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-brand-blue">Read story <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  )
}

export function NewsFeed({ initialArticles, initialCursor, lang }: { initialArticles: Article[]; initialCursor?: string; lang: string }) {
  const [articles, setArticles] = useState(initialArticles)
  const [cursor, setCursor] = useState(initialCursor)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const inFlight = useRef(false)

  const loadMore = useCallback(async () => {
    if (!cursor || inFlight.current) return
    inFlight.current = true
    setLoading(true)
    setError(false)
    try {
      const params = new URLSearchParams({ lang, cursor, limit: '12' })
      const response = await fetch(`/api/news?${params}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Unable to load more stories')
      const page = await response.json() as NewsPage
      setArticles((current) => {
        const known = new Set(current.map((article) => article.id))
        return [...current, ...page.articles.filter((article) => !known.has(article.id))]
      })
      setCursor(page.nextCursor)
    } catch {
      setError(true)
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }, [cursor, lang])

  useEffect(() => {
    const target = sentinel.current
    if (!target || !cursor) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore()
    }, { rootMargin: '480px 0px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [cursor, loadMore])

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => <NewsCard key={article.id} article={article} lang={lang} />)}
      </div>
      <div ref={sentinel} className="flex min-h-16 items-center justify-center py-6" aria-live="polite">
        {loading && <span className="text-sm text-black/50">Loading more stories…</span>}
        {error && <button type="button" onClick={() => void loadMore()} className="rounded-[var(--radius)] border border-black/10 px-4 py-2 text-sm font-medium text-[#1a1d23] hover:bg-black/[0.03]">Retry loading stories</button>}
        {!cursor && articles.length > 0 && <span className="text-xs text-black/40">You’re all caught up</span>}
      </div>
    </>
  )
}



