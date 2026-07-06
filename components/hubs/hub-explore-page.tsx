"use client"

import { useEffect, useMemo, useState } from "react"
import { MOCK_HUBS } from "@/lib/places/mock-hubs"
import { detectRegion, regionToCountryOrder } from "@/lib/places/region-detection"
import type { CategoryFilter } from "./hub-filter-tabs"
import type { RegionId } from "@/lib/places/types"
import { HubSearchBar } from "./hub-search-bar"
import { HubFilterTabs } from "./hub-filter-tabs"
import { RegionSwitcher } from "./region-switcher"
import { HubList } from "./hub-list"
import { HubMapPreview } from "./hub-map-preview"

export function HubExplorePage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [region, setRegion] = useState<RegionId>("global")

  // Detect region once on mount (client-side only)
  useEffect(() => {
    const detected = detectRegion()
    setRegion(detected.region)
  }, [])

  const filteredHubs = useMemo(() => {
    const regionBias = regionToCountryOrder(region)
    const q = query.toLowerCase().trim()

    let hubs = [...MOCK_HUBS]

    // Query filter — cross-country, never blocked
    if (q) {
      hubs = hubs.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.category.toLowerCase().includes(q) ||
          h.description?.toLowerCase().includes(q),
      )
    }

    // Category filter
    if (category !== "all") {
      hubs = hubs.filter((h) => h.category === category)
    }

    // Region bias sort — preferred country first, all results included
    hubs = [
      ...hubs.filter((h) => h.country === regionBias[0]),
      ...hubs.filter((h) => h.country !== regionBias[0]),
    ]

    return hubs
  }, [query, category, region])

  return (
    <div className="tl-dashboard-shell min-h-screen">
      {/* Page header */}
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 pb-5 pt-8 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore professional hubs
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Discover real-world spaces where professionals work, meet, and collaborate.
          </p>

          {/* Search + region row */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <HubSearchBar
              value={query}
              onChange={setQuery}
              className="flex-1"
            />
            <RegionSwitcher value={region} onChange={setRegion} />
          </div>

          {/* Category filter tabs */}
          <div className="mt-4">
            <HubFilterTabs value={category} onChange={setCategory} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Hub grid */}
          <div className="flex-1 min-w-0">
            <p
              aria-live="polite"
              aria-atomic="true"
              className="mb-4 text-sm text-muted-foreground"
            >
              {filteredHubs.length} hub{filteredHubs.length === 1 ? "" : "s"} found
              {query ? ` for "${query}"` : ""}
            </p>
            <HubList hubs={filteredHubs} />
          </div>

          {/* Map sidebar */}
          <aside
            aria-label="Map preview"
            className="w-full lg:sticky lg:top-[88px] lg:w-[320px] lg:shrink-0"
          >
            <HubMapPreview />
            <p className="mt-3 text-[11px] text-muted-foreground/70 text-center">
              All check-in samples are illustrative.{" "}
              <strong>Demo samples &mdash; not a live user feed.</strong>
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
