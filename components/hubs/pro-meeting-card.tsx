"use client"

import { ArrowRight, Check, Crown } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const FEATURES = [
  "Priority visibility in selected hubs",
  "Meeting request with professional context",
  "Availability windows you control",
  "Contact details shown only after mutual acceptance",
]

export function ProMeetingCard({ onRequest }: { onRequest?: () => void }) {
  return (
    <section className="rounded-2xl border border-brand-yellow/30 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-yellow/15 text-[#8a5a0c]">
          <Crown className="size-5" aria-hidden="true" />
        </span>
        <Badge variant="pro">
          <Crown className="size-3.5" aria-hidden="true" />
          Pro
        </Badge>
      </div>

      <h3 className="mt-4 text-balance text-lg font-semibold text-foreground">
        Request a focused 1:1 introduction
      </h3>
      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
        For Pro members who want a consent-based professional conversation.
      </p>

      <ul className="mt-4 flex flex-col gap-2.5">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={onRequest}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Explore Pro
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <p className="text-center text-xs text-muted-foreground">
          No unexpected contact. No exact location sharing.
        </p>
      </div>
    </section>
  )
}
