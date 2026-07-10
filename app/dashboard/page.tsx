import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecommendedHubs } from "@/components/dashboard/recommended-hubs"

export const metadata: Metadata = {
  title: "Dashboard — TogetLink",
  description: "Discover professional hubs and connect with builders near you.",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          <RecommendedHubs />
        </div>

        {/* Right sidebar — placeholder for future profile/context cards */}
        <aside className="hidden w-72 shrink-0 lg:block" aria-label="Sidebar">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Your professional profile
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Complete your profile to get better hub recommendations and connect
              with professionals near you.
            </p>
            <a
              href="/profile"
              className="mt-4 block rounded-xl border border-[#e0e0e0] py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              View profile
            </a>
          </div>
        </aside>
      </div>
    </DashboardShell>
  )
}
