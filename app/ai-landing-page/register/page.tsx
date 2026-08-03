import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Join IdeaAI - TogetLink",
  description: "Create an account to access the IdeaAI developer engine.",
}

export default function AiRegisterPage() {
  return (
    <AuthShell
      title="Join TogetLink IdeaAI"
      subtitle="Sign up to deploy your first autonomous AI developer in the cloud."
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
