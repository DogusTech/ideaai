import type { Metadata } from "next"
import Link from "next/link"
import { IdCard, MapPin, ShieldCheck, Handshake } from "lucide-react"
import { PageShell, PageHero } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "About — togetlink",
  description:
    "TogetLink helps professionals build a digital identity and meet in the real world through consent-based, trust-first networking.",
}

const PILLARS = [
  {
    icon: IdCard,
    title: "Digital professional identity",
    description:
      "A clear, credible profile that represents who you are and what you're working toward — without the noise of traditional social feeds.",
  },
  {
    icon: MapPin,
    title: "Real-world professional meetings",
    description:
      "Discover nearby hubs and meet people face to face, where trust is built faster and collaboration actually begins.",
  },
  {
    icon: ShieldCheck,
    title: "Consent-based networking",
    description:
      "You decide who can reach you and when. Connections happen with intent, never through cold spam or unwanted outreach.",
  },
  {
    icon: Handshake,
    title: "Trust-first interaction",
    description:
      "Every part of the experience is designed to protect your time, your privacy, and the quality of your professional relationships.",
  },
]

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title="Professional networking, grounded in the real world."
        description="TogetLink is a professional real-world networking platform by Aeternexus Inc. We help professionals discover nearby hubs, meet with intent, and build trusted connections in real-world places."
      />

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our mission
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            <p>
              Professional relationships are built on trust, and trust is built
              in person. TogetLink exists to make those real-world moments easier
              to find and more meaningful when they happen.
            </p>
            <p>
              We&apos;re building a calmer, more intentional way to network — one
              that respects your privacy, puts you in control, and values quality
              over volume.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-border/70 bg-card p-8 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(26,29,35,0.4)]"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-surface text-brand-blue">
                <pillar.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-brand-surface to-brand-warm/60 p-8 lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built by Aeternexus Inc.
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/70">
              TogetLink is developed by a small, focused team that believes
              professional networking should feel human. Learn more about the
              person behind the product.
            </p>
            <Link
              href="/founder"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc]"
            >
              Meet the founder
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
