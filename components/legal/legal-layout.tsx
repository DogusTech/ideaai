import type { ReactNode } from "react"
import { Info } from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { LegalTabs } from "./legal-tabs"
import { LegalSidebar } from "./legal-sidebar"

export type LegalContentSection = {
  id: string
  title: string
  body: ReactNode
}

export type LegalLayoutProps = {
  activeTab: string
  title: string
  effectiveDate: string
  intro: string
  sections: LegalContentSection[]
  note?: string
}

export function LegalLayout({
  activeTab,
  title,
  effectiveDate,
  intro,
  sections,
  note = "This page is a product/legal placeholder and should be reviewed by legal counsel before launch.",
}: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <LegalTabs active={activeTab} />

      <main className="flex-1">
        <div className="mx-auto max-w-[1200px] px-5 py-10 lg:px-8 lg:py-14">
          <header className="max-w-3xl">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Effective date: {effectiveDate}
            </p>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-yellow/40 bg-brand-warm/50 px-4 py-3">
              <Info className="mt-0.5 size-5 shrink-0 text-brand-yellow" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-foreground/80">{note}</p>
            </div>
          </header>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
            {/* Sidebar: sticky on desktop, stacked above content on mobile */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <LegalSidebar
                sections={sections.map(({ id, title }) => ({ id, title }))}
              />
            </aside>

            <article className="max-w-3xl">
              <div className="flex flex-col gap-12">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-heading`}
                    className="scroll-mt-28"
                  >
                    <h2
                      id={`${section.id}-heading`}
                      className="text-xl font-semibold tracking-tight text-foreground"
                    >
                      {section.title}
                    </h2>
                    <div className="mt-4 flex flex-col gap-4 text-pretty leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-brand-blue [&_a:hover]:underline [&_li]:leading-relaxed [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
                      {section.body}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
