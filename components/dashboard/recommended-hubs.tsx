import { CountryAwareHubList } from "@/components/dashboard/country-aware-hub-list"
import { getDashboardHubs } from "@/lib/api/dashboard"

const MOCK_MARKETING_HUBS = [
  {
    id: "mock-soho",
    name: "Soho House Istanbul",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    checkedInCount: 42,
    rating: 4.8,
    userRatingCount: 2501,
    description: "Exclusive members club and workspace.",
    photo: { photoUri: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80" },
    location: { lat: 41.028, lng: 28.974 },
    slug: "soho-house",
    broadAreas: ["Beyoğlu", "Creative Hub"]
  },
  {
    id: "mock-kolektif",
    name: "Kolektif House Levent",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    checkedInCount: 128,
    rating: 4.6,
    userRatingCount: 1483,
    description: "Vibrant coworking space for tech startups.",
    photo: { photoUri: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80" },
    location: { lat: 41.076, lng: 29.012 },
    slug: "kolektif-house",
    broadAreas: ["Levent", "Tech"]
  },
  {
    id: "mock-wework-sf",
    name: "WeWork Salesforce Tower",
    city: "San Francisco",
    country: "US",
    category: "coworking",
    checkedInCount: 85,
    rating: 4.5,
    userRatingCount: 890,
    description: "Premium workspace in the heart of SF.",
    photo: { photoUri: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    location: { lat: 37.789, lng: -122.396 },
    slug: "wework-sf",
    broadAreas: ["SOMA", "Enterprise"]
  }
]

export async function RecommendedHubs() {
  let hubs: any[] = []
  let error = false

  try {
    hubs = await getDashboardHubs()
  } catch (err) {
    console.error("Failed to fetch dashboard hubs:", err)
    if (process.env.NODE_ENV === "development") {
      hubs = MOCK_MARKETING_HUBS
    } else {
      error = true
    }
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Professional hubs near you
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover real places where people can check in, work, and meet with professional intent.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            We could not load hubs right now.<br />
            Please try again shortly.
          </p>
        </div>
      ) : hubs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hubs are available yet.<br />
            Once venues are synced from Google Places and Firestore, they will appear here.
          </p>
        </div>
      ) : (
        <CountryAwareHubList hubs={hubs} />
      )}
    </section>
  )
}
