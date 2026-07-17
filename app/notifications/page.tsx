import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NotificationFeed } from "@/components/notifications/notification-feed"

export const metadata: Metadata = {
  title: "Notifications — TogetLink",
  description: "Stay updated with your professional network.",
}

export default function NotificationsPage() {
  return (
    <DashboardShell>
      <NotificationFeed />
    </DashboardShell>
  )
}
