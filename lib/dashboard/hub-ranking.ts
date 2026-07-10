import type { TogetlinkHub, CountryCode } from "@/lib/places/types"

export type RankingMode = "local" | "fallback-us" | "global"

export interface RankedHubs {
  hubs: TogetlinkHub[]
  mode: RankingMode
  label: string
}

/**
 * Rank / filter hubs based on the detected user country.
 *
 * Priority:
 *  1. Hubs in the user's country
 *  2. Fallback to US hubs if no local hubs found
 *  3. All hubs if neither TR nor US exist
 *
 * Country is a bias, not a hard filter — callers can always pass the full
 * list and let the user search across all regions manually.
 */
export function rankHubsByUserCountry(
  hubs: TogetlinkHub[],
  userCountry: CountryCode,
): RankedHubs {
  const localHubs = hubs.filter((h) => h.country === userCountry)
  if (localHubs.length > 0) {
    return {
      hubs: localHubs,
      mode: "local",
      label: "Hubs near you",
    }
  }

  const usHubs = hubs.filter((h) => h.country === "US")
  if (usHubs.length > 0) {
    return {
      hubs: usHubs,
      mode: "fallback-us",
      label: "No local hubs yet — showing United States hubs",
    }
  }

  return {
    hubs,
    mode: "global",
    label: "Available hubs",
  }
}

/**
 * Build a Google Maps URL from a hub.
 * Prefers the official googleMapsUri; falls back to a lat/lng query URL.
 */
export function getGoogleMapsUrl(hub: TogetlinkHub): string | null {
  if (hub.googleMapsUri) return hub.googleMapsUri
  if (hub.location) {
    return `https://www.google.com/maps/search/?api=1&query=${hub.location.lat},${hub.location.lng}`
  }
  return null
}

/**
 * Derive the check-in CTA label from the hub's checkedInCount.
 */
export function getCheckinCta(hub: TogetlinkHub): "Be First" | "Join Hub" {
  return hub.checkedInCount > 0 ? "Join Hub" : "Be First"
}

/**
 * Format the checked-in count as a human-readable string.
 */
export function formatCheckedInCount(count: number): string {
  if (count === 0) return "No one checked in yet"
  if (count === 1) return "1 person checked in"
  return `${count} people checked in`
}

/**
 * Build the hub detail page href. Falls back to /explore if slug missing.
 */
export function getHubDetailHref(hub: TogetlinkHub): string {
  if (!hub.slug || !hub.city || !hub.country) return "/explore"
  const citySlug = hub.city.toLowerCase().replace(/\s+/g, "-")
  return `/hubs/${hub.country.toLowerCase()}/${citySlug}/${hub.slug}`
}
