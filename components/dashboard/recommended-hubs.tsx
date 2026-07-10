import { MOCK_HUBS } from "@/lib/places/mock-hubs"
import { CountryAwareHubList } from "@/components/dashboard/country-aware-hub-list"

/**
 * Server component — loads hub data and passes it to the client list.
 *
 * When a real API endpoint exists (/api/dashboard/hubs or /api/hubs?recommended=true),
 * replace the MOCK_HUBS import with a fetch() call here and pass the result down.
 */
export async function RecommendedHubs() {
  // TODO: replace with real API fetch when endpoint is available
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/hubs`, { next: { revalidate: 60 } })
  // const data = await res.json()
  // const hubs = data.hubs
  const hubs = MOCK_HUBS

  return (
    <section>
      <h2 className="mb-5 text-lg font-semibold text-foreground text-balance">
        Discover hubs
      </h2>
      <CountryAwareHubList hubs={hubs} />
    </section>
  )
}
