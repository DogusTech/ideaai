import { Metadata } from "next"
import { DashboardTopNav } from "@/components/dashboard/dashboard-top-nav"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Settings — togetlink",
  description: "Manage your TogetLink account settings.",
}

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    redirect("/login?redirect=/settings")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <DashboardTopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your account and preferences.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:flex-row">
            <aside className="w-full md:w-64 shrink-0">
              <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
                <a
                  href="/settings"
                  className="bg-brand-blue/10 text-brand-blue rounded-md px-3 py-2 text-sm font-medium"
                >
                  Account
                </a>
                <a
                  href="/settings/notifications"
                  className="text-muted-foreground hover:bg-slate-100 hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
                >
                  Notifications
                </a>
                <a
                  href="/settings/language"
                  className="text-muted-foreground hover:bg-slate-100 hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
                >
                  Language
                </a>
              </nav>
            </aside>

            <div className="flex-1 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
