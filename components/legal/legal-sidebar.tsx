"use client"

import { useEffect, useState } from "react"

export type LegalSection = { id: string; title: string }

export function LegalSidebar({ sections }: { sections: LegalSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5">
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block rounded-lg border-l-2 px-3 py-2 leading-snug transition-colors ${
                  isActive
                    ? "border-brand-blue bg-brand-surface/60 font-medium text-brand-blue"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {section.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
