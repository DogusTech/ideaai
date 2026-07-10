"use client"

import { useState, useEffect } from "react"
import { DashboardHubCard } from "@/components/dashboard/hub-card"
import type { TogetlinkHub } from "@/lib/places/types"
import { detectUserCountry } from "@/lib/dashboard/location"
import { rankHubsByUserCountry, type RankedHubs } from "@/lib/dashboard/hub-ranking"
import { haversineKm } from "@/lib/dashboard/distance"

interface UserCoords {
  lat: number
  lng: number
}

interface CountryAwareHubListProps {
  hubs: TogetlinkHub[]
}

export function CountryAwareHubList({ hubs }: CountryAwareHubListProps) {
  const [ranked, setRanked] = useState<RankedHubs | null>(null)
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null)

  // Detect user country and rank hubs — runs only client-side
  useEffect(() => {
    const country = detectUserCountry()
    setRanked(rankHubsByUserCountry(hubs, country))
  }, [hubs])

  // Request browser geolocation — non-blocking; page works without it
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        // Permission denied or error — silently ignore
      },
      { timeout: 5000 },
    )
  }, [])

  if (!ranked) {
    // Skeleton while detecting region
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-2xl bg-muted"
            aria-hidden="true"
          />
        ))}
      </div>
    )
  }

  if (ranked.hubs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No hubs available yet.
          <br />
          Check back soon as new professional hubs are added.
        </p>
      </div>
    )
  }

  return (
    <section aria-label="Recommended hubs">
      {/* Region label */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{ranked.label}</p>
        {ranked.mode === "fallback-us" && (
          <span className="rounded-full bg-brand-yellow/15 px-3 py-0.5 text-xs font-medium text-[#7c5c00]">
            Showing US hubs
          </span>
        )}
      </div>

      {/* Hub grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.hubs.map((hub) => {
          const distanceKm =
            userCoords && hub.location
              ? haversineKm(userCoords, hub.location)
              : null

          return (
            <DashboardHubCard
              key={hub.id}
              hub={hub}
              distanceKm={distanceKm}
            />
          )
        })}
      </div>
    </section>
  )
}
