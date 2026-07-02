import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register — togetlink",
  description: "Create your TogetLink professional account.",
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join TogetLink and start building trusted professional connections."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-blue hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  )
}
