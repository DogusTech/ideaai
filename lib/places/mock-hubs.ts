import type {
  CountryCode,
  HubCategory,
  HubGuide,
  PresenceSample,
  TogetlinkHub,
} from "./types"

/**
 * Stable, clearly-labeled demo seed data.
 *
 * IMPORTANT: This is NOT a live user feed. Every record has `isDemo: true`
 * and presence samples are labeled "Demo sample". When the real Google Places
 * layer is wired in, these are replaced by fetched results while the UI stays
 * identical.
 *
 * `placeId` values here are illustrative placeholders (prefixed `demo_`). Real
 * Google Place IDs look like "ChIJ...". Do not treat these as valid Place IDs.
 */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

type SeedInput = Omit<TogetlinkHub, "id" | "slug" | "placeId" | "isDemo"> & {
  placeId?: string
}

function makeHub(seed: SeedInput): TogetlinkHub {
  const slug = slugify(seed.name)
  return {
    ...seed,
    id: `${seed.country.toLowerCase()}-${slug}`,
    slug,
    placeId: seed.placeId ?? `demo_${seed.country.toLowerCase()}_${slug}`,
    isDemo: true,
  }
}

// ---------------------------------------------------------------------------
// Turkey seed hubs
// ---------------------------------------------------------------------------
const TR_HUBS: TogetlinkHub[] = [
  makeHub({
    name: "Kolektif House Levent",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    formattedAddress: "Levent, Beşiktaş, Istanbul",
    location: { lat: 41.0817, lng: 29.0102 },
    rating: 4.6,
    userRatingCount: 820,
    currentIntentSummary: "Founders and product teams shipping this week",
    checkedInCount: 14,
    broadAreas: ["Main coworking floor", "Quiet desk zone", "Café corner"],
  }),
  makeHub({
    name: "Workinton Levent",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    formattedAddress: "Levent, Istanbul",
    rating: 4.4,
    userRatingCount: 410,
    currentIntentSummary: "Freelancers and small teams heads-down on client work",
    checkedInCount: 9,
    broadAreas: ["Open desk area", "Phone booths", "Lounge"],
  }),
  makeHub({
    name: "Atölye Istanbul",
    city: "Istanbul",
    country: "TR",
    category: "startup_hub",
    formattedAddress: "Bomonti, Şişli, Istanbul",
    rating: 4.7,
    userRatingCount: 260,
    currentIntentSummary: "Design-led founders and impact builders collaborating",
    checkedInCount: 11,
    broadAreas: ["Studio floor", "Workshop space", "Garden seating"],
  }),
  makeHub({
    name: "Salt Galata",
    city: "Istanbul",
    country: "TR",
    category: "library",
    formattedAddress: "Bankalar Caddesi, Karaköy, Istanbul",
    rating: 4.8,
    userRatingCount: 3100,
    currentIntentSummary: "Researchers and writers in deep focus",
    checkedInCount: 6,
    broadAreas: ["Reading room", "Quiet study zone"],
  }),
  makeHub({
    name: "Maçka Demokrasi Parkı",
    city: "Istanbul",
    country: "TR",
    category: "park",
    formattedAddress: "Maçka, Şişli, Istanbul",
    rating: 4.5,
    userRatingCount: 5400,
    currentIntentSummary: "Walking meetings and outdoor brainstorming",
    checkedInCount: 4,
    broadAreas: ["Garden seating", "Hillside benches"],
  }),
  makeHub({
    name: "Prime Coffee Levent",
    city: "Istanbul",
    country: "TR",
    category: "cafe",
    formattedAddress: "Levent, Istanbul",
    rating: 4.3,
    userRatingCount: 190,
    currentIntentSummary: "Casual coffee catch-ups and quick 1:1s",
    checkedInCount: 7,
    broadAreas: ["Window seating", "Back tables"],
  }),
  makeHub({
    name: "Istanbul Community Hub",
    city: "Istanbul",
    country: "TR",
    category: "university_hub",
    formattedAddress: "Istanbul",
    rating: 4.2,
    userRatingCount: 60,
    currentIntentSummary: "Student founders and mentors sharing feedback",
    checkedInCount: 5,
    broadAreas: ["Innovation lab", "Common area"],
  }),
  makeHub({
    name: "CoZone Ankara",
    city: "Ankara",
    country: "TR",
    category: "coworking",
    formattedAddress: "Çankaya, Ankara",
    rating: 4.5,
    userRatingCount: 230,
    currentIntentSummary: "Product and engineering teams pairing on builds",
    checkedInCount: 8,
    broadAreas: ["Main coworking floor", "Meeting nook"],
  }),
  makeHub({
    name: "ODTÜ Teknokent",
    city: "Ankara",
    country: "TR",
    category: "university_hub",
    formattedAddress: "ODTÜ, Çankaya, Ankara",
    rating: 4.7,
    userRatingCount: 540,
    currentIntentSummary: "Deep-tech founders and researchers commercializing R&D",
    checkedInCount: 12,
    broadAreas: ["Incubation floor", "Lab wing", "Café"],
  }),
  makeHub({
    name: "Ankara Startup Loft",
    city: "Ankara",
    country: "TR",
    category: "startup_hub",
    formattedAddress: "Ankara",
    rating: 4.1,
    userRatingCount: 45,
    currentIntentSummary: "Early founders validating ideas together",
    checkedInCount: 3,
    broadAreas: ["Open floor", "Pitch corner"],
  }),
  makeHub({
    name: "Kuğulu Park",
    city: "Ankara",
    country: "TR",
    category: "park",
    formattedAddress: "Kavaklıdere, Çankaya, Ankara",
    rating: 4.6,
    userRatingCount: 8900,
    currentIntentSummary: "Relaxed outdoor meetups and coffee walks",
    checkedInCount: 2,
    broadAreas: ["Pondside benches", "Shaded seating"],
  }),
  makeHub({
    name: "Originn Coworking",
    city: "Izmir",
    country: "TR",
    category: "coworking",
    formattedAddress: "Konak, Izmir",
    rating: 4.6,
    userRatingCount: 180,
    currentIntentSummary: "Remote-first teams and indie makers building",
    checkedInCount: 6,
    broadAreas: ["Main coworking floor", "Quiet desk zone"],
  }),
  makeHub({
    name: "Izmir Startup Hub",
    city: "Izmir",
    country: "TR",
    category: "startup_hub",
    formattedAddress: "Izmir",
    rating: 4.2,
    userRatingCount: 70,
    currentIntentSummary: "Regional founders comparing go-to-market notes",
    checkedInCount: 4,
    broadAreas: ["Event floor", "Mentor corner"],
  }),
  makeHub({
    name: "Kültürpark",
    city: "Izmir",
    country: "TR",
    category: "park",
    formattedAddress: "Alsancak, Konak, Izmir",
    rating: 4.5,
    userRatingCount: 12000,
    currentIntentSummary: "Outdoor networking and casual professional walks",
    checkedInCount: 3,
    broadAreas: ["Garden seating", "Central promenade"],
  }),
  makeHub({
    name: "Antalya Coworking Collective",
    city: "Antalya",
    country: "TR",
    category: "coworking",
    formattedAddress: "Muratpaşa, Antalya",
    rating: 4.3,
    userRatingCount: 90,
    currentIntentSummary: "Digital nomads and remote founders working seaside",
    checkedInCount: 5,
    broadAreas: ["Main coworking floor", "Terrace"],
  }),
  makeHub({
    name: "Antalya Founders Café",
    city: "Antalya",
    country: "TR",
    category: "cafe",
    formattedAddress: "Antalya",
    rating: 4.4,
    userRatingCount: 120,
    currentIntentSummary: "Informal founder coffees and mentoring",
    checkedInCount: 4,
    broadAreas: ["Courtyard seating", "Window tables"],
  }),
]

