"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2 } from "lucide-react"
import { TextField } from "@/components/ui/field"
import { SocialButtons } from "./social-buttons"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { createSession } from "@/lib/api/auth"
import { fetchApi } from "@/lib/api/client"

type Errors = {
  name?: string
  headline?: string
  email?: string
  password?: string
  confirm?: string
  terms?: string
  submit?: string
}
type Status = "idle" | "submitting" | "success"

export function RegisterForm({ defaultRedirect = "/dashboard" }: { defaultRedirect?: string }) {
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const headline = String(form.get("headline") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")
    const confirm = String(form.get("confirm") ?? "")
    const terms = form.get("terms") === "on"

    const nextErrors: Errors = {}
    if (!name) nextErrors.name = "Please enter your full name."
    if (!headline) nextErrors.headline = "Please enter your professional headline."
    if (!email) nextErrors.email = "Please enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address."
    if (!password) nextErrors.password = "Please create a password."
    else if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters."
    if (confirm !== password) nextErrors.confirm = "Passwords do not match."
    if (!terms) nextErrors.terms = "Please accept the terms to continue."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("submitting")

    try {
      // Create a global timeout for the entire registration flow
      await Promise.race([
        (async () => {
          // 1. Create User in Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const user = userCredential.user

          // 2. Update Firebase Profile
          await updateProfile(user, { displayName: name })

          // 3. Create Server Session Cookie
          const idToken = await user.getIdToken()
          await createSession(idToken)

          // 4. Create User Profile Document in Backend
          await fetchApi("/users/me", {
            method: "PUT",
            body: JSON.stringify({
              name,
              headline,
            }),
          })
        })(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout: Registration process took too long. Please check your internet connection and API keys.")), 15000)
        )
      ]);

      setStatus("success")
      
      // Redirect to dashboard (or returnUrl if available)
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get("redirect") || defaultRedirect
        router.push(redirect)
      }, 1000)
    } catch (err: any) {
      console.error(err)
      setErrors({ submit: err.message || "An error occurred during registration." })
      setStatus("idle")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-green/30 bg-brand-green/10 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-brand-green" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Account created successfully!
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
          or sign up with email
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
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          error={errors.name}
        />
        <TextField
          label="Professional Headline"
          name="headline"
          type="text"
          placeholder="e.g. Senior Frontend Developer at TechCorp"
          error={errors.headline}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password}
        />
        <TextField
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirm}
        />

        <div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="terms"
              className="mt-0.5 size-4 rounded border-input text-brand-blue accent-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms-of-service" className="font-medium text-brand-blue hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-medium text-brand-blue hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-sm text-destructive" role="alert">
              {errors.terms}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-blue text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 disabled:opacity-70"
        >
          {status === "submitting" && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          Create account
        </button>
      </form>
    </div>
  )
}
