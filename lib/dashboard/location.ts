import type { CountryCode } from "@/lib/places/types"
import { detectRegion } from "@/lib/places/region-detection"

/**
 * Derive a CountryCode ("TR" | "US") from the existing region-detection
 * utility. Falls back to "US" when region is "global" or unknown.
 *
 * Run client-side only — uses Intl / navigator APIs.
 */
export function detectUserCountry(): CountryCode {
  const result = detectRegion()
  if (result.region === "turkey") return "TR"
  if (result.region === "united_states") return "US"
  return "US" // default fallback
}

/** Approximate geographic centre of a country, used when exact user
 *  coordinates are unavailable. Never used as a claimed live position. */
export const COUNTRY_CENTERS: Record<CountryCode, { lat: number; lng: number }> = {
  TR: { lat: 39.9, lng: 32.86 }, // Ankara centre
  US: { lat: 37.77, lng: -122.4 }, // San Francisco centre
}
