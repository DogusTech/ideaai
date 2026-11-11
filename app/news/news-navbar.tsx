'use client'

import Link from 'next/link'
import { useState } from 'react'

const sections = ['Latest', 'Startups', 'Venture', 'Apple', 'Security', 'AI', 'Apps']

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[18px]"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.6" /><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
}

export function NewsNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#202522] text-white shadow-sm">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
        <Link href="/news" aria-label="IdeaAI News home" className="flex shrink-0 items-center gap-2.5 font-sans text-[19px] font-semibold tracking-[-0.045em]">
          <span className="grid size-[25px] place-items-center rounded-[calc(var(--radius)*0.55)] bg-brand-blue text-[13px] font-bold text-white">i</span>
          <span>IdeaAI <span className="text-white/55">News</span></span>
        </Link>
        <nav aria-label="News categories" className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex">
          {sections.map((section, index) => (
            <Link key={section} href={index === 0 ? '/news' : `/news?category=${encodeURIComponent(section.toLowerCase())}`} className={`whitespace-nowrap text-[14px] font-medium transition-colors hover:text-white ${index === 0 ? 'text-white' : 'text-white/75'}`}>
              {section}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          {searchOpen && <input autoFocus aria-label="Search news" placeholder="Search stories" className="w-36 rounded-[var(--radius)] border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/35 sm:w-48" />}
          <button type="button" onClick={() => setSearchOpen(!searchOpen)} aria-label={searchOpen ? 'Close search' : 'Open search'} className="grid size-10 place-items-center rounded-[var(--radius)] text-white/85 transition-colors hover:bg-white/10 hover:text-white"><SearchIcon /></button>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="grid size-10 place-items-center rounded-[var(--radius)] text-white/85 transition-colors hover:bg-white/10 hover:text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5"><path d={menuOpen ? 'M6 6l12 12M18 6 6 18' : 'M3.5 6.5h17M3.5 12h17M3.5 17.5h17'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      {menuOpen && <nav aria-label="All news categories" className="border-t border-white/10 bg-[#202522] px-5 py-4 sm:px-8 xl:hidden"><div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-1 sm:grid-cols-4">{sections.map((section) => <Link onClick={() => setMenuOpen(false)} key={section} href={section === 'Latest' ? '/news' : `/news?category=${encodeURIComponent(section.toLowerCase())}`} className="rounded-[var(--radius)] px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white">{section}</Link>)}</div></nav>}
    </header>
  )
}
