import type { Metadata } from "next"
import { Quote } from "lucide-react"
import { PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Founder — togetlink",
  description:
    "A note from Doğuş Yılmaz, Founder & CEO of Aeternexus Inc., on why TogetLink exists.",
}

const SECTIONS = [
  {
    title: "Founder note",
    paragraphs: [
      "I started TogetLink because the most valuable professional moments in my own career didn't happen in a feed — they happened in a room, over a coffee, in a shared space where trust could actually form.",
      "TogetLink is my attempt to make more of those moments possible, without the noise and pressure that usually comes with networking.",
    ],
  },
  {
    title: "Why TogetLink exists",
    paragraphs: [
      "Most professional networks reward broadcasting over connection. They optimize for reach, not for relationships. That leaves a lot of talented people feeling unseen and a lot of good collaborations never getting started.",
      "TogetLink focuses on the opposite: fewer, better introductions, grounded in real places and real intent.",
    ],
  },
  {
    title: "Product philosophy",
    paragraphs: [
      "We try to keep the product calm. Every feature should either help you meet the right person or protect your time and privacy. If it does neither, it doesn't belong.",
      "We'd rather ship something considered and trustworthy than something loud. Restraint is a feature.",
    ],
  },
  {
    title: "Building trust-first professional networks",
    paragraphs: [
      "Trust is earned slowly and lost quickly, so we treat it as the foundation, not an afterthought. Consent, transparency, and control are built into how TogetLink works.",
      "This is early, and there is a lot still to build. But the direction is clear, and I'm grateful you're taking a look.",
    ],
  },
]

export default function FounderPage() {
  return (
    <PageShell>
      <section className="border-b border-border/70 bg-gradient-to-b from-brand-surface/50 to-background">
        <div className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-brand-blue text-3xl font-bold text-white">
              DY
            </div>
            <div>
              <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
                Founder
              </span>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Doğuş Yılmaz
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Founder &amp; CEO, Aeternexus Inc.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <figure className="mb-16 max-w-3xl">
          <Quote className="size-8 text-brand-blue" aria-hidden="true" />
          <blockquote className="mt-4 text-balance text-2xl font-medium leading-relaxed text-foreground sm:text-3xl">
            The best professional relationships are built in person. TogetLink
            just makes the introduction easier.
          </blockquote>
        </figure>

        <div className="flex flex-col gap-12">
          {SECTIONS.map((section) => (
            <article
              key={section.title}
              className="grid grid-cols-1 gap-6 border-t border-border/70 pt-10 lg:grid-cols-[280px_1fr] lg:gap-16"
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <div className="flex max-w-2xl flex-col gap-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
