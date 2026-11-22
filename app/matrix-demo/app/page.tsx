import { IdeaAIInterfaceMac } from "@/components/ai/idea-ai-interface-mac"
import { AuthProvider } from "@/lib/auth/context"

export const metadata = {
  title: "IdeaAI Workspace",
  description: "The IdeaAI autonomous desktop engineering workspace.",
}

export default function MatrixDemoAppPage() {
  return <AuthProvider anonymousForDesktop><IdeaAIInterfaceMac /></AuthProvider>
}