// ---------------------------------------------------------------------------
// United States seed hubs
// ---------------------------------------------------------------------------
const US_HUBS: TogetlinkHub[] = [
  makeHub({
    name: "Canopy Jackson Square",
    city: "San Francisco",
    country: "US",
    category: "coworking",
    formattedAddress: "Jackson Square, San Francisco, CA",
    location: { lat: 37.7969, lng: -122.4032 },
    rating: 4.7,
    userRatingCount: 320,
    currentIntentSummary: "Design and product leaders in focused deep work",
    checkedInCount: 16,
    broadAreas: ["Main coworking floor", "Quiet desk zone", "Café bar"],
  }),
  makeHub({
    name: "Salesforce Park",
    city: "San Francisco",
    country: "US",
    category: "park",
    formattedAddress: "Salesforce Transit Center, San Francisco, CA",
    rating: 4.6,
    userRatingCount: 4200,
    currentIntentSummary: "Rooftop walking meetings and casual syncs",
    checkedInCount: 5,
    broadAreas: ["Garden path", "Amphitheater lawn"],
  }),
  makeHub({
    name: "The Center SF",
    city: "San Francisco",
    country: "US",
    category: "event",
    formattedAddress: "San Francisco, CA",
    rating: 4.5,
    userRatingCount: 140,
    currentIntentSummary: "Community events and founder mixers",
    checkedInCount: 8,
    broadAreas: ["Main hall", "Garden seating"],
  }),
  makeHub({
    name: "Sightglass Startup Café",
    city: "San Francisco",
    country: "US",
    category: "cafe",
    formattedAddress: "SoMa, San Francisco, CA",
    rating: 4.4,
    userRatingCount: 260,
    currentIntentSummary: "Quick 1:1 coffees between builders",
    checkedInCount: 6,
    broadAreas: ["Window counter", "Back tables"],
  }),
  makeHub({
    name: "The Farm SoHo",
    city: "New York",
    country: "US",
    category: "coworking",
    formattedAddress: "SoHo, New York, NY",
    rating: 4.5,
    userRatingCount: 410,
    currentIntentSummary: "Founders and creatives collaborating across teams",
    checkedInCount: 13,
    broadAreas: ["Main coworking floor", "Lounge", "Phone booths"],
  }),
  makeHub({
    name: "Bryant Park",
    city: "New York",
    country: "US",
    category: "park",
    formattedAddress: "Midtown, New York, NY",
    rating: 4.7,
    userRatingCount: 26000,
    currentIntentSummary: "Outdoor working sessions and walking meetings",
    checkedInCount: 7,
    broadAreas: ["Lawn seating", "Terrace tables"],
  }),
  makeHub({
    name: "Gregorys Startup Café",
    city: "New York",
    country: "US",
    category: "cafe",
    formattedAddress: "Manhattan, New York, NY",
    rating: 4.2,
    userRatingCount: 180,
    currentIntentSummary: "Casual coffee intros between professionals",
    checkedInCount: 5,
    broadAreas: ["Front tables", "Counter seating"],
  }),
  makeHub({
    name: "CIC Cambridge",
    city: "Cambridge",
    country: "US",
    category: "startup_hub",
    formattedAddress: "Kendall Square, Cambridge, MA",
    rating: 4.6,
    userRatingCount: 380,
    currentIntentSummary: "Biotech and software founders scaling teams",
    checkedInCount: 15,
    broadAreas: ["Innovation floor", "Café", "Event space"],
  }),
  makeHub({
    name: "Harvard Innovation Labs",
    city: "Cambridge",
    country: "US",
    category: "university_hub",
    formattedAddress: "Allston, Boston, MA",
    rating: 4.7,
    userRatingCount: 210,
    currentIntentSummary: "Student founders and mentors refining ventures",
    checkedInCount: 9,
    broadAreas: ["Venture floor", "Common area"],
  }),
  makeHub({
    name: "Capital Factory",
    city: "Austin",
    country: "US",
    category: "startup_hub",
    formattedAddress: "Downtown Austin, TX",
    rating: 4.6,
    userRatingCount: 640,
    currentIntentSummary: "Founders, investors, and operators connecting",
    checkedInCount: 18,
    broadAreas: ["Main floor", "Event stage", "Café"],
  }),
  makeHub({
    name: "Zilker Park",
    city: "Austin",
    country: "US",
    category: "park",
    formattedAddress: "Zilker, Austin, TX",
    rating: 4.8,
    userRatingCount: 15000,
    currentIntentSummary: "Outdoor meetups and relaxed professional walks",
    checkedInCount: 4,
    broadAreas: ["Great lawn", "Shaded seating"],
  }),
  makeHub({
    name: "Seattle Coworking Collective",
    city: "Seattle",
    country: "US",
    category: "coworking",
    formattedAddress: "Capitol Hill, Seattle, WA",
    rating: 4.4,
    userRatingCount: 150,
    currentIntentSummary: "Cloud and AI builders pairing on projects",
    checkedInCount: 10,
    broadAreas: ["Main coworking floor", "Quiet desk zone"],
  }),
  makeHub({
    name: "Seattle Startup Café",
    city: "Seattle",
    country: "US",
    category: "cafe",
    formattedAddress: "Seattle, WA",
    rating: 4.3,
    userRatingCount: 110,
    currentIntentSummary: "Coffee-driven founder introductions",
    checkedInCount: 4,
    broadAreas: ["Window seating", "Community table"],
  }),
  makeHub({
    name: "LA Coworking Studio",
    city: "Los Angeles",
    country: "US",
    category: "coworking",
    formattedAddress: "Arts District, Los Angeles, CA",
    rating: 4.4,
    userRatingCount: 200,
    currentIntentSummary: "Media, product, and startup teams collaborating",
    checkedInCount: 9,
    broadAreas: ["Main coworking floor", "Creative studio"],
  }),
  makeHub({
    name: "LA Founders Mixer Space",
    city: "Los Angeles",
    country: "US",
    category: "event",
    formattedAddress: "Los Angeles, CA",
    rating: 4.3,
    userRatingCount: 95,
    currentIntentSummary: "Evening founder mixers and demo nights",
    checkedInCount: 12,
    broadAreas: ["Event hall", "Networking lounge"],
  }),
  makeHub({
    name: "Chicago Coworking Loft",
    city: "Chicago",
    country: "US",
    category: "coworking",
    formattedAddress: "The Loop, Chicago, IL",
    rating: 4.5,
    userRatingCount: 170,
    currentIntentSummary: "Fintech and B2B teams heads-down building",
    checkedInCount: 8,
    broadAreas: ["Main coworking floor", "Meeting rooms"],
  }),
  makeHub({
    name: "Millennium Park",
    city: "Chicago",
    country: "US",
    category: "park",
    formattedAddress: "Downtown Chicago, IL",
    rating: 4.8,
    userRatingCount: 40000,
    currentIntentSummary: "Outdoor walking meetings and casual networking",
    checkedInCount: 3,
    broadAreas: ["Promenade", "Pavilion lawn"],
  }),
  makeHub({
    name: "Miami Coworking Bay",
    city: "Miami",
    country: "US",
    category: "coworking",
    formattedAddress: "Brickell, Miami, FL",
    rating: 4.4,
    userRatingCount: 160,
    currentIntentSummary: "Web3 and startup founders collaborating seaside",
    checkedInCount: 11,
    broadAreas: ["Main coworking floor", "Terrace"],
  }),
  makeHub({
    name: "Miami Founders Park Meetup",
    city: "Miami",
    country: "US",
    category: "event",
    formattedAddress: "Miami, FL",
    rating: 4.2,
    userRatingCount: 80,
    currentIntentSummary: "Outdoor founder meetups and coffee sessions",
    checkedInCount: 6,
    broadAreas: ["Park lawn", "Shaded seating"],
  }),
]

