/**
 * TogetLink Places — TypeScript types
 *
 * Places API FieldMask (when using Google Places New API):
 *   places.id, places.displayName, places.formattedAddress, places.location,
 *   places.rating, places.userRatingCount, places.photos, places.googleMapsUri,
 *   places.regularOpeningHours, places.primaryType, places.types
 *
 * IMPORTANT:
 * - Store Place IDs safely; they are stable identifiers across sessions.
 * - Do NOT permanently cache restricted Google Places content (photos, reviews)
 *   unless expressly permitted by Google Places API policies.
 * - Always show photo attribution when displaying Google Places photos.
 * - Never expose private user location or exact seat-level position publicly.
 */

export type HubCategory =
  | "coworking"
  | "cafe"
  | "park"
  | "event"
  | "startup_hub"
  | "library"
  | "university_hub"

export type CountryCode = "TR" | "US"

export type RegionId = "turkey" | "united_states" | "global"

export interface HubPhoto {
  /** Google Places photo resource name — e.g. "places/ChIJ.../photos/..." */
  name?: string
  /** Resolved URL — only set after server-side Places API call */
  url?: string
  /** Required attribution string from Google Places API */
  attribution?: string
}

export interface HubCheckIn {
  /** Display name — first name only or initials */
  displayName: string
  /** Profile avatar image URL */
  avatarUrl?: string
  role: string
  /** Broad venue area — never exact seat or table */
  broadArea: string
  workIntent: string
  collaborationInterest: string
  /** Optional user-approved visual clue */
  visualClue?: string
  /** Availability window, e.g. "Available until 17:00" */
  availability: string
  /** true = real check-in; false = demo sample */
  isLive: boolean
}

export interface TogetlinkHub {
  id: string
  /**
   * Google Places place_id — e.g. "ChIJN1t_tDeuEmsRUsoyG83frY4"
   * Server-side only. Do NOT expose raw API keys client-side.
   */
  placeId: string
  slug: string
  name: string
  city: string
  country: CountryCode
  category: HubCategory
  formattedAddress?: string
  googleMapsUri?: string
  /** Coordinates placeholder — populated from Places API */
  location?: { lat: number; lng: number }
  rating?: number
  userRatingCount?: number
  photo?: HubPhoto
  /** Short summary of current professional activity */
  currentIntentSummary: string
  checkedInCount: number
  /** Broad venue areas — never exact seats */
  broadAreas: string[]
  /** Always true in this mock layer */
  isDemo: boolean
  description?: string
  /** Optional hub guide/blog content — public, indexable */
  guide?: {
    title: string
    body: string
    publishedAt: string
  }
  /** Demo check-in samples for the live presence panel */
  demoPresence?: HubCheckIn[]
}

export interface RegionDetectionResult {
  region: RegionId
  confidence: "high" | "medium" | "low"
  source: "timezone" | "language" | "fallback"
}

// ---------------------------------------------------------------------------
// API response shapes
// ---------------------------------------------------------------------------

export interface PlacesSearchResponse {
  hubs: TogetlinkHub[]
  total: number
  region: RegionId
  query?: string
  category?: HubCategory | "all"
}

export interface PlacesDetailsResponse {
  hub: TogetlinkHub | null
}
