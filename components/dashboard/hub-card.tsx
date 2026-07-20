"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Star, Users, ExternalLink, Navigation } from "lucide-react"
import type { Hub } from "@/lib/api/types"
import { formatCheckedInCount } from "@/lib/dashboard/hub-ranking"
import { formatDistanceKm } from "@/lib/dashboard/distance"
import { cn } from "@/lib/utils"
import { CheckInModal } from "@/components/hubs/check-in-modal"

const CATEGORY_LABELS: Record<string, string> = {
  coworking: "Coworking",
  cafe: "Café",
  park: "Park",
  event: "Event",
  startup_hub: "Startup Hub",
  library: "Library",
  university_hub: "University Hub",
}

const CATEGORY_COLORS: Record<string, string> = {
  coworking: "bg-brand-blue/10 text-brand-blue",
  cafe: "bg-brand-yellow/15 text-[#9a6400]",
  park: "bg-brand-green/15 text-[#2d7050]",
  event: "bg-brand-red-soft/15 text-brand-red-soft",
  startup_hub: "bg-brand-surface text-brand-blue",
  library: "bg-[#ede9fe] text-[#6d28d9]",
  university_hub: "bg-brand-warm text-[#7c4a00]",
}

interface DashboardHubCardProps {
  hub: Hub
  /** Pre-computed distance from user to this hub, in km. Null = unavailable. */
  distanceKm?: number | null
  className?: string
}

export function DashboardHubCard({
  hub,
  distanceKm,
  className,
}: DashboardHubCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localCheckins, setLocalCheckins] = useState(hub.checkedInCount ?? 0)

  // Detail Link
  const country = hub.country ? hub.country.toLowerCase() : ""
  const city = hub.city ? hub.city.toLowerCase() : ""
  const slug = hub.slug ? hub.slug.toLowerCase() : ""
  const detailHref = country && city && slug ? `/hubs/${country}/${city}/${slug}` : "/explore"

  // Check-in logic
  const ctaLabel = localCheckins > 0 ? "Join" : "Be First"
  const checkedInLabel = formatCheckedInCount(localCheckins)
  
  // Maps URL
  let mapsUrl = hub.googleMapsUri
  if (!mapsUrl && hub.location?.lat && hub.location?.lng) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hub.location.lat},${hub.location.lng}`
  }

  // Distance
  const distanceLabel = formatDistanceKm(distanceKm ?? null)
  const countryLabel = hub.country === "TR" ? "Turkey" : hub.country === "US" ? "United States" : hub.country

  // Photo
  let photoSrc = "/images/fallback-hub.svg"
  if (hub.photo?.photoUri) {
    photoSrc = hub.photo.photoUri
  } else if ((hub as any).photo?.url) {
    photoSrc = (hub as any).photo.url
  } else if (hub.cardPhoto?.name) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://togetlink-api-production.up.railway.app/api"
    photoSrc = `${apiBase}/places/photo/redirect?photoName=${encodeURIComponent(hub.cardPhoto.name)}&maxWidthPx=400`
  }
  
  const categoryLabel = CATEGORY_LABELS[hub.category] || hub.category
  const categoryColor = CATEGORY_COLORS[hub.category] || "bg-muted text-foreground"

  const handleCheckInSuccess = () => {
    setLocalCheckins((prev) => prev + 1)
  }

  return (
    <>
      <article
        className={cn(
          "group overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-1",
          className,
        )}
      >
        <div className="md:flex">
          {/* Venue photo */}
          <div className="relative shrink-0 md:w-[260px]">
            <img
              src={photoSrc}
              alt={`${hub.name} venue photo`}
              className="h-48 w-full object-cover md:h-full"
              loading="lazy"
            />
            
            {/* Map Location Icon floating top right */}
            {mapsUrl && (
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                aria-label={`View ${hub.name} on Google Maps`}
              >
                <MapPin className="size-4 text-brand-blue" />
              </a>
            )}

            {/* Attribution */}
            {hub.photo?.attributions && hub.photo.attributions.length > 0 ? (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-[10px] text-white">
                Photo:{" "}
                {hub.photo.attributions.map((a: any, i: number) => a.uri ? (
                  <span key={a.uri}>
                    <a href={a.uri} target="_blank" rel="noreferrer noopener" className="underline hover:text-white/80 transition-colors">
                      {a.displayName ?? "Google Maps contributor"}
                    </a>
                    {i < hub.photo!.attributions.length - 1 && ", "}
                  </span>
                ) : (
                  <span key={a.displayName}>{a.displayName ?? "Google Maps contributor"}</span>
                ))}
              </div>
            ) : hub.photo?.attribution ? (
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-[10px] text-white">
                Photo: {hub.photo.attribution}
              </p>
            ) : null}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      categoryColor,
                    )}
                  >
                    {categoryLabel}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-brand-blue">
                    {hub.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Navigation className="size-3.5 shrink-0" aria-hidden="true" />
                    {hub.city}, {countryLabel}
                  </p>
                  {/* Distance */}
                  {distanceLabel && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{distanceLabel}</p>
                  )}
                </div>
                {hub.rating !== undefined && (
                  <div className="flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2 py-1">
                    <Star
                      className="size-3.5 fill-brand-yellow text-brand-yellow"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">{hub.rating.toFixed(1)}</span>
                    {hub.userRatingCount !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({hub.userRatingCount.toLocaleString()})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Intent summary */}
              {hub.currentIntentSummary && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {hub.currentIntentSummary}
                </p>
              )}

              {/* Presence row */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {checkedInLabel}
                </span>
                {hub.broadAreas && hub.broadAreas.length > 0 && hub.broadAreas.slice(0, 2).map((area: string) => (
                  <span
                    key={area}
                    className="rounded-full border border-border/50 bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {/* Primary CTA: Join / Be First */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex flex-1 items-center justify-center rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
              >
                {ctaLabel}
              </button>

              {/* Secondary CTA: View Hub */}
              <Link
                href={detailHref}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#e0e0e0] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
              >
                View Hub
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hubId={hub.id}
        hubName={hub.name}
        onSuccess={handleCheckInSuccess}
      />
    </>
  )
}
