"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      // On success, redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 relative font-sans">
      {/* Background Subtle Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl relative z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-medium tracking-tight text-gray-900 mb-2">Create an Account</h1>
        <p className="text-gray-500 mb-10">Sign up for OutrankAI to outsmart your competitors.</p>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed mb-6"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.69 17.6V20.34H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.6C14.71 18.26 13.46 18.66 12 18.66C9.17 18.66 6.77 16.75 5.91 14.17H2.22V17.03C4.02 20.61 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.91 14.17C5.69 13.51 5.56 12.77 5.56 12C5.56 11.23 5.69 10.49 5.91 9.83V6.97H2.22C1.48 8.44 1.05 10.15 1.05 12C1.05 13.85 1.48 15.56 2.22 17.03L5.91 14.17Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.34 3.84C17.45 2.09 14.97 1 12 1C7.7 1 4.02 3.39 2.22 6.97L5.91 9.83C6.77 7.25 9.17 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </>
          )}
        </button>

        <p className="text-xs text-gray-400">
          By signing up, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  )
}
