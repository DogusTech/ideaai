"use client"

import { useEffect, useMemo, useState } from "react"

import { MOCK_HUBS, rankHubs } from "@/lib/places/mock-hubs"
import { detectRegion } from "@/lib/places/region-detection"
import type { HubCategory, Region, TogetlinkHub } from "@/lib/places/types"
import { MessageBar } from "@/components/ui/message-bar"
import { CtaCards } from "./cta-cards"
import { HubFilterTabs } from "./hub-filter-tabs"
import { HubList } from "./hub-list"
import { HubMapPreview } from "./hub-map-preview"
import { HubSearchBar } from "./hub-search-bar"
import { PrivacyConsentDialog } from "./privacy-consent-dialog"
import { RegionSwitcher } from "./region-switcher"

export function HubExplorePage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<HubCategory | "all">("all")
  const [region, setRegion] = useState<Region>("GLOBAL")
  const [consentOpen, setConsentOpen] = useState(false)
  const [activeHub, setActiveHub] = useState<TogetlinkHub | null>(null)

  // Detect the region default once on mount. A manual switch or search overrides.
  useEffect(() => {
    setRegion(detectRegion())
  }, [])

  const results = useMemo(
    () => rankHubs(MOCK_HUBS, { query, category, region }),
    [query, category, region],
  )

  function handleCheckIn(hub: TogetlinkHub) {
    setActiveHub(hub)
    setConsentOpen(true)
  }

  return (
    <div className="tl-dashboard-shell min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-24 lg:px-10 lg:pt-28">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold text-brand-blue">Explore hubs</p>
          <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Discover real-world places where professionals meet
          </h1>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            Find coworking spaces, cafés, parks, and startup hubs near you. See what
            people are working on in a privacy-safe way, then check in to collaborate.
          </p>
        </header>

        <div className="mt-6">
          <MessageBar kind="info">
            Demo samples — not a live user feed. Check-in activity shown here is
            illustrative until real professionals join your area.
          </MessageBar>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-xl lg:flex-1">
              <HubSearchBar value={query} onChange={setQuery} />
            </div>
            <RegionSwitcher value={region} onChange={setRegion} />
          </div>
          <HubFilterTabs value={category} onChange={setCategory} />
        </div>

        {/* CTA cards */}
        <div className="mt-8">
          <CtaCards />
        </div>

        {/* Results + map */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {results.length} {results.length === 1 ? "hub" : "hubs"}
                {region !== "GLOBAL" && !query ? (
                  <span className="text-muted-foreground"> · {region === "TR" ? "Turkey first" : "US first"}</span>
                ) : null}
              </h2>
            </div>
            <HubList hubs={results} onCheckIn={handleCheckIn} />
          </div>
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <HubMapPreview count={results.length} />
            </div>
          </aside>
        </div>
      </div>

      <PrivacyConsentDialog
        open={consentOpen}
        onOpenChange={setConsentOpen}
        intent="check-in"
        hubName={activeHub?.name}
      />
    </div>
  )
}
