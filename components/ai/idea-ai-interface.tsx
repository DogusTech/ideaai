"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
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
  StopCircle,
  Code2,
  FileText
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function IdeaAIInterface() {
  const { messages, input, setInput, append, isLoading, stop } = useChat()
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const submitMessage = () => {
    if ((input || "").trim()) {
      append({ role: "user", content: input })
      setInput("") // Clear the input after sending
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#f3f4f6] text-[#1f2937]">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] shrink-0 border-r border-gray-200 bg-[#f9fafb] flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col h-full">
          {/* Header / Logo */}
          <div className="h-14 flex items-center px-4 font-semibold text-sm text-gray-700">
            IdeaAI
          </div>

          <div className="p-3 space-y-5 flex-1 overflow-y-auto">
            {/* New Conversation Button */}
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-full border border-gray-200 transition-all font-medium text-sm shadow-sm"
            >
              <Plus className="w-4 h-4 text-gray-500" />
              New Conversation
            </button>

            {/* Menu Items */}
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <History className="w-4 h-4 shrink-0 text-gray-400" />
                <span>Conversation History</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                <span>Scheduled Tasks</span>
              </button>
            </div>

            {/* Projects */}
            <div className="space-y-0.5 pt-2">
              <div className="px-3 text-xs font-semibold text-gray-400 mb-2 flex items-center justify-between">
                <span>Projects</span>
                <div className="flex gap-1 text-gray-400">
                  <button className="hover:text-gray-600 p-1"><Plus className="w-3.5 h-3.5" /></button>
                  <button className="hover:text-gray-600 p-1"><Folder className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              
              {[
                { name: "SaaS Mimarisi", time: "2m", icon: <Folder className="w-4 h-4 text-gray-400" /> },
                { name: "Veritabanı Şeması", time: "1d", icon: <Folder className="w-4 h-4 text-gray-400" /> },
                { name: "API Entegrasyonu", time: "2d", icon: <Folder className="w-4 h-4 text-gray-400" /> },
                { name: "Next.js Kurulumu", time: "3d", icon: <Folder className="w-4 h-4 text-gray-400" /> }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-left group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {item.icon}
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Footer */}
          <div className="p-3">
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-600">
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f3f4f6]">
        
        {/* Top Nav */}
        <header className="h-14 flex items-center justify-between px-4 shrink-0 z-10 w-full bg-white/50 backdrop-blur-sm border-b border-gray-200">
          <div className="md:hidden flex items-center font-semibold text-gray-700">
            IdeaAI
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 mx-auto bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
             <span className="truncate max-w-[300px]">c:\Users\dogus\Downloads\togetlinkk</span>
             <span className="text-gray-300">/</span>
             <span className="font-medium text-gray-700 truncate">### Architecture And Backend Mi...</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-1">
              Restart to Update <ArrowRight className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
              <Monitor className="w-4 h-4 text-blue-500" />
              Install IDE
            </button>
          </div>
        </header>

        {/* Chat History Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full pt-6 pb-36">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
                {/* Initial state is empty, just a clean background waiting for input */}
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
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shadow-sm border border-gray-300">
                        DY
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-blue-500 border border-gray-200 shadow-sm">
                        <Monitor className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2 overflow-hidden bg-white/60 p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                      {message.role === "user" ? "Doğuş" : "IdeaAI"}
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 prose-p:leading-relaxed prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:text-gray-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
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

        {/* INPUT BOX */}
        <div className={`absolute left-0 right-0 p-4 transition-all duration-500 ease-in-out flex justify-center ${
          messages.length === 0 ? "top-1/2 -translate-y-1/2" : "bottom-0 bg-gradient-to-t from-[#f3f4f6] via-[#f3f4f6]/95 to-transparent pt-12"
        }`}>
          <div className="w-full max-w-3xl">
            <div 
              className={`w-full bg-white rounded-2xl border transition-all duration-300 shadow-sm ${
                isFocused ? "border-blue-400 shadow-md shadow-blue-500/10" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-3 flex flex-col">
                
                {/* Textarea */}
                <div className="px-2 pt-2">
                  <textarea
                    value={input || ""}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask anything, @ to mention, / for actions"
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[44px] max-h-[200px] text-gray-800 placeholder:text-gray-400 text-sm leading-relaxed"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-4 mt-2">
                  
                  {/* Model Selector */}
                  <div className="flex items-center gap-1.5">
                    <button type="button" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-xs font-medium text-gray-600 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400" />
                      IdeaAI LLaMA 3 (High)
                      <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
                    </button>
                  </div>

                  {/* Submit / Stop / Mic */}
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Voice Input">
                      <Mic className="w-4 h-4" />
                    </button>
                    
                    {isLoading ? (
                      <button 
                        type="button"
                        onClick={stop}
                        className="flex items-center justify-center p-2 rounded-full font-semibold transition-all bg-red-50 text-red-500 hover:bg-red-100"
                      >
                        <StopCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={submitMessage}
                        disabled={!(input || "").trim()}
                        className={`flex items-center justify-center p-2 rounded-full font-semibold transition-all ${
                          (input || "").trim() 
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                            : "bg-gray-50 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Bottom Bar inside Input Box (Local Tag) */}
                <div className="mt-1.5 border-t border-gray-100 pt-1.5 px-2 flex items-center bg-gray-50/50 -mx-3 -mb-3 rounded-b-2xl pb-2">
                   <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors ml-2 mt-1">
                     <Monitor className="w-3.5 h-3.5" />
                     Local
                     <ChevronDown className="w-3 h-3" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
