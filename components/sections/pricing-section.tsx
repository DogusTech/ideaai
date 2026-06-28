"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

type Plan = {
  id: "free" | "pro" | "enterprise"
  badge: string
  name: string
  price: string
  subtext: string
  description: string
  features: string[]
  cta: string
  barText: string
}

const PLANS: Plan[] = [
  {
    id: "free",
    badge: "STARTER",
    name: "Free",
    price: "$0",
    subtext: "Always free",
    description:
      "For professionals who want to discover nearby hubs and understand the TogetLink experience.",
    features: [
      "Browse public hubs",
      "View demo professional signals",
      "Create a basic profile",
      "Join public discovery",
      "Privacy-safe visibility controls",
    ],
    cta: "Start free",
    barText: "Create your profile and start discovering public professional hubs.",
  },
  {
    id: "pro",
    badge: "MOST USEFUL",
    name: "Pro",
    price: "$12",
    subtext: "per month",
    description:
      "For builders, founders, designers, and operators who want real-world professional introductions.",
    features: [
      "See live professional intent nearby",
      "Request real-world introductions",
      "Priority visibility in hubs",
      "Save favorite venues",
      "Access availability windows",
      "View collaboration-ready signals",
      "Better profile discovery",
    ],
    cta: "Upgrade to Pro",
    barText: "Unlock live professional context and request real-world introductions.",
  },
  {
    id: "enterprise",
    badge: "TEAMS",
    name: "Enterprise",
    price: "Custom",
    subtext: "For companies and communities",
    description:
      "For companies, accelerators, universities, coworking spaces, and HR teams that want to reach high-intent professionals.",
    features: [
      "Company hub profile",
      "Invite high-intent professionals",
      "HR availability windows",
      "Team-based outreach",
      "Venue/company verification",
      "Priority support",
      "Custom onboarding",
    ],
    cta: "Talk to sales",
    barText: "Create a trusted company presence and reach high-intent professionals.",
  },
]

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.article
      animate={{ scale: selected ? 1.02 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex h-full flex-col rounded-3xl border bg-card p-7 text-left transition-colors duration-300 ${
        selected
          ? "border-brand-blue shadow-[0_24px_60px_-28px_rgba(47,122,231,0.55)] ring-1 ring-brand-blue/30"
          : "border-border/70 shadow-[0_1px_2px_rgba(26,29,35,0.04)]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Select the ${plan.name} plan`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      />

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
            selected ? "bg-brand-blue text-white" : "bg-brand-surface text-brand-blue"
          }`}
        >
          {plan.badge}
        </span>
        <span
          aria-hidden={!selected}
          className={`flex size-6 items-center justify-center rounded-full transition-all ${
            selected ? "bg-brand-blue text-white" : "border border-border text-transparent"
          }`}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">{plan.name}</h3>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
        <span className="text-sm text-muted-foreground">{plan.subtext}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <Check
              className={`mt-0.5 size-4 shrink-0 ${selected ? "text-brand-blue" : "text-brand-green"}`}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <span
        className={`relative z-20 mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors ${
          selected
            ? "bg-brand-blue text-white"
            : "border border-border/70 bg-background text-foreground"
        }`}
      >
        {plan.cta}
      </span>
    </motion.article>
  )
}

export function PricingSection() {
  const [selectedId, setSelectedId] = useState<Plan["id"]>("pro")
  const selectedPlan = PLANS.find((p) => p.id === selectedId)!

  return (
    <section
      aria-labelledby="pricing-heading"
      className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2
          id="pricing-heading"
          className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
        >
          Choose how you want to build in real life
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Start free, then unlock deeper professional context, priority visibility, and trusted
          real-world introductions.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08}>
            <PlanCard
              plan={plan}
              selected={plan.id === selectedId}
              onSelect={() => setSelectedId(plan.id)}
            />
          </Reveal>
        ))}
      </div>

      {/* Dynamic bottom bar reflecting the selected plan */}
      <Reveal className="mt-10">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-blue/20 bg-brand-surface px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-medium text-foreground sm:text-base">
            <span className="font-bold">{selectedPlan.name}:</span> {selectedPlan.barText}
          </p>
          <a
            href="#"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-blue px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,122,231,0.6)] transition-colors hover:bg-[#2569cc]"
          >
            {selectedPlan.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
