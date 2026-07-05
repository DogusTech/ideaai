"use client"

import { Crown, Handshake, MapPinned, UserCheck, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CtaCard = {
  icon: LucideIcon
  title: string
  description: string
  action: string
  /** Filled = primary emphasis; outlined = secondary (Material 3 card styles). */
  variant: "filled" | "outlined"
}

const CARDS: CtaCard[] = [
  {
    icon: MapPinned,
    title: "Find nearby hubs",
    description: "Discover coworking spaces, cafés, parks, and events around you.",
    action: "Explore hubs",
    variant: "filled",
  },
  {
    icon: UserCheck,
    title: "Check in with professional intent",
    description: "Share a privacy-safe summary of what you are working on.",
    action: "Learn how",
    variant: "outlined",
  },
  {
    icon: Handshake,
    title: "Meet with consent",
    description: "Connect only when both people agree — no unexpected contact.",
    action: "See how it works",
    variant: "outlined",
  },
  {
    icon: Crown,
    title: "Upgrade to Pro for 1:1 introductions",
    description: "Priority visibility and consent-based professional meetings.",
    action: "Explore Pro",
    variant: "outlined",
  },
]

export function CtaCards() {
  return (
    <section aria-label="Quick actions" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card) => {
        const Icon = card.icon
        const filled = card.variant === "filled"
        return (
          <a
            key={card.title}
            href="#"
            className={cn(
              "group flex flex-col rounded-2xl border p-5 transition-all focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:outline-none",
              filled
                ? "border-transparent bg-brand-blue text-white hover:bg-[#2569cc]"
                : "border-border bg-card text-foreground hover:border-brand-blue/40 hover:shadow-md",
            )}
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                filled ? "bg-white/15 text-white" : "bg-brand-surface text-brand-blue",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-balance text-base font-semibold leading-snug">
              {card.title}
            </h3>
            <p
              className={cn(
                "mt-1.5 text-pretty text-sm leading-relaxed",
                filled ? "text-white/85" : "text-muted-foreground",
              )}
            >
              {card.description}
            </p>
            <span
              className={cn(
                "mt-4 text-sm font-semibold",
                filled ? "text-white" : "text-brand-blue",
              )}
            >
              {card.action}
              <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </a>
        )
      })}
    </section>
  )
}
