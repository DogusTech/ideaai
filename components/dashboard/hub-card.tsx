import Link from "next/link"
import { MapPin, Star, Users, ExternalLink } from "lucide-react"
import type { TogetlinkHub } from "@/lib/places/types"
import {
  getCheckinCta,
  formatCheckedInCount,
  getGoogleMapsUrl,
  getHubDetailHref,
} from "@/lib/dashboard/hub-ranking"
import { formatDistanceKm } from "@/lib/dashboard/distance"
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

interface DashboardHubCardProps {
  hub: TogetlinkHub
  /** Pre-computed distance from user to this hub, in km. Null = unavailable. */
  distanceKm?: number | null
  className?: string
}

export function DashboardHubCard({
  hub,
  distanceKm,
  className,
}: DashboardHubCardProps) {
  const detailHref = getHubDetailHref(hub)
  const mapsUrl = getGoogleMapsUrl(hub)
  const ctaLabel = getCheckinCta(hub)
  const checkedInLabel = formatCheckedInCount(hub.checkedInCount)
  const distanceLabel = formatDistanceKm(distanceKm ?? null)
  const countryLabel = hub.country === "TR" ? "Turkey" : "United States"

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-[#e5e5e5] bg-white p-5 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-1",
        className,
      )}
    >
      {/* Venue photo */}
      {hub.photo?.url ? (
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={hub.photo.url}
            alt={`${hub.name} venue`}
            className="h-36 w-full object-cover"
            loading="lazy"
          />
          {hub.photo.attribution && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-0.5 text-[9px] text-white/80">
              {hub.photo.attribution}
            </p>
          )}
        </div>
      ) : null}

      {/* Header */}
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
            {hub.city}, {countryLabel}
          </p>
          {/* Distance */}
          <p className="mt-0.5 text-xs text-muted-foreground">{distanceLabel}</p>
        </div>
        {hub.rating !== undefined && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2 py-1">
            <Star
              className="size-3 fill-brand-yellow text-brand-yellow"
              aria-hidden="true"
            />
            <span className="text-xs font-medium">{hub.rating.toFixed(1)}</span>
            {hub.userRatingCount !== undefined && (
              <span className="text-[10px] text-muted-foreground">
                ({hub.userRatingCount.toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Intent summary */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {hub.currentIntentSummary}
      </p>

      {/* Presence row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5 shrink-0" aria-hidden="true" />
          {checkedInLabel}
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
        <p className="mt-2 text-[11px] text-muted-foreground/60">
          Demo samples — not a live user feed
        </p>
      )}

      {/* CTAs */}
      <div className="mt-4 flex items-center gap-2">
        {/* Primary CTA: Be First / Join Hub */}
        <Link
          href={detailHref}
          className="flex-1 rounded-xl bg-foreground py-2 text-center text-sm font-semibold text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
        >
          {ctaLabel}
        </Link>

        {/* Secondary CTA: Google Maps */}
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Open ${hub.name} in Google Maps`}
            className="flex items-center gap-1.5 rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 whitespace-nowrap"
          >
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            Maps
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
            aria-label="Google Maps unavailable for this hub"
          >
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            Maps
          </button>
        )}
      </div>
    </article>
  )
}
