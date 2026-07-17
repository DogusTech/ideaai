"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2 } from "lucide-react"
import { TextField } from "@/components/ui/field"
import { SocialButtons } from "./social-buttons"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { createSession } from "@/lib/api/auth"

type Errors = { email?: string; password?: string; submit?: string }
type Status = "idle" | "submitting" | "success"

export function LoginForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")

    const nextErrors: Errors = {}
    if (!email) nextErrors.email = "Please enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address."
    if (!password) nextErrors.password = "Please enter your password."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("submitting")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      
      await createSession(idToken)
      
      setStatus("success")
      
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get("redirect") || "/dashboard"
        router.push(redirect)
      }, 1000)
    } catch (err: any) {
      console.error(err)
      // Check if it's a Firebase auth error
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrors({ submit: "Invalid email or password." })
      } else {
        // If it's a backend/network error, show the real message
        setErrors({ submit: err.message || "An unexpected error occurred. Please try again." })
      }
      setStatus("idle")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-green/30 bg-brand-green/10 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-brand-green" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          You're signed in!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Redirecting you to your workspace...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SocialButtons />

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          or continue with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.submit && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errors.submit}
          </div>
        )}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="remember"
              className="size-4 rounded border-input text-brand-blue accent-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            />
            Remember me
          </label>
          <Link
            href="/login"
            className="text-sm font-medium text-brand-blue hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-blue text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 disabled:opacity-70"
        >
          {status === "submitting" && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          Continue
        </button>
      </form>
    </div>
  )
}
