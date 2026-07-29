"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"
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
  History,
  User,
  StopCircle
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function IdeaAIInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat()
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        const fakeEvent = new Event("submit") as unknown as React.FormEvent<HTMLFormElement>
        handleSubmit(fakeEvent)
      }
    }
  }

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
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl border border-zinc-700/50 transition-all font-semibold shadow-sm"
          >
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
        <header className="h-14 flex items-center justify-between px-6 shrink-0 z-10 bg-[#09090b]/80 backdrop-blur border-b border-transparent">
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

        {/* Chat History Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full pt-10 pb-36">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
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
                
                {/* Quick Suggestions */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-3 mt-4"
                >
                  <span className="text-sm text-zinc-500 mr-2">Try:</span>
                  {[
                    "Real-time chat architecture",
                    "SaaS pricing models",
                    "Location-based matchmaking"
                  ].map((suggestion, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 mt-1">
                    {message.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0543B8] to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        DY
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white border border-zinc-700">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="font-semibold text-sm text-zinc-300">
                      {message.role === "user" ? "You" : "IdeaAI"}
                    </div>
                    <div className="prose prose-invert prose-zinc max-w-none text-zinc-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {/* Auto scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT BOX (Fixed to bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent pt-12">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <motion.div 
                className={`w-full bg-[#18181b]/95 backdrop-blur-xl rounded-2xl border transition-all duration-300 shadow-2xl ${
                  isFocused ? "border-[#0543B8] shadow-[0_0_30px_-5px_rgba(5,67,184,0.2)]" : "border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="p-4 flex flex-col">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask IdeaAI to brainstorm..."
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[60px] max-h-[200px] text-zinc-200 placeholder:text-zinc-500 text-base leading-relaxed"
                    rows={messages.length === 0 ? 3 : 1}
                  />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    {/* Tools/Modifiers */}
                    <div className="flex items-center gap-1.5">
                      <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800/80 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-800/50">
                        <Plus className="w-3.5 h-3.5" />
                        Attach
                      </button>
                      <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800/80 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-800/50">
                        <LayoutTemplate className="w-3.5 h-3.5" />
                        Project
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>
                    </div>

                    {/* Submit / Stop / Mic */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button type="button" className="p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" title="Voice Input">
                        <Mic className="w-4 h-4" />
                      </button>
                      
                      {isLoading ? (
                        <button 
                          type="button"
                          onClick={stop}
                          className="flex items-center justify-center p-2.5 rounded-full font-semibold transition-all bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        >
                          <StopCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          type="submit"
                          disabled={!input.trim()}
                          className={`flex items-center justify-center p-2.5 rounded-full font-semibold transition-all ${
                            input.trim() 
                              ? "bg-white text-black hover:bg-zinc-200" 
                              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </form>

            {/* Warning Message Match Reference Image */}
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full mt-4 flex items-center justify-between px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm overflow-hidden"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 font-bold text-xs">!</span>
                    <span>IdeaAI Beta is currently limited to selected developers.</span>
                  </div>
                  <button type="button" className="font-medium hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> Request Access
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
