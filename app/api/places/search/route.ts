/**
 * GET /api/places/search
 *
 * Query params:
 *   q        — search query string
 *   category — HubCategory | "all"
 *   region   — "turkey" | "united_states" | "global"
 *   country  — "TR" | "US"
 *
 * Currently returns mock data.
 * Ready to integrate Google Places New API Text Search or Nearby Search.
 *
 * When integrating the real API:
 *   - Use the GOOGLE_PLACES_API_KEY server-side environment variable only.
 *   - NEVER expose it via NEXT_PUBLIC_* or in client bundles.
 *   - Request only required fields via FieldMask:
 *       places.id,places.displayName,places.formattedAddress,places.location,
 *       places.rating,places.userRatingCount,places.photos,places.googleMapsUri,
 *       places.regularOpeningHours,places.primaryType,places.types
 *   - Do not permanently cache restricted content (photos) beyond API policy limits.
 *   - Always pass photo attribution to the client for display.
 */

import { NextRequest, NextResponse } from "next/server"
import { MOCK_HUBS, searchHubs } from "@/lib/places/mock-hubs"
import { regionToCountryOrder } from "@/lib/places/region-detection"
import type {
  HubCategory,
  PlacesSearchResponse,
  RegionId,
} from "@/lib/places/types"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const q = searchParams.get("q") ?? ""
  const category = (searchParams.get("category") ?? "all") as HubCategory | "all"
  const region = (searchParams.get("region") ?? "global") as RegionId
  const countryFilter = searchParams.get("country") as "TR" | "US" | null

  const regionBias = regionToCountryOrder(region)

  // Search with region bias
  let hubs = q ? searchHubs(q, regionBias) : [...MOCK_HUBS]

  // Apply hard country filter only when explicitly requested
  if (countryFilter) {
    hubs = hubs.filter((h) => h.country === countryFilter)
  } else {
    // Apply region ranking bias
    hubs = [
      ...hubs.filter((h) => h.country === regionBias[0]),
      ...hubs.filter((h) => h.country !== regionBias[0]),
    ]
  }

  // Apply category filter
  if (category !== "all") {
    hubs = hubs.filter((h) => h.category === category)
  }

  const response: PlacesSearchResponse = {
    hubs,
    total: hubs.length,
    region,
    query: q || undefined,
    category: category,
  }

  return NextResponse.json(response)
}
