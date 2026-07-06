"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

const PLANS = [
  {
    id: "free",
    label: "FREE",
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Get started with your professional identity and explore what TogetLink has to offer.",
    benefits: [
      "Create your profile",
      "Explore nearby hubs",
      "Basic visibility controls",
    ],
  },
  {
    id: "pro",
    label: "PRO",
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "Unlock the tools that put you in front of the right people at the right time.",
    benefits: [
      "Priority professional visibility",
      "Advanced intent signals",
      "Meeting request tools",
      "Early access features",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    label: "ENTERPRISE",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations building real-world communities at scale.",
    benefits: [
      "Team and venue onboarding",
      "Private community access",
      "Custom trust and moderation workflows",
      "Partnership support",
    ],
  },
]

export function PricingSection() {
  const [selected, setSelected] = useState<string>("pro")

  return (
    <section
      aria-labelledby="pricing-heading"
      style={{ backgroundColor: "#eaf0fb" }}
      className="px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Outer container */}
      <div className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-14">

        {/* Top icon */}
        <div className="mb-5 flex justify-center">
          <span
            className="flex size-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#eaf0fb" }}
            aria-hidden="true"
          >
            <Sparkles
              className="size-6"
              style={{ color: "#2f7ae7" }}
              strokeWidth={1.75}
            />
          </span>
        </div>

        {/* Heading + subtext */}
        <div className="mb-8 text-center">
          <h2
            id="pricing-heading"
            className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Choose how you want to build with TogetLink
          </h2>
          <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
            Pick the plan that fits where you are today. Upgrade any time as your real-world network grows.
          </p>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                aria-pressed={isSelected}
                className="relative flex flex-col rounded-2xl border-2 p-5 text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f7ae7] focus-visible:ring-offset-2"
                style={{
                  borderColor: isSelected ? "#2f7ae7" : "#e2e5ea",
                  boxShadow: isSelected
                    ? "0 4px 18px 0 rgba(47,122,231,0.14)"
                    : "none",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Selected check / unselected radio */}
                <span className="absolute right-4 top-4" aria-hidden="true">
                  {isSelected ? (
                    <span
                      className="flex size-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#2f7ae7" }}
                    >
                      <Check className="size-3.5 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      className="flex size-6 items-center justify-center rounded-full border-2"
                      style={{ borderColor: "#c8cdd6" }}
                    />
                  )}
                </span>

                {/* Pill label */}
                <span
                  className="mb-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                  style={{
                    backgroundColor: "#eaf0fb",
                    color: "#2f7ae7",
                  }}
                >
                  {plan.label}
                </span>

                {/* Price */}
                <div className="mb-0.5 flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold leading-none sm:text-4xl"
                    style={{ color: "#2f7ae7" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Small plan name in blue */}
                <p
                  className="mb-3 text-xs font-medium"
                  style={{ color: "#2f7ae7" }}
                >
                  {plan.name} plan
                </p>

                {/* Description */}
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                {/* Benefits */}
                <ul className="mt-auto space-y-2" aria-label={`${plan.name} plan features`}>
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-foreground/80">
                      <Check
                        className="mt-0.5 size-3.5 shrink-0"
                        style={{ color: "#55a170" }}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {/* Bottom callout bar */}
        <div
          className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl px-5 py-4 sm:flex-row sm:items-center"
          style={{ backgroundColor: "#eaf0fb" }}
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              Start free. Upgrade when your real-world network grows.
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              No credit card required to get started.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f7ae7] focus-visible:ring-offset-2"
            style={{ backgroundColor: "#2f7ae7" }}
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  )
}
