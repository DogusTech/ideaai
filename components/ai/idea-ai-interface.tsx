"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  Bot, 
  Plus, 
  MessageSquare, 
  Settings, 
  Search, 
  Sparkles, 
  Mic, 
  Send,
  Cpu,
  ChevronDown,
  LayoutTemplate,
  History
} from "lucide-react"

export function IdeaAIInterface() {
  const [prompt, setPrompt] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 font-sans overflow-hidden selection:bg-[#0543B8]/30">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] shrink-0 border-r border-zinc-800/60 bg-[#09090b] flex flex-col justify-between hidden md:flex">
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mt-2">
            <div className="flex size-8 items-center justify-center bg-[#0543B8] rounded-md shadow-lg shadow-[#0543B8]/20 text-white font-black text-sm leading-none">
              TL
            </div>
            <span className="text-xl font-bold tracking-tight text-white">IdeaAI</span>
          </div>

          {/* New Chat Button */}
          <button className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl border border-zinc-700/50 transition-all font-semibold shadow-sm">
            <Plus className="w-4 h-4" />
            New Idea Session
          </button>

          {/* History */}
          <div className="space-y-1">
            <div className="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2 mt-6">
              <History className="w-3 h-3" /> Recent Projects
            </div>
            {["Next.js SaaS Boilerplate", "Phygital Networking DB", "AI Job Matcher", "Real-time Chat Protocol"].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-colors text-left group">
                <MessageSquare className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User / Settings Footer */}
        <div className="p-4 border-t border-zinc-800/60">
          <button className="w-full flex items-center justify-between px-3 py-3 hover:bg-zinc-800/50 rounded-xl transition-colors text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0543B8] to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                DY
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-zinc-200">Doğuş Yılmaz</span>
                <span className="text-xs text-emerald-400 font-medium">Pro Plan</span>
              </div>
            </div>
            <Settings className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#09090b] to-[#121214]">
        
        {/* Top Nav (Mobile & Settings) */}
        <header className="h-14 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="md:hidden flex items-center gap-2">
            <div className="flex size-7 items-center justify-center bg-[#0543B8] rounded-md text-white font-black text-xs leading-none">
              TL
            </div>
            <span className="font-bold text-white">IdeaAI</span>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 cursor-pointer hover:text-white transition-colors hover:border-zinc-600">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Model: LLaMA 3</span>
              <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
            </div>
          </div>
        </header>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-3xl mx-auto -mt-16">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
              What do you want to create?
            </h1>
          </motion.div>

          {/* PROMPT BOX */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`w-full bg-[#18181b]/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 shadow-2xl ${
              isFocused ? "border-[#0543B8] shadow-[0_0_30px_-5px_rgba(5,67,184,0.2)]" : "border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div className="p-4 flex flex-col">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask IdeaAI to brainstorm..."
                className="w-full bg-transparent border-none outline-none resize-none min-h-[120px] text-zinc-200 placeholder:text-zinc-500 text-lg sm:text-xl leading-relaxed"
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                
                {/* Tools/Modifiers */}
                <div className="flex items-center gap-1.5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800/80 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-800/50">
                    <Plus className="w-3.5 h-3.5" />
                    Attach
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800/80 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-800/50">
                    <LayoutTemplate className="w-3.5 h-3.5" />
                    Project
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                </div>

                {/* Submit / Mic */}
                <div className="flex items-center gap-2 ml-auto">
                  <button className="p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" title="Voice Input">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={!prompt.trim()}
                    className={`flex items-center gap-2 p-2.5 rounded-full font-semibold transition-all ${
                      prompt.trim() 
                        ? "bg-white text-black hover:bg-zinc-200" 
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Warning Message Match Reference Image */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full mt-4 flex items-center justify-between px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 font-bold text-xs">!</span>
              <span>IdeaAI Beta is currently limited to selected developers.</span>
            </div>
            <button className="font-medium hover:underline flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" /> Request Access
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function ExternalLink(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  )
}
