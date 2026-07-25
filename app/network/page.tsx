import { Metadata } from "next"
import { DashboardTopNav } from "@/components/dashboard/dashboard-top-nav"
import { NetworkFeed } from "@/components/network/network-feed"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Network Feed — togetlink",
  description: "See who is currently working from hubs near you.",
}

export default async function NetworkPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session && process.env.NODE_ENV !== "development") {
    redirect("/login?redirect=/network")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <DashboardTopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Network Feed</h1>
            <p className="mt-2 text-muted-foreground">
              Discover professionals currently checked in and working across our hubs.
            </p>
          </div>

          <NetworkFeed />
        </div>
      </main>
    </div>
  )
}
