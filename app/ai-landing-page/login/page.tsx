import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "IdeaAI Login - TogetLink",
  description: "Access your TogetLink IdeaAI workspace.",
}

export default function AiLoginPage() {
  return (
    <AuthShell
      title="Welcome to IdeaAI"
      subtitle="Log in to access your autonomous developer dashboard."
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
