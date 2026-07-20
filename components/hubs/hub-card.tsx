import Link from "next/link"
import { MapPin, Star, Users } from "lucide-react"
import type { TogetlinkHub } from "@/lib/places/types"
import { cn } from "@/lib/utils"

const CATEGORY_LABELS: Record<TogetlinkHub["category"], string> = {
  coworking: "Coworking",
  cafe: "Café",
  park: "Park",
  event: "Event",
  startup_hub: "Startup Hub",
  library: "Library",
  university_hub: "University Hub",
}

const CATEGORY_COLORS: Record<TogetlinkHub["category"], string> = {
  coworking: "bg-brand-blue/10 text-brand-blue",
  cafe: "bg-brand-yellow/15 text-[#9a6400]",
  park: "bg-brand-green/15 text-[#2d7050]",
  event: "bg-brand-red-soft/15 text-brand-red-soft",
  startup_hub: "bg-brand-surface text-brand-blue",
  library: "bg-[#ede9fe] text-[#6d28d9]",
  university_hub: "bg-brand-warm text-[#7c4a00]",
}

interface HubCardProps {
  hub: TogetlinkHub
  className?: string
}

export function HubCard({ hub, className }: HubCardProps) {
  const detailHref = `/hubs/${hub.country.toLowerCase()}/${hub.city.toLowerCase().replace(/\s+/g, "-")}/${hub.slug}`

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-border/60 bg-white p-5 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-1",
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              CATEGORY_COLORS[hub.category],
            )}
          >
            {CATEGORY_LABELS[hub.category]}
          </span>
          <h3 className="mt-2 text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-brand-blue transition-colors">
            {hub.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {hub.city},{" "}
            {hub.country === "TR" ? "Turkey" : "United States"}
          </p>
        </div>
        {hub.rating !== undefined && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2 py-1">
            <Star
              className="size-3 fill-brand-yellow text-brand-yellow"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-foreground">
              {hub.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Intent summary */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {hub.currentIntentSummary}
      </p>

      {/* Presence row */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold text-foreground">{hub.checkedInCount}</span>{" "}
            checked in
          </span>
        </span>
        {hub.broadAreas.slice(0, 2).map((area) => (
          <span
            key={area}
            className="rounded-full border border-border/50 bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {area}
          </span>
        ))}
      </div>

      {/* Demo notice */}
      {hub.isDemo && (
        <p
          aria-label="Demo samples — not a live user feed"
          className="mt-3 text-[11px] text-muted-foreground/70"
        >
          Demo samples &mdash; not a live user feed
        </p>
      )}

      {/* CTAs */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={detailHref}
          className="flex-1 rounded-md bg-brand-blue py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
        >
          View hub
        </Link>
        <Link
          href={`/register?intent=checkin&hub=${hub.slug}`}
          className="flex-1 rounded-md border border-[#e0e0e0] px-4 py-2 text-center text-sm font-semibold text-brand-blue transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
        >
          Check in
        </Link>
      </div>
    </article>
  )
}
