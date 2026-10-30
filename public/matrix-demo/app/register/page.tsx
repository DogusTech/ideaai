"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { auth } from "@/lib/firebase"
import { GithubAuthProvider, GoogleAuthProvider, signInWithCustomToken, signInWithPopup } from "firebase/auth"
import { createSession } from "@/lib/api/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "otp">("form")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function requestCode(event: FormEvent) {
    event.preventDefault()
    setError("")
    if (fullName.trim().length < 2) return setError("Please enter your full name.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email address.")
    if (password.length < 8) return setError("Password must be at least 8 characters.")
    if (password !== confirmPassword) return setError("Passwords do not match.")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ type: "register", fullName: fullName.trim(), email: email.trim().toLowerCase(), password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error === "USER_EXISTS" ? "An account already exists for this email." : data.error || "We could not send the verification code.")
      setStep("otp")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not send the verification code.")
    } finally {
      setLoading(false)
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit verification code.")
    setError("")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ email: email.trim().toLowerCase(), code, fullName: fullName.trim(), password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "The code is invalid or has expired.")
      const credential = await signInWithCustomToken(auth, data.token)
      await createSession(await credential.user.getIdToken())
      router.push("/matrix-demo/app")
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Registration could not be completed.")
    } finally {
      setLoading(false)
    }
  }

  async function socialLogin(providerName: "google" | "github") {
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
              : "Social registration could not be completed."
      )
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[#17365d]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[480px] flex-col justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 p-2"><Image src="/Gemini_Generated_Image_dpurc9dpurc9dpur-removebg-preview.png" alt="IdeaAI" width={32} height={32} className="h-full w-full rounded-md object-contain" priority /></div>
          <h1 className="text-[25px] font-medium tracking-tight">Create your IdeaAI account</h1>
          <p className="mt-2 text-[16px] text-[#61738b]">Already have an account? <Link href="/matrix-demo/app/login" className="text-blue-600 hover:underline">Sign in</Link></p>
        </div>

        <div className="mt-11 flex gap-4">
          <button type="button" onClick={() => void socialLogin("google")} disabled={loading} className={socialButton}><GoogleGlyph /> Continue with Google</button>
          <button type="button" onClick={() => void socialLogin("github")} disabled={loading} className={socialButton}><GithubGlyph /> Continue with GitHub</button>
        </div>
        <div className="my-6 flex items-center gap-4 text-[15px] text-[#61738b]"><span className="h-px flex-1 bg-[#d8dde3]" /><span>Or</span><span className="h-px flex-1 bg-[#d8dde3]" /></div>

        <form onSubmit={step === "form" ? requestCode : verify} className="space-y-4">
          {step === "form" ? <><label className="block text-[16px]"><span className="mb-2 block">Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" className={inputClass} placeholder="Full name" required /></label><label className="block text-[16px]"><span className="mb-2 block">Enter your email</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" required /></label><PasswordInput label="Create a password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} /><PasswordInput label="Confirm your password" value={confirmPassword} onChange={setConfirmPassword} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} /><button type="submit" disabled={loading} className={primaryButton}>{loading && <Loader2 size={17} className="animate-spin" />}Register and send verification code</button></> : <><div className="rounded-[10px] bg-[#f5f6f8] p-4 text-[15px] text-[#61738b]"><Mail className="mr-2 inline-block" size={17} />We sent a 6-digit code to <strong>{email}</strong>.</div><label className="block text-[16px]"><span className="mb-2 block">Verification code</span><input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className={`${inputClass} tracking-[0.35em]`} placeholder="000000" required /></label><button type="submit" disabled={loading} className={primaryButton}>{loading && <Loader2 size={17} className="animate-spin" />}Verify email and continue</button><button type="button" onClick={() => setStep("form")} className="w-full text-sm text-[#61738b]">Change details</button></>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        </form>
        <p className="mt-6 text-center text-[15px] leading-5 text-[#61738b]">By registering, you agree to our <a href="https://ideaai.togetlink.com/legal/terms" className="underline">Terms</a> and <a href="https://ideaai.togetlink.com/legal/privacy-policy" className="underline">Privacy Policy</a>.</p>
      </div>
    </main>
  )
}

const inputClass = "h-[50px] w-full rounded-[10px] border border-[#cbd5e1] bg-white px-4 text-[16px] text-[#17365d] shadow-sm outline-none focus:border-[#17365d] focus:ring-2 focus:ring-[#17365d]/10"
const socialButton = "flex h-[46px] flex-1 items-center justify-center gap-3 rounded-[10px] bg-[#f5f6f8] px-3 text-[16px] text-[#61738b] transition hover:bg-[#eceef1] disabled:opacity-60"
const primaryButton = "flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#111111] text-[16px] font-semibold text-white transition hover:bg-black disabled:opacity-60"

function PasswordInput({ label, value, onChange, visible, onToggle }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void }) {
  return <label className="block text-[16px]"><span className="mb-2 block">{label}</span><span className="relative block"><input value={value} onChange={(event) => onChange(event.target.value)} type={visible ? "text" : "password"} autoComplete="new-password" className={`${inputClass} pr-12`} placeholder="••••••••" required /><button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#61738b]">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
}

function GoogleGlyph() { return <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v4h6c-.3 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.3-4.5 3.3-7.7Z"/><path fill="#34A853" d="M12 23c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.4 10.4 0 0 0 12 23Z"/><path fill="#FBBC05" d="M6.2 14.6a6.4 6.4 0 0 1 0-4.1V7.8H2.7a10.7 10.7 0 0 0 0 9.5l3.5-2.7Z"/><path fill="#EA4335" d="M12 6.2c1.5 0 2.9.5 4 1.6l3-3A10.4 10.4 0 0 0 2.7 7.8l3.5 2.7c.8-2.5 3.1-4.3 5.8-4.3Z"/></svg> }
function GithubGlyph() { return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black"><path d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.3.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-2.9 0 0 1-.3 3.1 1.1a10.7 10.7 0 0 1 5.6 0c2.1-1.4 3.1-1.1 3.1-1.1.6 1.5.2 2.6.1 2.9.8.8 1.2 1.8 1.2 3 0 4.3-2.6 5.3-5.1 5.6.4.4.7 1.1.7 2.2v3.2c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z"/></svg> }

function errorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error ? String(error.code) : ""
}