export const MOCK_HUBS: TogetlinkHub[] = [...TR_HUBS, ...US_HUBS]

export function getHubsByCountry(country: CountryCode): TogetlinkHub[] {
  return MOCK_HUBS.filter((h) => h.country === country)
}

export function getHubBySlug(
  country: string,
  city: string,
  slug: string,
): TogetlinkHub | undefined {
  const c = country.toUpperCase()
  return MOCK_HUBS.find(
    (h) =>
      h.country === c &&
      h.city.toLowerCase() === decodeURIComponent(city).toLowerCase() &&
      h.slug === slug,
  )
}

export function getHubBySlugOnly(slug: string): TogetlinkHub | undefined {
  return MOCK_HUBS.find((h) => h.slug === slug)
}

/**
 * Region-biased, searchable ranking.
 *
 * Region is a *bias*, not a filter: a query always searches the full set so a
 * US user can still find a Turkish venue by name (and vice versa). Matching
 * results are surfaced; region only affects ordering when relevance ties.
 */
export function rankHubs(
  hubs: TogetlinkHub[],
  opts: { query?: string; category?: HubCategory | "all"; region?: "TR" | "US" | "GLOBAL" },
): TogetlinkHub[] {
  const { query = "", category = "all", region = "GLOBAL" } = opts
  const q = query.trim().toLowerCase()

  let results = hubs.filter((h) => {
    const matchesCategory = category === "all" || h.category === category
    if (!matchesCategory) return false
    if (!q) return true
    return (
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      (h.formattedAddress?.toLowerCase().includes(q) ?? false) ||
      h.category.replace("_", " ").includes(q)
    )
  })

  results = results.slice().sort((a, b) => {
    // When searching, prioritize name-start matches.
    if (q) {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 1 : 0
      const bStarts = b.name.toLowerCase().startsWith(q) ? 1 : 0
      if (aStarts !== bStarts) return bStarts - aStarts
    }
    // Region bias: preferred country floats up on ties.
    if (region !== "GLOBAL") {
      const aRegion = a.country === region ? 1 : 0
      const bRegion = b.country === region ? 1 : 0
      if (aRegion !== bRegion) return bRegion - aRegion
    }
    // Then by popularity signal.
    return (b.userRatingCount ?? 0) - (a.userRatingCount ?? 0)
  })

  return results
}

