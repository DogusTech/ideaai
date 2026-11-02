"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { auth } from "@/lib/firebase"
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { createSession } from "@/lib/api/auth"

type Method = "choose" | "password" | "otp"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [method, setMethod] = useState<Method>("choose")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function continueWith(methodName: Exclude<Method, "choose">) {
    setError("")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    setMethod(methodName)
    if (methodName !== "otp") return
    setLoading(true)
    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "login", email: email.trim() }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error === "USER_NOT_FOUND" ? "No account was found for this email." : data.error || "We could not send the verification code.")
      }
    } catch {
      setError("We could not reach the verification service.")
    } finally {
      setLoading(false)
    }
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
      await createSession(await credential.user.getIdToken())
      router.push("/matrix-demo/app")
    } catch (loginError) {
      const codeValue = loginError && typeof loginError === "object" && "code" in loginError ? String(loginError.code) : ""
      setError(
        codeValue.includes("auth/unauthorized-domain") || codeValue.includes("auth/requests-from-referer")
          ? "Firebase blocked this local origin. Add 127.0.0.1 and localhost to Firebase Authentication → Settings → Authorized domains."
          : codeValue.includes("invalid-credential") || codeValue.includes("user-not-found") || codeValue.includes("wrong-password")
            ? "Invalid email or password."
            : "We could not sign you in."
      )
    } finally {
      setLoading(false)
    }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault()
    setError("")
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit verification code.")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "The code is invalid or has expired.")
      const userCredential = await import("firebase/auth").then(({ signInWithCustomToken }) => signInWithCustomToken(auth, data.token))
      await createSession(await userCredential.user.getIdToken())
      router.push("/matrix-demo/app")
    } catch (otpError) {
      setError(otpError instanceof Error ? otpError.message : "We could not verify the code.")
    } finally {
      setLoading(false)
    }
  }

  async function socialLogin(providerName: "google" | "github") {
    setError("")
    setLoading(true)
    try {
      const provider = providerName === "google" ? new GoogleAuthProvider() : new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await createSession(await result.user.getIdToken())
      router.push("/matrix-demo/app")
    } catch (socialError) {
      const codeValue = errorCode(socialError)
      setError(
        codeValue.includes("auth/unauthorized-domain") || codeValue.includes("auth/requests-from-referer")
          ? "Firebase blocked this local origin. Add 127.0.0.1 and localhost to Firebase Authentication → Settings → Authorized domains."
          : codeValue.includes("auth/popup-closed-by-user")
            ? "The sign-in window was closed before authentication finished."
            : codeValue.includes("auth/account-exists-with-different-credential")
              ? "An account already exists with a different sign-in method."
              : "Social sign-in could not be completed."
      )
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[#17365d]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[480px] flex-col justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 p-2">
            <Image src="/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg" alt="IdeaAI" width={32} height={32} className="h-full w-full rounded-md object-contain" priority />
          </div>
          <h1 className="text-[25px] font-medium tracking-tight">Sign in to IdeaAI</h1>
          <p className="mt-2 text-[16px] text-[#61738b]">Don&apos;t have an account? <Link href="/matrix-demo/app/register" className="text-blue-600 hover:underline">Register</Link></p>
        </div>

        <div className="mt-11 flex gap-4">
          <button type="button" onClick={() => socialLogin("google")} disabled={loading} className={socialButton}>
            <GoogleGlyph /> Continue with Google
          </button>
          <button type="button" onClick={() => socialLogin("github")} disabled={loading} className={socialButton}>
            <GithubGlyph /> Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center gap-4 text-[15px] text-[#61738b]"><span className="h-px flex-1 bg-[#d8dde3]" /><span>Or</span><span className="h-px flex-1 bg-[#d8dde3]" /></div>

        <form onSubmit={method === "password" ? submitPassword : method === "otp" ? submitOtp : (event) => { event.preventDefault(); void continueWith("password") }} className="space-y-4">
          <label className="block text-[16px]"><span className="mb-2 block">Enter your email</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} required /></label>
          {method === "password" && <PasswordInput value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} />}
          {method === "otp" && <label className="block text-[16px]"><span className="mb-2 block">6-digit verification code</span><input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" className={`${inputClass} tracking-[0.35em]`} required /></label>}
          {method === "choose" ? <><button type="button" onClick={() => void continueWith("password")} disabled={loading} className={primaryButton}>{loading && <Loader2 size={17} className="animate-spin" />}Continue with password</button><button type="button" onClick={() => void continueWith("otp")} disabled={loading} className={secondaryButton}><Mail size={18} />Sign in with OTP</button></> : <><button type="submit" disabled={loading} className={primaryButton}>{loading && <Loader2 size={17} className="animate-spin" />}{method === "password" ? "Sign in" : "Verify code"}</button><button type="button" onClick={() => { setMethod("choose"); setError("") }} className="w-full text-sm text-[#61738b] hover:text-[#17365d]">Choose another method</button></>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-6 text-center text-[15px] leading-5 text-[#61738b]">By signing in, you agree to our <a href="https://ideaai.togetlink.com/legal/terms" className="underline">Terms</a> and <a href="https://ideaai.togetlink.com/legal/privacy-policy" className="underline">Privacy Policy</a></p>
        <p className="mt-10 text-center text-[15px] text-[#61738b]">Need help? <Link href="/support" className="text-blue-600 hover:underline">Visit Support</Link></p>
      </div>
    </main>
  )
}

const inputClass = "h-[50px] w-full rounded-[10px] border border-[#cbd5e1] bg-white px-4 text-[16px] text-[#17365d] shadow-sm outline-none focus:border-[#17365d] focus:ring-2 focus:ring-[#17365d]/10"
const socialButton = "flex h-[46px] flex-1 items-center justify-center gap-3 rounded-[10px] bg-[#f5f6f8] px-3 text-[16px] text-[#61738b] transition hover:bg-[#eceef1] disabled:opacity-60"
const primaryButton = "flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#111111] text-[16px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
const secondaryButton = "flex h-[46px] w-full items-center justify-center gap-3 rounded-[10px] bg-[#f5f6f8] text-[16px] text-[#17365d] transition hover:bg-[#eceef1] disabled:opacity-60"

function PasswordInput({ value, onChange, visible, onToggle }: { value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void }) {
  return <label className="block text-[16px]"><span className="mb-2 block">Enter your password</span><span className="relative block"><input value={value} onChange={(event) => onChange(event.target.value)} type={visible ? "text" : "password"} autoComplete="current-password" className={`${inputClass} pr-12`} placeholder="••••••••" required /><button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#61738b]">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
}

function errorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error ? String(error.code) : ""
}

function GoogleGlyph() { return <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v4h6c-.3 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.3-4.5 3.3-7.7Z"/><path fill="#34A853" d="M12 23c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.4 10.4 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6.2 14.6a6.4 6.4 0 0 1 0-4.1V7.8H2.7a10.7 10.7 0 0 0 0 9.5l3.5-2.7Z"/><path fill="#EA4335" d="M12 6.2c1.5 0 2.9.5 4 1.6l3-3A10.4 10.4 0 0 0 2.7 7.8l3.5 2.7c.8-2.5 3.1-4.3 5.8-4.3Z"/></svg> }
function GithubGlyph() { return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black"><path d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.3.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-2.9 0 0 1-.3 3.1 1.1a10.7 10.7 0 0 1 5.6 0c2.1-1.4 3.1-1.1 3.1-1.1.6 1.5.2 2.6.1 2.9.8.8 1.2 1.8 1.2 3 0 4.3-2.6 5.3-5.1 5.6.4.4.7 1.1.7 2.2v3.2c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z"/></svg> }
