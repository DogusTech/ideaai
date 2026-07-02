import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login — togetlink",
  description: "Access your TogetLink professional workspace.",
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Access your TogetLink professional workspace."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-blue hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
