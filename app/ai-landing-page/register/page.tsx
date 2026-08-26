"use client";

import { FormEvent, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { signInWithCustomToken, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { createSession } from "@/lib/api/auth"

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "submitting" | "code_sent" | "verifying" | "success">("idle")
  
  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email.")
      return
    }

    setStatus("submitting")
    setError(null)

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: 'register' })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.error === 'USER_EXISTS') {
          throw new Error("Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.");
        }
        throw new Error(data.error || "Failed to send code.");
      }

      setStatus("code_sent")
    } catch (err: any) {
      console.error("Email auth error:", err)
      setError(err.message || "Something went wrong.")
      setStatus("idle")
    }
  }

  async function verifyCode(fullCode: string) {
    if (fullCode.length !== 6) return;
    
    setStatus("verifying")
    setError(null)

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code.");
      }

      // We got the custom token from our backend!
      const userCredential = await signInWithCustomToken(auth, data.token);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);

      setStatus("success")
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get("redirect") || "/ai"
        router.push(redirect)
      }, 500)
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.message || "Invalid code. Please try again.")
      setStatus("code_sent")
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === 6) {
      verifyCode(fullCode);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (!/^[0-9]{1,6}$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input, or the last one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === 6) {
      verifyCode(pastedData);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    setError(null)
    setStatus("submitting")
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      
      setStatus("success")
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get("redirect") || "/ai"
        router.push(redirect)
      }, 500)
    } catch (err: any) {
      console.error("Social login error:", err)
      setError(err.message || "Authentication failed.")
      setStatus("idle")
    }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        color: "#000000"
      }}>
        {/* Top left Logo (Optional, mimicking v0) */}
        <div style={{ padding: "24px", position: "absolute", top: 0, left: 0 }}>
          <div style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-1px" }}>TL</div>
        </div>

        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px"
        }}>
          <div style={{
            width: "100%",
            maxWidth: "360px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            {/* Center Logo */}
            <div style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#000000",
              color: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "24px"
            }}>
              TL
            </div>

            <h1 style={{
              fontSize: "24px",
              fontWeight: "600",
              letterSpacing: "-0.5px",
              marginBottom: "12px",
            }}>
              Sign up for TogetLink
            </h1>
            
            {status !== "code_sent" && status !== "verifying" ? (
              <>
                <p style={{
                  color: "#666666",
                  fontSize: "14px",
                  marginBottom: "24px",
                }}>
                  We suggest using the email address you use at work or school
                </p>

                <form onSubmit={handleEmailSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input 
                    type="email" 
                    placeholder="name@work-email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#000';
                      e.target.style.boxShadow = '0 0 0 1px #000';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {error && <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "left" }}>{error}</p>}

                  <button 
                    type="submit" 
                    disabled={status !== "idle"}
                    style={{ 
                      width: "100%", 
                      height: "44px",
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none",
                      borderRadius: "6px",
                      cursor: status === "idle" ? "pointer" : "not-allowed",
                      opacity: status === "idle" ? 1 : 0.7
                    }}
                  >
                    {status === "submitting" ? "Sending Code..." : status === "success" ? "Success!" : "Continue with Email"}
                  </button>
                </form>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
                  <button 
                    onClick={() => handleSocialLogin('github')}
                    type="button" 
                    style={{ 
                      width: "100%",
                      height: "44px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      color: "#000000",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    Continue with GitHub
                  </button>

                  <button 
                    onClick={() => handleSocialLogin('google')}
                    type="button" 
                    style={{ 
                      width: "100%",
                      height: "44px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      color: "#000000",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <div style={{ marginTop: "32px" }}>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Already have an account? <Link href="/ai-landing-page/login" style={{ color: "#0066cc", textDecoration: "none" }}>Sign In</Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <p style={{
                  color: "#666666",
                  fontSize: "14px",
                  marginBottom: "32px",
                }}>
                  If you're new to TogetLink, we sent a code to<br />
                  <strong>{email}</strong>.
                </p>

                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      style={{
                        width: "44px",
                        height: "56px",
                        fontSize: "24px",
                        textAlign: "center",
                        borderRadius: "8px",
                        border: "1px solid #000000",
                        outline: "none",
                        color: "#000",
                        backgroundColor: "#fff"
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 1px #000';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ))}
                </div>

                {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}
                
                {status === "verifying" && <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>Verifying...</p>}

                <button 
                  onClick={() => {
                    setStatus("idle");
                    setOtp(["", "", "", "", "", ""]);
                    setError(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#666",
                    fontSize: "14px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginBottom: "32px"
                  }}
                >
                  Use a Different Email
                </button>

                <div>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Already have an account? <Link href="/ai-landing-page/login" style={{ color: "#0066cc", textDecoration: "none" }}>Sign In</Link>
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Footer Legal Terms */}
        <div style={{
          textAlign: "center",
          padding: "24px",
          color: "#666666",
          fontSize: "12px"
        }}>
          By proceeding, you agree to creating a TogetLink account subject to our <Link href="/legal/terms" style={{ color: "#000", textDecoration: "none" }}>Terms of Service</Link> and <Link href="/legal/privacy-policy" style={{ color: "#000", textDecoration: "none" }}>Privacy Policy</Link>.
        </div>
      </div>
    </>
  )
}
