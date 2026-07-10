import type { Metadata } from "next"
import { Building2, Image as ImageIcon, Mail, UserRound, Newspaper } from "lucide-react"
import { PageShell, PageHero } from "@/components/site/page-shell"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Press — togetlink",
  description:
    "Updates, company information, and media resources from Aeternexus Inc.",
}

const PRESS_CARDS = [
  {
    icon: Building2,
    title: "Company overview",
    description:
      "TogetLink is a professional real-world networking platform built by Aeternexus Inc., helping professionals meet with intent in nearby hubs.",
  },
  {
    icon: ImageIcon,
    title: "Brand assets",
    description:
      "Logos, wordmarks, and usage guidelines will be available here soon. In the meantime, reach out for approved assets.",
  },
  {
    icon: Mail,
    title: "Media inquiries",
    description:
      "For interviews, quotes, or company details, contact our press team.",
    email: "press@togetlink.com",
  },
  {
    icon: UserRound,
    title: "Founder background",
    description:
      "TogetLink was founded by Doğuş Yılmaz, Founder & CEO of Aeternexus Inc.",
  },
]

export default function PressPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Press"
        title="TogetLink Press"
        description="Updates, company information, and media resources from Aeternexus Inc."
      />

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PRESS_CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-border/70 bg-card p-8"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-surface text-brand-blue">
                <card.icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="mt-3 inline-block text-sm font-medium text-brand-blue hover:underline"
                >
                  {card.email}
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Press releases
          </h2>
          <div className="mt-6">
            <EmptyState
              icon={<Newspaper className="size-6" aria-hidden="true" />}
              title="No press releases yet"
              description="We haven't published any press releases so far. Check back soon, or reach out to our press team for the latest company information."
            />
          </div>
        </div>
      </section>
    </PageShell>
  )
}
