"use client"
import React, { useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createSession } from "@/lib/api/auth"
import '../BaseLayout.ByH15-Pm.css';
import '../index.BYZqGVMs.css';

export default function AiLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setStatus("submitting")
    setError(null)

    try {
      await Promise.race([
        (async () => {
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const idToken = await userCredential.user.getIdToken()
          await createSession(idToken)
        })(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout: Login process took too long.")), 15000)
        )
      ]);

      setStatus("success")
      
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get("redirect") || "/ai"
        router.push(redirect)
      }, 500)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Invalid credentials. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@8..144,-10..0,25..150,400..500,0..100&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Symbols:opsz,wght,FILL,GRAD,ROND@40..48,300,0..1,0,50&display=swap" rel="stylesheet" />

      <div style={{
        fontFamily: "'Google Sans Flex', 'Google Sans', sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        color: "#121317"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          {/* Logo */}
          <div style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#121317",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "20px",
            marginBottom: "24px"
          }}>
            TL
          </div>

          <h1 style={{
            fontSize: "28px",
            fontWeight: "500",
            letterSpacing: "-0.5px",
            marginBottom: "8px",
            fontVariationSettings: '"wdth" 100, "opsz" 24'
          }}>
            Sign in to IdeaAI
          </h1>
          <p style={{
            color: "#5f6368",
            fontSize: "15px",
            marginBottom: "32px",
            fontVariationSettings: '"wdth" 100, "opsz" 15'
          }}>
            Sign in using your TogetLink account.
          </p>

          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input 
              type="email" 
              name="email"
              placeholder="name@work-email.com"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "8px",
                border: "1px solid #dadce0",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.target.style.borderColor = '#dadce0'}
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "8px",
                border: "1px solid #dadce0",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
              onBlur={(e) => e.target.style.borderColor = '#dadce0'}
            />

            {error && (
              <p style={{ color: "#d93025", fontSize: "13px", textAlign: "left", marginTop: "4px" }}>
                {error}
              </p>
            )}

            <button 
              type="submit" 
              className="call-to-action button button-primary"
              disabled={status !== "idle"}
              style={{ 
                width: "100%", 
                marginTop: "4px",
                height: "48px",
                opacity: status === "submitting" ? 0.7 : 1,
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                borderRadius: "8px"
              }}
            >
              <span>{status === "submitting" ? "Signing in..." : status === "success" ? "Success!" : "Continue with Email"}</span>
            </button>
          </form>

          <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            margin: "24px 0",
            color: "#5f6368",
            fontSize: "12px",
            fontWeight: "500",
            letterSpacing: "0.5px"
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e8eaed" }} />
            <span style={{ padding: "0 12px" }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e8eaed" }} />
          </div>

          <button 
            type="button" 
            className="call-to-action button button-secondary"
            style={{ 
              width: "100%",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "8px"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <p style={{
            marginTop: "32px",
            fontSize: "14px",
            color: "#5f6368"
          }}>
            Don't have an account?{" "}
            <Link href="/ai-landing-page/register" style={{ color: "#1a73e8", textDecoration: "none", fontWeight: "500" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
