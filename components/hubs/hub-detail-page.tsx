"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronRight,
  ExternalLink,
  ImageOff,
  MapPin,
  Star,
  Users,
} from "lucide-react"

import { CATEGORY_ICONS } from "@/lib/places/category-meta"
import {
  CATEGORY_LABELS,
  COUNTRY_LABELS,
  type HubGuide,
  type PresenceSample,
  type TogetlinkHub,
} from "@/lib/places/types"
import { Badge } from "@/components/ui/badge"
import { MessageBar } from "@/components/ui/message-bar"
import { CheckInComposer } from "./check-in-composer"
import { HubBlogPreview } from "./hub-blog-preview"
import { LivePresencePanel } from "./live-presence-panel"
import { PrivacyConsentDialog, type ConsentIntent } from "./privacy-consent-dialog"
import { ProMeetingCard } from "./pro-meeting-card"

export function HubDetailPage({
  hub,
  guide,
  presence,
}: {
  hub: TogetlinkHub
  guide: HubGuide
  presence: PresenceSample[]
}) {
  const [consentOpen, setConsentOpen] = useState(false)
  const [intent, setIntent] = useState<ConsentIntent>("check-in")
  const CategoryIcon = CATEGORY_ICONS[hub.category]

  function open(next: ConsentIntent) {
    setIntent(next)
    setConsentOpen(true)
  }

  return (
    <div className="tl-dashboard-shell min-h-screen">
      <div className="mx-auto max-w-[1100px] px-6 pb-20 pt-24 lg:px-10 lg:pt-28">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground">
            Explore
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span>{COUNTRY_LABELS[hub.country]}</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span>{hub.city}</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{hub.name}</span>
        </nav>

        {/* Header */}
        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="category">
              <CategoryIcon className="size-3.5" aria-hidden="true" />
              {CATEGORY_LABELS[hub.category]}
            </Badge>
            <Badge variant="privacy">Privacy-safe</Badge>
            {hub.isDemo && <Badge variant="demo">Demo data</Badge>}
          </div>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {hub.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {hub.formattedAddress ?? `${hub.city}, ${COUNTRY_LABELS[hub.country]}`}
            </span>
            {hub.rating != null && (
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand-yellow text-brand-yellow" aria-hidden="true" />
                {hub.rating.toFixed(1)}
                {hub.userRatingCount ? ` (${hub.userRatingCount.toLocaleString()})` : ""}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              {hub.checkedInCount} checked in
            </span>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            {/* Photo placeholder with attribution slot */}
            <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex h-56 items-center justify-center bg-secondary sm:h-72">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageOff className="size-7" aria-hidden="true" />
                  <span className="text-sm">Photo will load from Google Places</span>
                </div>
              </div>
              <figcaption className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                Photo attribution will be shown when loaded from Google Places.
              </figcaption>
            </figure>

            {/* Why this place */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">
                Why {hub.name} is great for professional networking
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/85">
                {hub.currentIntentSummary}. This is a comfortable place to combine
                focused work with the chance to meet like-minded professionals nearby.
                On TogetLink, people here share a privacy-safe summary of what they are
                working on — never their exact seat or private contact details.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {hub.broadAreas.map((area) => (
                  <Badge key={area} variant="neutral">
                    {area}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Places-ready metadata */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground">Place details</h2>
              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <MetaRow label="Category" value={CATEGORY_LABELS[hub.category]} />
                <MetaRow label="City" value={hub.city} />
                <MetaRow label="Country" value={COUNTRY_LABELS[hub.country]} />
                <MetaRow label="Address" value={hub.formattedAddress ?? "—"} />
                <MetaRow
                  label="Coordinates"
                  value={
                    hub.location
                      ? `${hub.location.lat.toFixed(4)}, ${hub.location.lng.toFixed(4)}`
                      : "Placeholder — loads from Places"
                  }
                />
                <MetaRow label="Place ID" value={hub.placeId} mono />
              </dl>
              <div className="mt-4">
                <a
                  href={hub.googleMapsUri ?? "#"}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
                >
                  View on Google Maps
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  Google Maps link is a placeholder until connected to the Places API.
                </p>
              </div>
            </section>

            {/* Public guide */}
            <HubBlogPreview guide={guide} />

            {/* Live presence */}
            <LivePresencePanel presence={presence} />

            {/* Privacy notice */}
            <MessageBar kind="privacy">
              Your exact personal location is never shown publicly. TogetLink only
              displays broad venue areas and the privacy-safe summary you choose to
              share.
            </MessageBar>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <CheckInComposer hub={hub} onRequestCheckIn={() => open("check-in")} />
            <ProMeetingCard onRequest={() => open("intro")} />
          </aside>
        </div>
      </div>

      <PrivacyConsentDialog
        open={consentOpen}
        onOpenChange={setConsentOpen}
        intent={intent}
        hubName={hub.name}
      />
    </div>
  )
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={mono ? "text-sm font-mono text-foreground/80" : "text-sm text-foreground/90"}>
        {value}
      </dd>
    </div>
  )
}
