/**
 * TogetLink Places data model.
 *
 * This layer is designed to be a drop-in replacement target for the
 * Google Places API (New). Today it is backed by mock data, but the shape
 * mirrors the fields we would request from Places so that swapping the
 * data source requires no changes in the UI.
 *
 * Google Places API (New) FieldMask — request ONLY what we render:
 *   places.id
 *   places.displayName
 *   places.formattedAddress
 *   places.location
 *   places.rating
 *   places.userRatingCount
 *   places.photos
 *   places.googleMapsUri
 *   places.regularOpeningHours
 *   places.primaryType
 *   places.types
 *
 * Policy reminders (see also the API route handlers):
 *  - Store Place IDs safely; they are stable identifiers and safe to persist.
 *  - Do NOT permanently cache restricted Google Places content (names, photos,
 *    reviews) beyond what Google policy allows.
 *  - ALWAYS render photo attribution when a Google Places photo is displayed.
 *  - NEVER expose a user's exact/private location or seat-level position.
 */

export type CountryCode = "TR" | "US"

export type Region = "TR" | "US" | "GLOBAL"

export type HubCategory =
  | "coworking"
  | "cafe"
  | "park"
  | "event"
  | "startup_hub"
  | "library"
  | "university_hub"

export type TogetlinkHub = {
  id: string
  /** Google Places `id` — safe to persist. Empty string for pure placeholders. */
  placeId: string
  slug: string
  name: string
  city: string
  country: CountryCode
  category: HubCategory
  formattedAddress?: string
  googleMapsUri?: string
  location?: { lat: number; lng: number }
  rating?: number
  userRatingCount?: number
  photo?: {
    /** Google Places photo resource name, e.g. "places/XXX/photos/YYY". */
    name?: string
    url?: string
    /** Attribution string — MUST be shown when the photo is rendered. */
    attribution?: string
  }
  /** Privacy-safe, aggregate summary of what pros are doing here. */
  currentIntentSummary: string
  checkedInCount: number
  /** Broad, non-identifying venue zones, e.g. "Quiet desk zone". */
  broadAreas: string[]
  /** True when this record is demo/seed data, not a live Places result. */
  isDemo: boolean
}

/** Privacy-safe representation of a professional present at a hub. */
export type PresenceSample = {
  id: string
  /** First name only or initials — never a full identity. */
  displayName: string
  role: string
  /** Broad zone only, never an exact seat/table. */
  broadArea: string
  /** What they are currently working on. */
  workIntent: string
  /** What kind of collaboration they are open to. */
  collaborationInterest: string
  /** Optional, user-approved recognition hint, e.g. "navy hoodie, silver laptop". */
  recognitionHint?: string
  availabilityWindow: string
  /** "demo" = illustrative sample, "live" = a real check-in. */
  state: "demo" | "live"
  isPro?: boolean
}

/** Public hub guide/blog preview — visible without login and SEO-indexable. */
export type HubGuide = {
  title: string
  excerpt: string
  readMinutes: number
  updatedAt: string
  body: string[]
}

export const HUB_CATEGORIES: { value: HubCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "coworking", label: "Coworking" },
  { value: "cafe", label: "Café" },
  { value: "park", label: "Park" },
  { value: "event", label: "Event" },
  { value: "startup_hub", label: "Startup Hub" },
  { value: "library", label: "Library" },
  { value: "university_hub", label: "University Hub" },
]

export const CATEGORY_LABELS: Record<HubCategory, string> = {
  coworking: "Coworking",
  cafe: "Café",
  park: "Park",
  event: "Event",
  startup_hub: "Startup Hub",
  library: "Library",
  university_hub: "University Hub",
}

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  TR: "Turkey",
  US: "United States",
}
