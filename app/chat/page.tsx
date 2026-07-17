import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata: Metadata = {
  title: "Messages — TogetLink",
  description: "Chat with professionals in your network.",
}

export default function ChatPage() {
  return (
    <DashboardShell>
      <ChatInterface />
    </DashboardShell>
  )
}
