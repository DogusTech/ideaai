"use client"

import Link from "next/link"
import { ArrowRight, MapPin, ShieldCheck, Star, Users } from "lucide-react"

import { CATEGORY_ICONS } from "@/lib/places/category-meta"
import { hubHref } from "@/lib/places/hub-url"
import { CATEGORY_LABELS, COUNTRY_LABELS, type TogetlinkHub } from "@/lib/places/types"
import { Badge } from "@/components/ui/badge"

export function HubCard({
  hub,
  onCheckIn,
}: {
  hub: TogetlinkHub
  onCheckIn: (hub: TogetlinkHub) => void
}) {
  const href = hubHref(hub)
  const CategoryIcon = CATEGORY_ICONS[hub.category]

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-brand-blue/40 hover:shadow-md focus-within:border-brand-blue/40">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="category">
          <CategoryIcon className="size-3.5" aria-hidden="true" />
          {CATEGORY_LABELS[hub.category]}
        </Badge>
        {hub.rating != null && (
          <span className="flex items-center gap-1 text-sm font-medium text-foreground/80">
            <Star className="size-3.5 fill-brand-yellow text-brand-yellow" aria-hidden="true" />
            {hub.rating.toFixed(1)}
            <span className="text-muted-foreground">
              {hub.userRatingCount ? `(${hub.userRatingCount.toLocaleString()})` : ""}
            </span>
          </span>
        )}
      </div>

      <h3 className="mt-3 text-balance text-lg font-semibold leading-snug text-foreground">
        <Link
          href={href}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {hub.name}
        </Link>
      </h3>

      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
        {hub.city}, {COUNTRY_LABELS[hub.country]}
      </p>

      <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/80">
        {hub.currentIntentSummary}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="privacy">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          {hub.broadAreas[0]}
        </Badge>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-3.5" aria-hidden="true" />
          {hub.checkedInCount} checked in
        </span>
      </div>

      {/* Relative wrapper so the stretched title link doesn't cover the buttons */}
      <div className="relative z-10 mt-5 flex items-center gap-2 border-t border-border pt-4">
        <Link
          href={href}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          View hub
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => onCheckIn(hub)}
          className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Check in
        </button>
      </div>
    </article>
  )
}
