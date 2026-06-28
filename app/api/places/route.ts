import { NextResponse } from "next/server"
import { DEMO_VENUES } from "@/lib/venues"

/**
 * Server-side Google Places proxy.
 *
 * Use a Next.js Route Handler for Google Places API requests so the API key
 * stays server-side. NEVER expose the key to the client and NEVER use
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for these private Places calls.
 *
 * Set GOOGLE_MAPS_API_KEY in your Vercel project environment variables.
 *
 * Always send a FieldMask to control cost and performance. Request only the
 * fields you render:
 *   places.id
 *   places.displayName
 *   places.formattedAddress
 *   places.location
 *   places.rating
 *   places.userRatingCount
 *   places.photos
 *   places.primaryType
 *   places.websiteUri
 */
export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  // Until a key is configured, return privacy-safe demo data so the UI works.
  if (!apiKey) {
    return NextResponse.json({ source: "demo", venues: DEMO_VENUES })
  }

  // Production example (left commented as a reference implementation):
  //
  // const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-Goog-Api-Key": apiKey,
  //     "X-Goog-FieldMask": [
  //       "places.id",
  //       "places.displayName",
  //       "places.formattedAddress",
  //       "places.location",
  //       "places.rating",
  //       "places.userRatingCount",
  //       "places.photos",
  //       "places.primaryType",
  //       "places.websiteUri",
  //     ].join(","),
  //   },
  //   body: JSON.stringify({ textQuery: "coworking and founder hubs" }),
  // })
  // const data = await res.json()
  // ...map Places results into TogetLinkVenue and layer professional signals.

  return NextResponse.json({ source: "demo", venues: DEMO_VENUES })
}
