/**
 * GET /api/places/details
 *
 * Query params:
 *   slug     — hub slug (e.g. "kolektif-house-levent")
 *   placeId  — Google Places place_id (optional, for real API lookups)
 *
 * Currently returns mock data.
 * Ready to integrate Google Places New API Place Details endpoint.
 *
 * When integrating the real API:
 *   - Use GOOGLE_PLACES_API_KEY server-side only.
 *   - NEVER expose via NEXT_PUBLIC_* or client bundles.
 *   - FieldMask for details:
 *       id,displayName,formattedAddress,location,rating,userRatingCount,
 *       photos,googleMapsUri,regularOpeningHours,primaryType,types,
 *       editorialSummary,reviews
 *   - Do not permanently cache restricted content beyond API policy limits.
 *   - Photos: always pass photo name + attribution string to client.
 *   - Never store or display exact user GPS coordinates publicly.
 */

import { NextRequest, NextResponse } from "next/server"
import { getHubBySlug } from "@/lib/places/mock-hubs"
import type { PlacesDetailsResponse } from "@/lib/places/types"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json(
      { error: "Missing required param: slug" },
      { status: 400 },
    )
  }

  const hub = getHubBySlug(slug) ?? null

  if (!hub) {
    return NextResponse.json({ hub: null } satisfies PlacesDetailsResponse, {
      status: 404,
    })
  }

  return NextResponse.json({ hub } satisfies PlacesDetailsResponse)
}
