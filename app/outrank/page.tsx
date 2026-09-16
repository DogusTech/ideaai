"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Link as LinkIcon, Zap, Check, Copy, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Link from 'next/link'

export default function OutrankPage() {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [completion, setCompletion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setIsLoading(true)
    setCompletion('')
    setElapsed(0)
    
    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    
    try {
      const response = await fetch('/api/outrank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(`API Request Failed: ${response.status} ${errorText}`)
      }
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        let done = false
        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) {
            const chunk = decoder.decode(value, { stream: true })
            setCompletion((prev) => prev + chunk)
          }
        }
      }
    } catch (error: any) {
      console.error('Error generating content:', error)
      setCompletion(`Bir hata oluştu: ${error?.message || 'Sunucu zaman aşımına uğradı'}. Lütfen tekrar deneyin.`)
    } finally {
      setIsLoading(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(completion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="w-full flex items-center justify-between py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/outrank" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-gray-900">Outrank<span className="text-blue-600">AI</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-2">
                Products
                <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col">
                <Link href="/outrank" className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Sparkles className="w-5 h-5" /></div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">SEO Generator</div>
                    <div className="text-xs text-gray-500 mt-0.5">Outrank competitors instantly</div>
                  </div>
                </Link>
                <Link href="/outrank/features" className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-gray-100 text-gray-600 p-2 rounded-lg"><Zap className="w-5 h-5" /></div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Bulk Outrank</div>
                    <div className="text-xs text-gray-500 mt-0.5">Process up to 100 URLs at once</div>
                  </div>
                </Link>
                <Link href="/outrank/api-docs" className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-gray-100 text-gray-600 p-2 rounded-lg"><LinkIcon className="w-5 h-5" /></div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Developer API</div>
                    <div className="text-xs text-gray-500 mt-0.5">Integrate into your CMS</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-2">
                Use Cases
                <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col">
                <Link href="/outrank/use-cases" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">For SEO Agencies</Link>
                <Link href="/outrank/use-cases" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">For E-commerce</Link>
                <Link href="/outrank/use-cases" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">For Niche Bloggers</Link>
              </div>
            </div>

            <Link href="/outrank/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
          <Link href="/register" className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden w-full">
        {/* Background Subtle Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[200px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center mt-8 mb-20">

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-left md:text-center mb-12 w-full"
          >
            <div className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-4">Output Stream // 01</div>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-gray-900 leading-tight">
              Steal their traffic. <br className="hidden md:block" />
              Outrank their content.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl md:mx-auto font-normal">
              Stop starting from a blank page. Paste a competitor's URL below. Our engine analyzes their structure and generates an executable, SEO-optimized masterpiece.
            </p>
          </motion.div>

          {/* Input Field - Corporate UI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full relative"
          >
            <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row items-center w-full bg-white border border-gray-200 rounded-2xl p-2 shadow-sm transition-shadow hover:shadow-md">
              <div className="hidden md:flex pl-4 pr-2 text-gray-400">
                <LinkIcon className="w-5 h-5" />
              </div>
              
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://competitor.com/their-best-article"
                className="w-full md:flex-1 min-w-0 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-lg px-4 py-4 md:py-2 font-medium"
                required
              />
              
              <button
                type="submit"
                disabled={isLoading || !url}
                className="w-full md:w-auto mt-2 md:mt-0 flex items-center justify-center gap-2 bg-[#111111] text-white px-8 py-3.5 md:py-3 rounded-xl font-medium hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed group/btn"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse text-blue-400" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Outrank
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
            
            {/* Timer Display */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-8 left-0 w-full flex justify-center"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Est. completion: ~25s</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-900">{elapsed}s elapsed</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Feature Highlights (Hide when generating) */}
          {!completion && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 text-left"
            >
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Zero-State Architecture</h3>
                <p className="text-gray-500 leading-relaxed">
                  Stop starting from a blank prompt. OutrankAI anticipates context, understands competitor structures instantly, and offers production-ready content.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Agentic SEO Velocity</h3>
                <p className="text-gray-500 leading-relaxed">
                  OutrankAI doesn't just suggest keywords. It reads competitor headers, extracts entities, and iterates autonomously until your article is perfectly optimized.
                </p>
              </div>
            </motion.div>
          )}

          {/* Results Container */}
          <AnimatePresence>
            {(completion || isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-16 bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm relative"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
                  <div className="flex items-center gap-2 text-blue-600 font-medium tracking-tight">
                    <Sparkles className="w-5 h-5" />
                    Generated SEO Content
                  </div>
                  {completion && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied to Clipboard' : 'Copy Text'}
                    </button>
                  )}
                </div>
                
                <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed prose-headings:font-medium prose-headings:text-gray-900 prose-a:text-blue-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {completion}
                  </ReactMarkdown>
                  
                  {isLoading && (
                    <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse align-middle" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-semibold tracking-tight text-gray-900">Outrank<span className="text-blue-600">AI</span></span>
            <p className="mt-4 text-sm text-gray-500">
              The intelligent engine for generative SEO and content supremacy.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/outrank/features" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="/outrank/pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="/outrank/use-cases" className="hover:text-blue-600 transition-colors">Use Cases</a></li>
              <li><a href="/outrank/api-docs" className="hover:text-blue-600 transition-colors">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/outrank/about" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="/outrank/careers" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="/outrank/contact" className="hover:text-blue-600 transition-colors">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/outrank/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/outrank/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="/outrank/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2026 Aeternexus, Inc. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
