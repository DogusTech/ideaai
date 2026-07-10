import { CountryAwareHubList } from "@/components/dashboard/country-aware-hub-list"
import { getDashboardHubs } from "@/lib/api/dashboard"

export async function RecommendedHubs() {
  let hubs = []
  let error = false

  try {
    hubs = await getDashboardHubs()
  } catch (err) {
    console.error("Failed to fetch dashboard hubs:", err)
    error = true
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
