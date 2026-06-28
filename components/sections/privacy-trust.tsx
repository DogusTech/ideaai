"use client"

import { ShieldCheck, MapPinOff, Target, HeartHandshake } from "lucide-react"
import { Reveal } from "./reveal"

const CARDS = [
  {
    icon: ShieldCheck,
    color: "text-brand-blue",
    bg: "bg-brand-surface",
    title: "Consent-first visibility",
    body: "People choose what they share, when they share it, and how they appear.",
  },
  {
    icon: MapPinOff,
    color: "text-brand-red-soft",
    bg: "bg-brand-warm",
    title: "No exact personal tracking",
    body: "Show broad professional context, not sensitive exact movement.",
  },
  {
    icon: Target,
    color: "text-brand-green",
    bg: "bg-brand-surface",
    title: "Professional intent only",
    body: "TogetLink focuses on collaboration, availability, role, and intent.",
  },
  {
    icon: HeartHandshake,
    color: "text-brand-yellow",
    bg: "bg-brand-warm",
    title: "Human-safe introductions",
    body: "Real-world interaction starts with mutual interest and controlled visibility.",
  },
]

export function PrivacyTrust() {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2
          id="privacy-heading"
          className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
        >
          Built for privacy-safe real-world networking
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Real-world presence demands real trust. TogetLink is designed so professional context is
          always consent-first and never surveillance.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, i) => (
          <Reveal key={card.title} as="article" delay={i * 0.08}>
            <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-[0_1px_2px_rgba(26,29,35,0.04)]">
              <span
                className={`flex size-11 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}
              >
                <card.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-bold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
