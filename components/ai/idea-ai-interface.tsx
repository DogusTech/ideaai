"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { 
  Search, 
  Home, 
  LayoutGrid, 
  MessageSquare, 
  PenTool, 
  FileText, 
  ChevronDown, 
  MoreHorizontal, 
  Plus, 
  Mic, 
  AlertCircle,
  ExternalLink,
  Info,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  StopCircle,
  Hash
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
    <div className="flex h-screen w-full font-sans overflow-hidden bg-white text-[#0a0a0a]">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] shrink-0 bg-[#f9fafb] border-r border-gray-100 flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Workspace Header */}
          <div className="h-14 flex items-center justify-between px-3 shrink-0">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-md transition-colors text-sm font-medium text-gray-800">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" />
              </div>
              dogustech's projects
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-3 pb-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
            >
              New Chat
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* Main Navigation */}
            <div className="px-2 space-y-0.5">
              <NavItem icon={<Search className="w-4 h-4" />} label="Search" />
              <NavItem icon={<Home className="w-4 h-4" />} label="Home" active />
              <NavItem icon={<LayoutGrid className="w-4 h-4" />} label="Projects" />
              <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Chats" />
              <NavItem icon={<PenTool className="w-4 h-4" />} label="Design Systems" />
              <NavItem icon={<FileText className="w-4 h-4" />} label="Templates" />
            </div>

            {/* Recent Chats */}
            <div className="mt-6">
              <div className="px-4 text-xs text-gray-500 mb-1 flex items-center justify-between">
                Recent Chats
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="px-2 space-y-0.5">
                <ChatNavItem label="Untitled chat" />
                <ChatNavItem label="Untitled chat (3)" />
                <ChatNavItem label="Untitled chat" />
                <ChatNavItem label="TogetLink Hub Discovery" />
                <ChatNavItem label="Untitled chat (2)" />
                <button className="w-full flex items-center gap-2.5 px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-left group">
                  <MoreHorizontal className="w-4 h-4 shrink-0" />
                  <span className="truncate">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-3 bg-[#f9fafb]">
          {/* Payment Failed Warning */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 mb-3 px-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Payment Failed
          </div>
          
          {/* User Profile */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-md transition-colors text-sm font-medium text-gray-700">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-[10px] text-blue-600 font-bold">dt</span>
              </div>
              dogustech
            </button>
            <div className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700">
              $49
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        
        {/* Chat History Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full pt-6 pb-48">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                <h1 className="text-3xl md:text-[2.5rem] font-bold tracking-tight text-[#0a0a0a] mb-8 font-sans">
                  What do you want to create?
                </h1>
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
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 border border-gray-200">
                        DY
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                        <Layers className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="font-semibold text-sm text-gray-800">
                      {message.role === "user" ? "You" : "IdeaAI"}
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 prose-p:leading-relaxed prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:text-gray-800 prose-code:text-black prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
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
          messages.length === 0 ? "top-[40%]" : "bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-12"
        }`}>
          <div className="w-full max-w-3xl">
            <div 
              className={`w-full bg-white rounded-xl border transition-all duration-300 shadow-sm ${
                isFocused ? "border-gray-300 shadow-md" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-3 flex flex-col">
                
                {/* File Attachment Tag (Static for visual copy) */}
                {messages.length === 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-600 w-max mb-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    image.png
                    <button className="text-gray-400 hover:text-gray-600 ml-1"><Plus className="w-3 h-3 rotate-45" /></button>
                  </div>
                )}
                
                {/* Textarea */}
                <div className="px-1">
                  <textarea
                    value={input || ""}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask anything, @ to mention, / for actions"
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[24px] max-h-[200px] text-[#0a0a0a] placeholder:text-gray-400 text-sm leading-relaxed"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-4 mt-3 border-t border-transparent">
                  
                  {/* Left Actions */}
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    
                    <button type="button" className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 text-xs font-medium text-gray-500 transition-colors">
                      <span className="font-serif italic mr-0.5">@</span> IdeaAI Pro
                      <ChevronDown className="w-3 h-3 ml-0.5 text-gray-400" />
                    </button>

                    {messages.length === 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        <Hash className="w-3.5 h-3.5" />
                        material-3
                        <button className="text-blue-400 hover:text-blue-600 ml-1"><Plus className="w-3 h-3 rotate-45" /></button>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button type="button" className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                      Project
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {isLoading ? (
                      <button 
                        type="button"
                        onClick={stop}
                        className="flex items-center justify-center p-1.5 rounded-lg transition-all bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <StopCircle className="w-4 h-4" />
                      </button>
                    ) : (input || "").trim() ? (
                      <button 
                        type="button"
                        onClick={submitMessage}
                        className="flex items-center justify-center p-1.5 rounded-lg transition-all bg-black text-white hover:bg-gray-800 shadow-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        type="button"
                        className="flex items-center justify-center p-1.5 rounded-lg transition-all bg-black text-white hover:bg-gray-800 shadow-sm"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Unpaid Invoice Warning - ATTACHED TO BOTTOM OF BOX */}
              {messages.length === 0 && (
                <div className="border-t border-red-100 bg-[#fee2e2] rounded-b-xl px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#dc2626]">
                    <AlertCircle className="w-4 h-4 fill-red-500 text-white" />
                    You have an unpaid invoice. Please pay your invoice to continue.
                  </div>
                  <button className="flex items-center gap-1 text-[13px] font-medium text-[#dc2626] hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Pay Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-md transition-colors text-left group ${
      active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-100"
    }`}>
      <span className={active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function ChatNavItem({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center gap-2.5 px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-left group">
      <div className="w-4 h-4 shrink-0 flex items-center justify-center">
        {/* Placeholder for v0's dotted icon */}
        <div className="w-3 h-3 rounded-full border-[1.5px] border-dashed border-gray-400 group-hover:border-gray-500 transition-colors" />
      </div>
      <span className="truncate">{label}</span>
    </button>
  )
}
