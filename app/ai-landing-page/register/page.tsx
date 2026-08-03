import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"
import { Sparkles, BrainCircuit, Cloud } from "lucide-react"

export const metadata: Metadata = {
  title: "Join IdeaAI - TogetLink",
  description: "Create an account to access the IdeaAI developer engine.",
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

export default function AiRegisterPage() {
  return (
    <AuthShell
      title="Join TogetLink IdeaAI"
      subtitle="Sign up to deploy your first autonomous AI developer in the cloud."
      sideTitle="Experience liftoff with the next-gen agent platform."
      sideLogoText="IdeaAI"
      sidePoints={AI_TRUST_POINTS}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/ai-landing-page/login" className="font-semibold text-brand-blue hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm defaultRedirect="/ai" />
    </AuthShell>
  )
}