// ---------------------------------------------------------------------------
// Privacy-safe presence samples (clearly labeled demo data)
// ---------------------------------------------------------------------------
export function getPresenceForHub(hub: TogetlinkHub): PresenceSample[] {
  const base: PresenceSample[] = [
    {
      id: `${hub.id}-p1`,
      displayName: "Elif",
      role: "Founder",
      broadArea: hub.broadAreas[0] ?? "Main floor",
      workIntent: "Working on Firebase schema design",
      collaborationInterest: "Open to swapping backend architecture notes",
      recognitionHint: "Navy hoodie, silver laptop",
      availabilityWindow: "Until 4:00 PM",
      state: "demo",
    },
    {
      id: `${hub.id}-p2`,
      displayName: "M. K.",
      role: "Product Designer",
      broadArea: hub.broadAreas[1] ?? hub.broadAreas[0] ?? "Quiet zone",
      workIntent: "Reviewing onboarding flows",
      collaborationInterest: "Happy to give UX feedback",
      availabilityWindow: "Next 45 minutes",
      state: "demo",
    },
    {
      id: `${hub.id}-p3`,
      displayName: "Deniz",
      role: "Software Engineer",
      broadArea: hub.broadAreas[0] ?? "Main floor",
      workIntent: "Refactoring a Next.js app",
      collaborationInterest: "Open to discussing Next.js architecture",
      recognitionHint: "Green cap",
      availabilityWindow: "Until 6:00 PM",
      state: "demo",
      isPro: true,
    },
    {
      id: `${hub.id}-p4`,
      displayName: "J. R.",
      role: "Student Founder",
      broadArea: hub.broadAreas[2] ?? hub.broadAreas[0] ?? "Common area",
      workIntent: "Preparing a pitch deck",
      collaborationInterest: "Looking for early feedback and intros",
      availabilityWindow: "This afternoon",
      state: "demo",
    },
  ]
  // Show a count roughly aligned with the hub's checked-in number.
  return base.slice(0, Math.max(2, Math.min(base.length, Math.ceil(hub.checkedInCount / 4))))
}

