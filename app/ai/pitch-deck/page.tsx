"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Terminal, 
  Layers, 
  Cpu, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users,
  Code,
  Zap,
  Globe,
  Mail,
  Linkedin,
  ChevronDown
} from "lucide-react"

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export default function PitchDeck() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-[#171717] selection:text-white">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-[#e5e5e5] z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2 font-semibold text-[16px] tracking-tight">
          <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center text-white">
            <span className="text-[12px] leading-none">T</span>
          </div>
          TogetLink
        </div>
        <div className="text-[13px] font-medium text-[#737373] hidden sm:block">
          Investor Pitch Deck — Q3 2026
        </div>
        <a href="mailto:investors@togetlink.com" className="px-4 py-2 bg-[#171717] text-white text-[13px] font-medium rounded-full hover:bg-[#262626] transition-colors">
          Contact Founder
        </a>
      </nav>

      <main className="pt-16 pb-32">
        
        {/* SLIDE 1: Cover */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/5 to-purple-500/5 blur-3xl rounded-full" />
          </motion.div>
          
          <div className="z-10 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e5e5e5] text-[12px] font-medium text-[#525252] mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Actively Raising Pre-Seed
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-[#171717] mb-6 leading-[1.1]"
            >
              The Zero-State <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#171717] to-[#737373]">Agentic Workspace.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[18px] md:text-[22px] text-[#525252] font-medium mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Replacing complex SaaS dashboards with an intent-driven conversational interface for elite developers.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col items-center gap-2 text-[#a3a3a3] mt-20"
            >
              <span className="text-[12px] font-medium uppercase tracking-widest">Scroll to explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </motion.div>
          </div>
        </section>

        {/* SLIDE 2: The Problem */}
        <section className="py-24 px-6 border-t border-[#e5e5e5] bg-white">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="text-[13px] font-bold text-red-500 tracking-wider uppercase mb-3">The Problem</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">SaaS Bloat is killing <br /> Developer Experience (DX).</h2>
            </FadeIn>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FadeIn delay={0.1}>
                <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] h-full transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-semibold mb-3">Fragmented Workflows</h3>
                  <p className="text-[15px] text-[#737373] leading-relaxed">Developers are forced to constantly context-switch between 10+ different dashboards, issue trackers, and research tools daily.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] h-full transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-semibold mb-3">Cognitive Overload</h3>
                  <p className="text-[15px] text-[#737373] leading-relaxed">Static, legacy UI paradigms force users to learn complex menus instead of the software adapting to the user's intent.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] h-full transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-semibold mb-3">Dumb Autocomplete</h3>
                  <p className="text-[15px] text-[#737373] leading-relaxed">Current AI tools (like standard Copilots) are merely autocomplete engines. They lack deep contextual orchestration for complex tasks.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SLIDE 3: The Solution */}
        <section className="py-24 px-6 bg-[#171717] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <FadeIn>
              <div className="text-[13px] font-bold text-blue-400 tracking-wider uppercase mb-3">The Solution</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">The "Zero-State" UI.</h2>
              <p className="text-[18px] text-[#a3a3a3] max-w-2xl mb-16 leading-relaxed">
                We've built a hyper-minimalist platform where the interface dynamically generates itself—ephemeral Bento Grids, inline tools, and agent workflows appear only when needed, and vanish when the task is done.
              </p>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn delay={0.2}>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <Terminal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-semibold mb-2">Intent-Driven Interface</h4>
                      <p className="text-[14px] text-[#a3a3a3] leading-relaxed">No static menus. Type what you want, and the AI agent provisions the exact UI components required to execute the task.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-semibold mb-2">Agentic Orchestration</h4>
                      <p className="text-[14px] text-[#a3a3a3] leading-relaxed">Powered by fine-tuned Llama 3.1 pipelines. Our agents autonomously research, write, and execute code within the workspace.</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 shadow-2xl relative">
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="h-4 w-3/4 bg-[#262626] rounded-md" />
                    <div className="h-4 w-1/2 bg-[#262626] rounded-md" />
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[13px] font-mono">
                      > Agent spawned: Architecting new database schema...
                      <br />> Zero-state UI rendered.
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SLIDE 4: Market Opportunity */}
        <section className="py-24 px-6 border-b border-[#e5e5e5] bg-[#fafafa]">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="text-[13px] font-bold text-green-600 tracking-wider uppercase mb-3">The Market</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">A Multi-Billion Dollar <br /> Shift in B2B Software.</h2>
            </FadeIn>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FadeIn delay={0.1}>
                <div className="p-8 bg-white border border-[#e5e5e5] rounded-2xl flex flex-col items-center text-center shadow-sm hover:border-[#171717] transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-[#e5e5e5]">
                    <Globe className="w-7 h-7 text-[#171717]" />
                  </div>
                  <div className="text-4xl font-bold mb-2">30M+</div>
                  <div className="text-[14px] font-medium text-[#171717] mb-2">Global Developers</div>
                  <p className="text-[13px] text-[#737373]">The foundation of the modern digital economy.</p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="p-8 bg-white border border-[#e5e5e5] rounded-2xl flex flex-col items-center text-center shadow-sm shadow-blue-500/5 ring-1 ring-blue-500/10">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                    <Target className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold mb-2">$1.76B</div>
                  <div className="text-[14px] font-medium text-[#171717] mb-2">SAM (Serviceable Market)</div>
                  <p className="text-[13px] text-[#737373]">Targeting the top 10% elite developers at a $49/mo Pro tier.</p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="p-8 bg-white border border-[#e5e5e5] rounded-2xl flex flex-col items-center text-center shadow-sm hover:border-[#171717] transition-colors">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold mb-2">$10B+</div>
                  <div className="text-[14px] font-medium text-[#171717] mb-2">TAM (Total Market)</div>
                  <p className="text-[13px] text-[#737373]">Broader B2B AI orchestration and enterprise workflow automation.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SLIDE 5: Traction & The Founder */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <div className="text-[13px] font-bold text-purple-600 tracking-wider uppercase mb-3">Traction & Agility</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Built by a highly agile, solo technical founder.</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-purple-500 rounded-full" />
                    <div>
                      <h4 className="text-[16px] font-semibold text-[#171717]">Bootstrapped Architecture</h4>
                      <p className="text-[14px] text-[#737373] mt-1 leading-relaxed">Built the entire MVP, proprietary Zero-State UI, and backend infrastructure over 6+ months with $0 in outside funding.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-[#171717] rounded-full" />
                    <div>
                      <h4 className="text-[16px] font-semibold text-[#171717]">The Ruthless Pivot</h4>
                      <p className="text-[14px] text-[#737373] mt-1 leading-relaxed">Recognized early that our initial real-world networking model wouldn't scale with LLM evolution. Pivoted the entire stack to an AI Developer Tool in weeks—demonstrating supreme technical agility and market awareness.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-blue-500 rounded-full" />
                    <div>
                      <h4 className="text-[16px] font-semibold text-[#171717]">Delaware C-Corp Ready</h4>
                      <p className="text-[14px] text-[#737373] mt-1 leading-relaxed">Legally structured as a Delaware Inc., completely optimized and ready for immediate Silicon Valley venture capital injection.</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-[#fafafa] border border-[#e5e5e5] rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
                    <Users className="w-8 h-8 text-[#171717] mb-3" />
                    <div className="text-3xl font-bold mb-1">1</div>
                    <div className="text-[12px] font-medium text-[#737373]">Solo Founder</div>
                  </div>
                  <div className="aspect-square bg-[#fafafa] border border-[#e5e5e5] rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
                    <DollarSign className="w-8 h-8 text-[#171717] mb-3" />
                    <div className="text-3xl font-bold mb-1">$49</div>
                    <div className="text-[12px] font-medium text-[#737373]">Pro/mo Business Model</div>
                  </div>
                  <div className="col-span-2 p-6 bg-[#171717] rounded-2xl text-white flex items-center justify-between shadow-lg">
                    <div>
                      <div className="text-[14px] font-medium text-[#a3a3a3] mb-1">Tech Stack</div>
                      <div className="font-semibold">Next.js • Vercel AI SDK • Firebase</div>
                    </div>
                    <Terminal className="w-6 h-6 text-[#a3a3a3]" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SLIDE 6: The Ask */}
        <section className="py-32 px-6 bg-[#fafafa] border-t border-[#e5e5e5] text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">We are open to investment.</h2>
            <p className="text-[18px] md:text-[20px] text-[#525252] max-w-2xl mx-auto mb-12">
              Join us in redefining the developer experience. We are actively speaking with visionary angels and pre-seed funds who understand the power of agentic workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:investors@togetlink.com" 
                className="flex items-center gap-2 px-8 py-4 bg-[#171717] text-white rounded-full font-medium hover:bg-[#262626] transition-colors hover:shadow-xl hover:shadow-black/10 w-full sm:w-auto justify-center"
              >
                <Mail className="w-5 h-5" />
                Contact Founder
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-white border border-[#e5e5e5] text-[#171717] rounded-full font-medium hover:bg-[#f4f4f4] transition-colors w-full sm:w-auto justify-center"
              >
                <Linkedin className="w-5 h-5" />
                Connect on LinkedIn
              </a>
            </div>
          </FadeIn>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-[13px] text-[#a3a3a3] border-t border-[#e5e5e5] bg-white">
        © {new Date().getFullYear()} TogetLink Inc. (Delaware C-Corp). All rights reserved.
      </footer>
    </div>
  )
}
