"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, Info } from "lucide-react"

type Plan = {
  id: string
  price: string
  period?: string
  label: string
  description: string
  features: string[]
  highlight?: boolean
}

const PLANS: Plan[] = [
  {
    id: "free",
    price: "$0",
    label: "Explore nearby",
    description:
      "Discover public hubs, view demo activity, and understand how TogetLink works.",
    features: [
      "Browse public venue listings",
      "View demo profiles",
      "Basic area discovery",
      "Community access",
    ],
  },
  {
    id: "pro",
    price: "$12",
    period: "/ month",
    label: "For active builders",
    description:
      "Show professional intent, request introductions, and become more visible in relevant nearby spaces.",
    features: [
      "Full intent signal profile",
      "Request introductions",
      "Priority venue visibility",
      "Nearby match alerts",
      "Direct messaging",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    price: "Custom",
    label: "For teams and organizations",
    description:
      "Invite high-intent professionals to verified spaces, events, and talent conversations.",
    features: [
      "Verified venue presence",
      "Team profile management",
      "Event and talent discovery",
      "Dedicated support",
      "Custom integrations",
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function PlansSection() {
  const [selectedId, setSelectedId] = useState("pro")

  return (
    <section
      id="plans"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="plans-heading"
    >
      {/* Soft blue background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--brand-surface) 15%, var(--brand-surface) 85%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* White container */}
        <div className="mx-auto max-w-5xl rounded-3xl bg-background p-8 shadow-[0_0_0_1px_var(--border),0_24px_64px_-16px_rgba(26,29,35,0.1)] sm:p-12">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h2
              id="plans-heading"
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
            >
              Choose how you want to start building together
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Start free, upgrade when you need stronger discovery, richer intent signals,
              and more direct professional introductions.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PLANS.map((plan, i) => {
              const isSelected = plan.id === selectedId
              return (
                <motion.button
                  key={plan.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  onClick={() => setSelectedId(plan.id)}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)] ${
                    isSelected
                      ? "border-[var(--brand-blue)] shadow-[0_0_0_4px_rgba(47,122,231,0.12),0_16px_40px_-12px_rgba(47,122,231,0.25)]"
                      : "border-border hover:border-border/80 hover:shadow-md"
                  } ${plan.highlight ? "bg-[var(--brand-surface)]" : "bg-background"}`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand-blue)] px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}

                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-[var(--brand-blue)]"
                    >
                      <Check className="size-3.5 text-white" aria-hidden="true" />
                    </motion.span>
                  )}

                  <div className="mb-3">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>

                  <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[var(--brand-blue)]">
                    {plan.label}
                  </p>

                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>

                  <ul className="flex flex-col gap-2" role="list">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-[var(--brand-green)]"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              )
            })}
          </div>

          {/* Bottom info bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl bg-muted/60 p-6 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <Info
                className="mt-0.5 size-5 shrink-0 text-[var(--brand-blue)]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">How access works</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Create your profile, choose your visibility level, and start discovering relevant
                  people around trusted venues.
                </p>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc]"
            >
              Request early access
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
