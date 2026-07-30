"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { 
  Search, 
  Home, 
  LayoutGrid, 
  MessageSquare, 
  PenTool, 
  FileText, 
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal, 
  Plus, 
  Mic, 
  Sidebar,
  Image as ImageIcon,
  ArrowRight,
  StopCircle,
  Globe
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
      <aside className="w-[260px] shrink-0 bg-[#f9fafb] border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Workspace Header */}
          <div className="h-[56px] flex items-center justify-between px-3 shrink-0">
            <button className="flex items-center hover:bg-gray-100 p-1.5 rounded-md transition-colors text-[14px] font-medium text-gray-900">
              <div className="w-[22px] h-[22px] rounded-full bg-[#2563eb] flex items-center justify-center text-white mr-2 shadow-sm">
                <Globe className="w-3.5 h-3.5 opacity-90" />
              </div>
              dogustech's projects
              <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
              <Sidebar className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-3 pb-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full relative flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 py-[6px] rounded-[8px] border border-gray-200 transition-all text-[14px] font-medium shadow-sm"
            >
              New Chat
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Main Navigation */}
            <div className="px-2 space-y-0.5">
              <NavItem icon={<Search className="w-[18px] h-[18px]" />} label="Search" />
              <NavItem icon={<Home className="w-[18px] h-[18px]" />} label="Home" active />
              <NavItem icon={<LayoutGrid className="w-[18px] h-[18px]" />} label="Projects" />
              <NavItem icon={<MessageSquare className="w-[18px] h-[18px]" />} label="Chats" />
              <NavItem icon={<PenTool className="w-[18px] h-[18px]" />} label="Design Systems" />
              <NavItem icon={<FileText className="w-[18px] h-[18px]" />} label="Templates" />
            </div>

            {/* Recent Chats */}
            <div className="mt-6">
              <div className="px-4 text-[13px] font-medium text-gray-500 mb-1 flex items-center justify-between">
                Recent Chats
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="px-2 space-y-0.5">
                <ChatNavItem label="Untitled chat" />
                <ChatNavItem label="Untitled chat (3)" />
                <ChatNavItem label="Untitled chat" />
                <ChatNavItem label="TogetLink Hub Discovery" />
                <ChatNavItem label="Untitled chat (2)" />
                <button className="w-full flex items-center gap-2.5 px-2 py-1.5 text-[14px] text-gray-600 hover:bg-gray-100 rounded-md transition-colors text-left group mt-1">
                  <MoreHorizontal className="w-[18px] h-[18px] shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <span className="truncate">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-3 bg-[#f9fafb]">
          {/* User Profile */}
          <div className="flex items-center justify-between mt-2">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-md transition-colors text-[14px] font-medium text-gray-800">
              <div className="w-[22px] h-[22px] rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden relative shadow-sm">
                <div className="absolute bottom-0 w-3 h-2 bg-blue-500 rounded-t-sm" />
              </div>
              dogustech
            </button>
            <div className="px-2.5 py-1 bg-white border border-gray-200 rounded-[6px] text-[13px] font-semibold text-gray-800 shadow-sm">
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
                {/* Empty container to allow positioning logic */}
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
                        <Globe className="w-4 h-4" />
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
        <div className={`absolute left-0 right-0 px-4 pb-8 transition-all duration-500 ease-in-out flex justify-center ${
          messages.length === 0 ? "top-[40%] -translate-y-1/2" : "bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-12"
        }`}>
          <div className="w-full max-w-3xl">
            
            {/* Hero Heading attached directly to the top of the input box */}
            {messages.length === 0 && (
              <h1 className="text-center text-[34px] font-bold tracking-tight text-[#0a0a0a] mb-6 font-sans">
                What do you want to create?
              </h1>
            )}

            <div 
              className={`w-full bg-white rounded-[16px] border transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] ${
                isFocused ? "border-gray-300 shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-2.5 flex flex-col">
                
                {/* File Attachment Tag (Static for visual copy) */}
                {messages.length === 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50/80 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-700 w-max mb-1 ml-1 mt-0.5">
                    <div className="w-[18px] h-[18px] bg-white border border-gray-200 rounded-[4px] flex items-center justify-center">
                       <ImageIcon className="w-[10px] h-[10px] text-gray-500" />
                    </div>
                    image.png
                    <button className="text-gray-400 hover:text-gray-600 ml-0.5"><Plus className="w-3.5 h-3.5 rotate-45" /></button>
                  </div>
                )}
                
                {/* Textarea */}
                <div className="px-2 pt-1">
                  <textarea
                    value={input || ""}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask anything, @ to mention, / for actions"
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[24px] max-h-[200px] text-[#0a0a0a] placeholder:text-gray-400 text-[15px] leading-relaxed"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2.5 ml-1 mr-1 pb-1">
                  
                  {/* Left Actions */}
                  <div className="flex items-center">
                    <button type="button" className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                    
                    <button type="button" className="flex items-center gap-1.5 px-2 py-1 ml-0.5 rounded-md hover:bg-gray-100 text-[13px] font-medium text-gray-500 transition-colors">
                      <span className="font-serif italic text-gray-400 text-[14px]">@</span> v0 Pro
                      <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-gray-400" />
                    </button>

                    {messages.length === 0 && (
                      <>
                        {/* Vertical divider */}
                        <div className="w-px h-[14px] bg-gray-200 mx-2"></div>

                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#eff6ff] text-[#1d4ed8] rounded-[6px] text-[13px] font-medium cursor-pointer hover:bg-blue-100/50 transition-colors">
                          <div className="w-[16px] h-[16px] rounded-full bg-[#3b82f6] flex items-center justify-center text-white">
                            <span className="text-[10px] font-bold">M</span>
                          </div>
                          material-3
                          <button className="text-blue-400 hover:text-blue-600 ml-0.5"><Plus className="w-3.5 h-3.5 rotate-45" /></button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
                      Project
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    
                    {isLoading ? (
                      <button 
                        type="button"
                        onClick={stop}
                        className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] transition-all bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <StopCircle className="w-[18px] h-[18px]" />
                      </button>
                    ) : (input || "").trim() ? (
                      <button 
                        type="button"
                        onClick={submitMessage}
                        className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] transition-all bg-black text-white hover:bg-gray-800 shadow-sm"
                      >
                        <ArrowRight className="w-[18px] h-[18px]" />
                      </button>
                    ) : (
                      <button 
                        type="button"
                        className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] transition-all bg-black text-white hover:bg-gray-800 shadow-sm"
                      >
                        <Mic className="w-[18px] h-[18px]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add custom scrollbar styling globally for the sidebar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }
      `}} />
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-2.5 px-2 py-[7px] text-[14px] rounded-md transition-colors text-left group ${
      active ? "bg-gray-100/80 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-100"
    }`}>
      <span className={active ? "text-gray-800" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function ChatNavItem({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center gap-2.5 px-2 py-[7px] text-[14px] text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-left group">
      <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
        <div className="w-[12px] h-[12px] rounded-full border-[1.5px] border-dashed border-gray-300 group-hover:border-gray-400 transition-colors" />
      </div>
      <span className="truncate">{label}</span>
    </button>
  )
}
