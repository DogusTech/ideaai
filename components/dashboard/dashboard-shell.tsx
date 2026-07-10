import { DashboardTopNav } from "@/components/dashboard/dashboard-top-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="tl-dashboard-shell min-h-screen">
      <DashboardTopNav />
      <main
        className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8"
        id="main-content"
      >
        {children}
      </main>
    </div>
  )
}
