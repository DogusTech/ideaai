"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { createSession } from "@/lib/api/auth"
import { Loader2 } from "lucide-react"

export function SocialButtons() {
  const router = useRouter()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const idToken = await userCredential.user.getIdToken()
      await createSession(idToken)
      
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get("redirect") || "/dashboard"
      router.push(redirect)
    } catch (error) {
      console.error("Google sign in failed:", error)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-input bg-background text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/15 disabled:opacity-70"
      >
        {isGoogleLoading ? <Loader2 className="size-5 animate-spin" /> : <GoogleGlyph />}
        Continue with Google
      </button>

      <button
        type="button"
        disabled
        aria-disabled="true"
        className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-input bg-muted/40 text-sm font-semibold text-muted-foreground"
      >
        <LinkedInGlyph />
        Continue with LinkedIn
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Coming soon
        </span>
      </button>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.12 2.73-2.39 3.58v2.98h3.86c2.26-2.08 3.58-5.15 3.58-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.86-2.98c-1.08.72-2.45 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.96H1.28v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.26 14.3a7.2 7.2 0 0 1 0-4.6V6.61H1.28a12 12 0 0 0 0 10.78l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.61l3.98 3.09C6.21 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

function LinkedInGlyph() {
  return (
    <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
