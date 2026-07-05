import { NextResponse } from "next/server"

import { MOCK_HUBS, rankHubs } from "@/lib/places/mock-hubs"
import type { HubCategory, Region } from "@/lib/places/types"

/**
 * Places search — API-ready route handler.
 *
 * Today: returns clearly-labeled mock data ranked with a region bias.
 * Tomorrow: swap the mock block for a Google Places API (New) call.
 *
 * ── Google Places API (New) integration notes ──────────────────────────────
 * Endpoint (Text Search):  POST https://places.googleapis.com/v1/places:searchText
 * Endpoint (Nearby):       POST https://places.googleapis.com/v1/places:searchNearby
 * Endpoint (Autocomplete): POST https://places.googleapis.com/v1/places:autocomplete
 *
 * Auth: send the server-side key via the `X-Goog-Api-Key` header. NEVER use a
 * NEXT_PUBLIC_* variable for Web Service calls — keep the key server-only, e.g.
 *   headers: {
 *     "Content-Type": "application/json",
 *     "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
 *     // Request ONLY the fields we render to control cost + honor policy:
 *     "X-Goog-FieldMask": [
 *       "places.id",
 *       "places.displayName",
 *       "places.formattedAddress",
 *       "places.location",
 *       "places.rating",
 *       "places.userRatingCount",
 *       "places.photos",
 *       "places.googleMapsUri",
 *       "places.regularOpeningHours",
 *       "places.primaryType",
 *       "places.types",
 *     ].join(","),
 *   }
 *
 * Region bias: pass `locationBias`/`regionCode` ("TR" / "US") instead of
 * hard-filtering, so cross-country search by name still works.
 *
 * Policy:
 *  - Store `places.id` (Place ID) safely; it is a stable identifier.
 *  - Do NOT permanently cache restricted content (names, photos) beyond policy.
 *  - Always surface photo attribution when rendering `places.photos`.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""
  const category = (searchParams.get("category") ?? "all") as HubCategory | "all"
  const region = (searchParams.get("region") ?? "GLOBAL") as Region

  // ── MOCK IMPLEMENTATION (replace with Places Text/Nearby Search) ──────────
  const results = rankHubs(MOCK_HUBS, { query, category, region })

  return NextResponse.json({
    source: "mock",
    isDemo: true,
    notice: "Demo samples — not a live user feed.",
    region,
    count: results.length,
    results,
  })
}
