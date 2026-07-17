import { Metadata } from "next"
import { DashboardTopNav } from "@/components/dashboard/dashboard-top-nav"
import { ProfileEditor } from "@/components/profile/profile-editor"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "My Profile — togetlink",
  description: "Manage your TogetLink professional profile.",
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    redirect("/login?redirect=/profile")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <DashboardTopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your personal information, professional headline, and bio.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <ProfileEditor />
          </div>
        </div>
      </main>
    </div>
  )
}