// ---------------------------------------------------------------------------
// Public hub guides (SEO-indexable, visible without login)
// ---------------------------------------------------------------------------
export function getGuideForHub(hub: TogetlinkHub): HubGuide {
  const categoryBlurb: Record<HubCategory, string> = {
    coworking: "a dedicated coworking environment built for focused, professional work",
    cafe: "a relaxed café setting ideal for informal coffee introductions",
    park: "an open outdoor space suited to walking meetings and casual syncs",
    event: "an events venue where founders and operators regularly gather",
    startup_hub: "a startup hub where founders, mentors, and investors intersect",
    library: "a quiet, focus-friendly space for deep work and research",
    university_hub: "a university innovation space connecting students and mentors",
  }

  return {
    title: `A professional's guide to ${hub.name}`,
    excerpt: `Why ${hub.name} in ${hub.city} works well for privacy-safe professional networking and focused collaboration.`,
    readMinutes: 3,
    updatedAt: "2026-01-15",
    body: [
      `${hub.name} is ${categoryBlurb[hub.category]} in ${hub.city}. It is a popular spot for professionals who want to combine focused work with the chance to meet like-minded builders nearby.`,
      `On TogetLink, people who check in here share a privacy-safe summary of what they are working on and how they would like to collaborate — never their exact seat or private contact details. That makes it easy to know whether it is worth saying hello, without any pressure.`,
      `Typical broad areas here include ${hub.broadAreas.join(", ")}. When you check in, you choose a general zone so others have a rough sense of where to find you, while your precise location always stays private.`,
      `Whether you are heads-down on a product or open to a quick 1:1 introduction, ${hub.name} is a comfortable place to turn proximity into a real, consent-based professional conversation.`,
    ],
  }
}
