"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check, KeyRound } from 'lucide-react'
import Link from 'next/link'

export default function RedeemPage() {
  const [code, setCode] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-gray-900">
          Outrank<span className="text-blue-600">AI</span>
        </Link>
        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Sign In
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[250px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl relative z-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
              <KeyRound className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl font-medium tracking-tight text-gray-900 mb-2">Redeem Lifetime Deal</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Enter your AppSumo voucher code below to activate your lifetime access.
          </p>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-1">Code Activated Successfully!</h3>
              <p className="text-sm text-emerald-700 mb-6">
                Your account now has lifetime access to OutrankAI.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center w-full bg-[#111111] text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRedeem} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  AppSumo Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OUTRANK-A1B2-C3D4"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 font-mono text-center tracking-widest text-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !code}
                className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                    Validating code...
                  </span>
                ) : (
                  'Activate Lifetime Access'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
            Need help? Contact our founder support at{' '}
            <a href="mailto:support@togetlink.com" className="text-blue-600 underline">
              support@togetlink.com
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
        © 2026 Aeternexus, Inc. All rights reserved.
      </footer>
    </div>
  )
}
