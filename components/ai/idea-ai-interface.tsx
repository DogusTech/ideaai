"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { 
  Plus, 
  Settings, 
  Mic, 
  ArrowRight,
  Folder,
  History,
  Calendar,
  ChevronDown,
  Monitor,
  StopCircle
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function IdeaAIInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat()
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if ((input || "").trim()) {
        const fakeEvent = new Event("submit") as unknown as React.FormEvent<HTMLFormElement>
        handleSubmit(fakeEvent)
      }
    }
  }

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden text-[#454e84]" style={{ backgroundColor: "#eff0f0" }}>
      
      {/* SIDEBAR */}
      <aside className="w-[260px] shrink-0 border-r border-[#81a7d4]/30 bg-[#eff0f0] flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col h-full">
          {/* Header / Logo */}
          <div className="h-12 flex items-center px-4 font-medium text-sm text-[#454e84] border-b border-transparent">
            IdeaAI
          </div>

          <div className="p-3 space-y-4 flex-1 overflow-y-auto">
            {/* New Conversation Button */}
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 text-[#454e84] px-4 py-2 rounded-full border border-[#81a7d4]/30 transition-all font-medium text-sm shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#7b83f4]" />
              New Conversation
            </button>

            {/* Menu Items */}
            <div className="space-y-1 mt-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#454e84] hover:bg-[#81a7d4]/10 rounded-lg transition-colors text-left">
                <History className="w-4 h-4 shrink-0 text-[#99817b]" />
                <span>Conversation History</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#454e84] hover:bg-[#81a7d4]/10 rounded-lg transition-colors text-left">
                <Calendar className="w-4 h-4 shrink-0 text-[#99817b]" />
                <span>Scheduled Tasks</span>
              </button>
            </div>

            {/* Projects */}
            <div className="space-y-1 pt-4">
              <div className="px-3 text-xs font-semibold text-[#99817b] mb-2 flex items-center justify-between">
                <span>Projects</span>
                <div className="flex gap-1">
                  <button className="hover:bg-[#81a7d4]/20 p-1 rounded"><Plus className="w-3 h-3" /></button>
                  <button className="hover:bg-[#81a7d4]/20 p-1 rounded"><Folder className="w-3 h-3" /></button>
                </div>
              </div>
              
              {[
                { name: "SaaS Mimarisi", time: "2m" },
                { name: "Veritabanı Şeması", time: "1d" },
                { name: "API Entegrasyonu", time: "2d" },
                { name: "Next.js Kurulumu", time: "3d" }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#454e84] hover:bg-[#81a7d4]/10 rounded-lg transition-colors text-left group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Folder className="w-4 h-4 shrink-0 text-[#deb987]" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-xs text-[#99817b]">{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Footer */}
          <div className="p-3 border-t border-[#81a7d4]/30">
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#81a7d4]/10 rounded-lg transition-colors text-sm text-[#454e84]">
              <Settings className="w-4 h-4 text-[#99817b]" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#eff0f0]">
        
        {/* Top Nav */}
        <header className="h-12 flex items-center justify-between px-4 shrink-0 z-10 w-full">
          <div className="md:hidden flex items-center font-medium text-[#454e84]">
            IdeaAI
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="bg-[#7b83f4] text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#7b83f4]/90 transition-colors shadow-sm">
              Restart to Update →
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-[#454e84] hover:bg-[#81a7d4]/10 px-3 py-1.5 rounded-lg transition-colors">
              <Monitor className="w-4 h-4 text-[#81a7d4]" />
              Install IDE
            </button>
          </div>
        </header>

        {/* Chat History Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full pt-4 pb-36">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
                <div className="flex items-center gap-2 mb-8 text-sm font-medium text-[#99817b] bg-[#81a7d4]/10 px-3 py-1.5 rounded-md border border-[#81a7d4]/20">
                  <Folder className="w-4 h-4 text-[#81a7d4]" />
                  <span>c:\Users\dogus\Downloads\togetlinkk</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </div>
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
                      <div className="w-8 h-8 rounded bg-[#7b83f4] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        DY
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#454e84] border border-[#81a7d4]/30 shadow-sm">
                        <Monitor className="w-5 h-5 text-[#83be69]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="font-semibold text-sm text-[#454e84]">
                      {message.role === "user" ? "Doğuş" : "IdeaAI"}
                    </div>
                    <div className="prose prose-sm max-w-none text-[#454e84] prose-p:leading-relaxed prose-pre:bg-white prose-pre:border prose-pre:border-[#81a7d4]/30 prose-pre:text-[#454e84] prose-code:text-[#694849]">
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

        {/* INPUT BOX (Centered if empty, bottom if has messages) */}
        <div className={`absolute left-0 right-0 p-4 transition-all duration-500 ease-in-out flex justify-center ${
          messages.length === 0 ? "top-1/2 -translate-y-1/2" : "bottom-0 bg-gradient-to-t from-[#eff0f0] via-[#eff0f0]/90 to-transparent pt-12"
        }`}>
          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit}>
              <motion.div 
                className={`w-full bg-white rounded-2xl border transition-all duration-300 shadow-sm ${
                  isFocused ? "border-[#81a7d4] shadow-md shadow-[#81a7d4]/10" : "border-[#81a7d4]/30 hover:border-[#81a7d4]/60"
                }`}
              >
                <div className="p-3 flex flex-col">
                  
                  {/* Textarea */}
                  <div className="px-2 pt-2">
                    <textarea
                      value={input || ""}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Ask anything, @ to mention, / for actions"
                      className="w-full bg-transparent border-none outline-none resize-none min-h-[44px] max-h-[200px] text-[#454e84] placeholder:text-[#99817b] text-base leading-relaxed"
                      rows={1}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 mt-2">
                    
                    {/* Model Selector */}
                    <div className="flex items-center gap-1.5">
                      <button type="button" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[#eff0f0] text-xs font-medium text-[#454e84] transition-colors">
                        <Plus className="w-4 h-4 text-[#99817b]" />
                        IdeaAI LLaMA 3 (Fast)
                        <ChevronDown className="w-3 h-3 ml-1 text-[#99817b]" />
                      </button>
                    </div>

                    {/* Submit / Stop / Mic */}
                    <div className="flex items-center gap-1">
                      <button type="button" className="p-2 rounded-full text-[#99817b] hover:text-[#454e84] hover:bg-[#eff0f0] transition-colors" title="Voice Input">
                        <Mic className="w-4 h-4" />
                      </button>
                      
                      {isLoading ? (
                        <button 
                          type="button"
                          onClick={stop}
                          className="flex items-center justify-center p-2 rounded-full font-semibold transition-all bg-[#694849]/10 text-[#694849] hover:bg-[#694849]/20"
                        >
                          <StopCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          type="submit"
                          disabled={!(input || "").trim()}
                          className={`flex items-center justify-center p-2 rounded-full font-semibold transition-all ${
                            (input || "").trim() 
                              ? "bg-[#eff0f0] text-[#454e84] hover:bg-[#e2e3e3]" 
                              : "bg-[#eff0f0]/50 text-[#99817b]/50 cursor-not-allowed"
                          }`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Bottom Bar inside Input Box */}
                  <div className="mt-2 border-t border-[#81a7d4]/10 pt-2 px-2 flex items-center">
                     <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-[#99817b] hover:text-[#454e84] transition-colors">
                       <Monitor className="w-3.5 h-3.5" />
                       Local
                       <ChevronDown className="w-3 h-3" />
                     </button>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
