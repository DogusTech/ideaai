import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { Sparkles, BrainCircuit, Cloud } from "lucide-react"

export const metadata: Metadata = {
  title: "IdeaAI Login - TogetLink",
  description: "Access your TogetLink IdeaAI workspace.",
}

const AI_TRUST_POINTS = [
  {
    icon: BrainCircuit,
    title: "Autonomous Idea Generation",
    description: "Brainstorm and validate startup ideas instantly with advanced LLMs.",
  },
  {
    icon: Sparkles,
    title: "24/7 Cloud Developer",
    description: "Deploy an AI engineer that codes, tests, and scales your vision automatically.",
  },
  {
    icon: Cloud,
    title: "Google Cloud Infrastructure",
    description: "Built on top of cutting-edge infrastructure for maximum reliability.",
  },
]

export default function AiLoginPage() {
  return (
    <AuthShell
      title="Welcome to IdeaAI"
      subtitle="Log in to access your autonomous developer dashboard."
      sideTitle="Experience liftoff with the next-gen agent platform."
      sideLogoText="IdeaAI"
      sidePoints={AI_TRUST_POINTS}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/ai-landing-page/register" className="font-semibold text-brand-blue hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm defaultRedirect="/ai" />
    </AuthShell>
  )
}
