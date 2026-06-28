/**
 * TogetLink venue data model.
 *
 * In production, venue discovery data (name, address, location, rating, photos,
 * primary type, website) should come from the Google Places API:
 *   - Text Search:    POST https://places.googleapis.com/v1/places:searchText
 *   - Nearby Search:  POST https://places.googleapis.com/v1/places:searchNearby
 *   - Place Details:  GET  https://places.googleapis.com/v1/places/{placeId}
 *   - Place Photos:   GET  https://places.googleapis.com/v1/{photoName}/media
 *
 * TogetLink layers its own privacy-safe professional context (professionalSignals,
 * liveIntentExamples) on top of the Places metadata.
 *
 * The values below are DEMO data only. They are not live and should not be
 * presented as real-time availability.
 */
export type TogetLinkVenue = {
  id: string
  name: string
  city: string
  country: string
  countryCode: string
  continent: string
  category: string
  rating?: number
  /** Optional Place Photo media URL, resolved server-side in production. */
  photoUrl?: string
  /** Google Places `places.id`, used to fetch Place Details / Photos server-side. */
  googlePlaceId?: string
  /** Privacy-safe, broad professional context. Never exact personal tracking. */
  professionalSignals: string[]
  /** Example collaboration intents that may be present. Demo only. */
  liveIntentExamples: string[]
}

export const DEMO_VENUES: TogetLinkVenue[] = [
  {
    id: "canopy-jackson-square",
    name: "Canopy Jackson Square",
    city: "San Francisco",
    country: "United States",
    countryCode: "US",
    continent: "North America",
    category: "Coworking / Founder Hub",
    rating: 4.8,
    professionalSignals: ["Founder", "Investor", "Product Builder"],
    liveIntentExamples: ["Raising a seed round", "Hiring a founding engineer"],
  },
  {
    id: "cubo-itau",
    name: "Cubo Itaú",
    city: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    continent: "South America",
    category: "Innovation Hub",
    rating: 4.7,
    professionalSignals: ["Founder", "Developer", "Investor"],
    liveIntentExamples: ["Exploring LatAm expansion", "Open to advising"],
  },
  {
    id: "second-home-spitalfields",
    name: "Second Home Spitalfields",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    continent: "Europe",
    category: "Creative Workspace",
    rating: 4.6,
    professionalSignals: ["Designer", "Product Builder", "Founder"],
    liveIntentExamples: ["Looking for a design partner", "Open to collaborate"],
  },
  {
    id: "the-hive-carpenter",
    name: "The Hive Carpenter",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    continent: "Asia",
    category: "Professional Coworking",
    rating: 4.7,
    professionalSignals: ["Developer", "HR / Talent", "Founder"],
    liveIntentExamples: ["Hiring across APAC", "Open to mentorship"],
  },
  {
    id: "workshop17-va-waterfront",
    name: "Workshop17 V&A Waterfront",
    city: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    continent: "Africa",
    category: "Startup Workspace",
    rating: 4.8,
    professionalSignals: ["Founder", "Designer", "Developer"],
    liveIntentExamples: ["Building a new product", "Looking for co-founder"],
  },
  {
    id: "fishburners-sydney",
    name: "Fishburners Sydney",
    city: "Sydney",
    country: "Australia",
    countryCode: "AU",
    continent: "Oceania",
    category: "Startup Community",
    rating: 4.6,
    professionalSignals: ["Founder", "Investor", "HR / Talent"],
    liveIntentExamples: ["Scaling a team", "Open to angel investing"],
  },
]
