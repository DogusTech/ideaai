"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { Mail, ArrowRight } from "lucide-react"
import { createSession } from "@/lib/api/auth"

export default function IdeaAIRegister() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // 2.5 seconds splash screen
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()
      await createSession(idToken)
      router.push("/mac-test") // Or wherever the dashboard is
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true)
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()
      await createSession(idToken)
      
      // Save github token for the mac-test repo fetcher if needed
      const credential = GithubAuthProvider.credentialFromResult(result)
      if (credential?.accessToken) {
        localStorage.setItem("github_token", credential.accessToken)
      }
      
      router.push("/mac-test")
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="relative w-32 h-32 flex items-center justify-center animate-pulse">
          {/* Glowing effect behind the logo */}
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }} />
          
          <Image 
            src="/ideaai-logo.png" 
            alt="IdeaAI Logo" 
            width={120} 
            height={120} 
            className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out"
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans text-black">
      {/* Language Selector (Bottom Left) */}
      <div className="absolute bottom-6 left-6">
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <span>🇹🇷</span>
          <span>Türkçe</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[440px] mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* Top Logo */}
        <div className="w-10 h-10 mb-6 bg-[#f4f4f5] rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-gray-100">
          <Image src="/ideaai-logo.png" alt="Logo" width={28} height={28} className="w-full h-full object-contain" />
        </div>

        {/* Headings */}
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900 mb-2">IdeaAI'a giriş yapın</h1>
        <p className="text-[14px] text-gray-500 mb-8">
          Hesabınız yok mu? <Link href="/register" className="text-blue-600 font-medium hover:underline">Kaydol</Link>
        </p>

        {/* Social Buttons */}
        <div className="flex w-full gap-3 mb-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google ile giriş yapın
          </button>
          
          <button 
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
            GitHub ile giriş yapın
          </button>
        </div>

        {/* Divider */}
        <div className="relative w-full flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-white px-3 text-[12px] text-gray-500">
            Ya da
          </div>
        </div>

        {/* Email Form */}
        <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[13px] font-medium text-gray-700">
              E-postanızı girin
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-[14px] transition-all"
              placeholder="d"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-[14px] font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            Şifre ile devam et
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg text-[14px] font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Mail className="w-4 h-4 text-gray-500" />
            OTP ile giriş yap
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-[12px] text-gray-500 leading-relaxed max-w-[320px] mx-auto">
            Giriş yaparak şunları kabul etmiş olursunuz: <Link href="#" className="underline hover:text-gray-900">Şartlar ve Koşullar</Link> ve <Link href="#" className="underline hover:text-gray-900">Gizlilik Politikası</Link>
          </p>
          
          <p className="text-[12px] text-gray-500">
            Yardıma mı ihtiyacınız var? <Link href="#" className="text-blue-600 hover:underline">Destekle iletişime geçin</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
