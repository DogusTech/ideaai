import Link from "next/link"
import { MapPin, Star, Users, ArrowLeft, Image as ImageIcon } from "lucide-react"
import type { TogetlinkHub } from "@/lib/places/types"
import { LivePresencePanel } from "./live-presence-panel"
import { HubBlogPreview } from "./hub-blog-preview"
import { CheckInComposer } from "./check-in-composer"
import { ProMeetingCard } from "./pro-meeting-card"

const CATEGORY_LABELS: Record<TogetlinkHub["category"], string> = {
  coworking: "Coworking",
  cafe: "Café",
  park: "Park",
  event: "Event",
  startup_hub: "Startup Hub",
  library: "Library",
  university_hub: "University Hub",
}

interface HubDetailPageProps {
  hub: TogetlinkHub
}

export function HubDetailPage({ hub }: HubDetailPageProps) {
  const countryLabel = hub.country === "TR" ? "Turkey" : "United States"

  return (
    <div className="tl-dashboard-shell min-h-screen">
      {/* Breadcrumb + back */}
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-4 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/explore" className="hover:text-foreground transition-colors">
                  Explore
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/explore?country=${hub.country}`}
                  className="hover:text-foreground transition-colors"
                >
                  {countryLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">
                {hub.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Back link */}
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Explore
            </Link>

            {/* Hero area */}
            <div className="mt-4">
              {/* Photo placeholder */}
              <div
                className="flex h-48 w-full items-center justify-center rounded-2xl bg-brand-surface/50 sm:h-64"
                aria-label="Hub photo placeholder"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImageIcon
                    className="size-8 text-muted-foreground/40"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-muted-foreground/60">
                    Photo attribution will be shown when loaded from Google Places
                  </p>
                </div>
              </div>

              {/* Hub name + meta */}
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                    {CATEGORY_LABELS[hub.category]}
                  </span>
                  {hub.isDemo && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Demo samples — not a live feed
                    </span>
                  )}
                </div>

                {/* SEO H1 */}
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {hub.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    {hub.city}, {countryLabel}
                  </p>
                  {hub.rating !== undefined && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star
                        className="size-3.5 fill-brand-yellow text-brand-yellow"
                        aria-hidden="true"
                      />
                      {hub.rating.toFixed(1)}
                      {hub.userRatingCount !== undefined && (
                        <span className="text-muted-foreground/70">
                          ({hub.userRatingCount.toLocaleString()} reviews)
                        </span>
                      )}
                    </p>
                  )}
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="size-3.5 shrink-0" aria-hidden="true" />
                    {hub.checkedInCount} checked in
                  </p>
                </div>

                {hub.formattedAddress && (
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {hub.formattedAddress}
                  </p>
                )}
              </div>

              {/* Description */}
              {hub.description && (
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  {hub.description}
                </p>
              )}

              {/* Broad areas */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {hub.broadAreas.map((area) => (
                  <span
                    key={area}
                    className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    <MapPin className="size-3 shrink-0" aria-hidden="true" />
                    {area}
                  </span>
                ))}
              </div>

              {/* Google Places metadata note */}
              <p className="mt-3 text-[11px] text-muted-foreground/60">
                Google Places data:{" "}
                <span className="font-medium">
                  placeId, formattedAddress, googleMapsUri, location, rating
                </span>{" "}
                — loaded server-side via Places API when integrated. Photo attribution
                will be displayed as required by Google policy.
              </p>
            </div>

            {/* Live presence */}
            <div className="mt-8">
              <LivePresencePanel presence={hub.demoPresence} />
            </div>

            {/* Hub guide / blog preview — public, no login required */}
            {hub.guide && (
              <div className="mt-8">
                <HubBlogPreview guide={hub.guide} />
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside
            aria-label="Hub actions"
            className="flex w-full flex-col gap-5 lg:sticky lg:top-[88px] lg:w-[300px] lg:shrink-0"
          >
            <CheckInComposer hub={hub} />
            <ProMeetingCard />
          </aside>
        </div>
      </div>
    </div>
  )
}
