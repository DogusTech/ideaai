import { NextResponse } from "next/server"

import {
  getGuideForHub,
  getHubBySlugOnly,
  getPresenceForHub,
  MOCK_HUBS,
} from "@/lib/places/mock-hubs"

/**
 * Place details — API-ready route handler.
 *
 * Accepts either `?placeId=` or `?slug=`. Returns the hub record plus the
 * public guide and privacy-safe presence samples used by the detail page.
 *
 * ── Google Places API (New) integration notes ──────────────────────────────
 * Endpoint (Details): GET https://places.googleapis.com/v1/places/{PLACE_ID}
 * Endpoint (Photos):  GET https://places.googleapis.com/v1/{PHOTO_NAME}/media?maxWidthPx=800
 *
 * Auth + FieldMask (server-only key, request only what we render):
 *   headers: {
 *     "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
 *     "X-Goog-FieldMask": [
 *       "id","displayName","formattedAddress","location","rating",
 *       "userRatingCount","photos","googleMapsUri","regularOpeningHours",
 *       "primaryType","types",
 *     ].join(","),
 *   }
 *
 * Policy:
 *  - Store the Place ID safely; do not permanently cache restricted content.
 *  - When rendering a photo, ALWAYS display its `authorAttributions`.
 *  - Presence data is TogetLink's own privacy-safe layer — it never includes a
 *    user's exact location, seat, or private contact details.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get("placeId")
  const slug = searchParams.get("slug")

  if (!placeId && !slug) {
    return NextResponse.json(
      { error: "Provide a `placeId` or `slug` query parameter." },
      { status: 400 },
    )
  }

  // ── MOCK IMPLEMENTATION (replace with Places Details + Photos) ────────────
  const hub = placeId
    ? MOCK_HUBS.find((h) => h.placeId === placeId)
    : slug
      ? getHubBySlugOnly(slug)
      : undefined

  if (!hub) {
    return NextResponse.json({ error: "Hub not found." }, { status: 404 })
  }

  return NextResponse.json({
    source: "mock",
    isDemo: true,
    notice: "Demo samples — not a live user feed.",
    hub,
    guide: getGuideForHub(hub),
    presence: getPresenceForHub(hub),
  })
}
