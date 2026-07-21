"use client"

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
    cta: "Current Plan",
    ctaType: "secondary",
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
    cta: "Upgrade to Pro",
    ctaType: "primary",
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
    cta: "Contact Sales",
    ctaType: "secondary",
  },
]

export function PricingSection() {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="bg-[#f5f5f5] px-4 py-12 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="mx-auto max-w-5xl">
        {/* Top icon */}
        <div className="mb-6 flex justify-center">
          <span
            className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#e2e5ea]"
            aria-hidden="true"
          >
            <Sparkles
              className="size-6 text-brand-blue"
              strokeWidth={1.75}
            />
          </span>
        </div>

        {/* Heading + subtext */}
        <div className="mb-12 text-center">
          <h2
            id="pricing-heading"
            className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Upgrade your real-world network
          </h2>
          <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
            Pick the plan that fits where you are today. Enhance your visibility and connect with the right professionals.
          </p>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl border border-[#e2e5ea] bg-[#ffffff] p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Pill label */}
                <span
                  className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-blue"
                >
                  {plan.label}
                </span>

                {/* Price */}
                <div className="mb-1 flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold leading-none sm:text-4xl"
                    style={{ color: "#3c4043" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Small plan name */}
                <p className="mb-4 text-sm font-semibold text-foreground">
                  {plan.name} plan
                </p>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground min-h-[60px]">
                  {plan.description}
                </p>

                {/* CTAs */}
                <div className="mb-8">
                  {plan.ctaType === "primary" ? (
                    <button
                      className="w-full rounded-md bg-brand-blue py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <button
                      className="w-full rounded-md border border-brand-blue bg-[#ffffff] py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>

                {/* Benefits */}
                <ul className="mt-auto space-y-3" aria-label={`${plan.name} plan features`}>
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-brand-blue"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Bottom callout bar removed as each card now has its own CTA suitable for logged in users */}
      </div>
    </section>
  )
}
