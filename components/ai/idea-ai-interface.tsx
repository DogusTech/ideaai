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
  ArrowUp,
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
    <div className="flex h-screen w-full font-sans overflow-hidden bg-white text-[#171717]">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] shrink-0 bg-[#f9fafb] border-r border-[#e5e5e5] flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Workspace Header */}
          <div className="h-[56px] flex items-center justify-between px-3 shrink-0">
            <button className="flex items-center hover:bg-[#f0f0f0] p-1.5 rounded-md transition-colors text-[14px] font-medium text-[#171717]">
              <div className="w-[24px] h-[24px] rounded-full bg-[#2563eb] flex items-center justify-center text-white mr-2.5 shadow-sm">
                <Globe className="w-[14px] h-[14px] opacity-90" strokeWidth={2} />
              </div>
              dogustech's projects
              <ChevronsUpDown className="w-4 h-4 text-[#a3a3a3] ml-1.5" strokeWidth={2} />
            </button>
            <button className="p-1.5 hover:bg-[#f0f0f0] rounded-md text-[#525252] transition-colors">
              <Sidebar className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
          </div>

          {/* New Chat Button (Split Button) */}
          <div className="px-3 pb-4">
            <div className="flex w-full bg-white hover:bg-[#f9f9f9] rounded-[8px] border border-[#e5e5e5] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center py-[7px] text-[14px] font-medium text-[#171717] rounded-l-[8px]"
              >
                New Chat
              </button>
              <div className="w-px bg-[#e5e5e5]"></div>
              <button className="px-2.5 flex items-center justify-center text-[#737373] hover:text-[#171717] rounded-r-[8px] hover:bg-[#f0f0f0] transition-colors">
                <ChevronDown className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Main Navigation */}
            <div className="px-2 space-y-[2px]">
              <NavItem icon={<Search className="w-[18px] h-[18px]" strokeWidth={2} />} label="Search" />
              <NavItem icon={<Home className="w-[18px] h-[18px]" strokeWidth={2} />} label="Home" active />
              <NavItem icon={<LayoutGrid className="w-[18px] h-[18px]" strokeWidth={2} />} label="Projects" />
              <NavItem icon={<MessageSquare className="w-[18px] h-[18px]" strokeWidth={2} />} label="Chats" />
              <NavItem icon={<PenTool className="w-[18px] h-[18px]" strokeWidth={2} />} label="Design Systems" />
              <NavItem icon={<FileText className="w-[18px] h-[18px]" strokeWidth={2} />} label="Templates" />
            </div>

            {/* Favorites */}
            <div className="mt-8">
              <div className="px-4 text-[13px] font-medium text-[#737373] mb-1.5 flex items-center justify-between">
                Favorites
                <ChevronDown className="w-4 h-4 text-[#a3a3a3] -rotate-90" strokeWidth={2} />
              </div>
            </div>

            {/* Recent Chats */}
            <div className="mt-6">
              <div className="px-4 text-[13px] font-medium text-[#737373] mb-1.5 flex items-center justify-between">
                Recent Chats
                <ChevronDown className="w-4 h-4 text-[#a3a3a3]" strokeWidth={2} />
              </div>
              <div className="px-2 space-y-[2px] pb-4">
                <ChatNavItem label="Untitled chat" />
                <ChatNavItem label="Untitled chat (3)" isBranch />
                <ChatNavItem label="Untitled chat" />
                <ChatNavItem label="TogetLink Hub Discovery" isBranch />
                <ChatNavItem label="Untitled chat (2)" isBranch />
                <button className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#f0f0f0] rounded-md transition-colors text-left group mt-1">
                  <MoreHorizontal className="w-[18px] h-[18px] shrink-0 text-[#737373] group-hover:text-[#525252] transition-colors" strokeWidth={2} />
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
            <button className="flex items-center gap-2 hover:bg-[#f0f0f0] p-1.5 rounded-md transition-colors text-[14px] font-medium text-[#171717]">
              <div className="w-[24px] h-[24px] rounded-full bg-[#e0e7ff] flex items-center justify-center border border-[#c7d2fe] overflow-hidden relative shadow-sm">
                <div className="absolute bottom-0 w-3.5 h-2 bg-[#4f46e5] rounded-t-sm" />
              </div>
              dogustech
            </button>
            <div className="px-2.5 py-1 bg-white border border-[#e5e5e5] rounded-[6px] text-[13px] font-semibold text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              $49
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        
        {/* Chat History Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full pt-6 pb-48">
          <div className="max-w-[672px] mx-auto space-y-6">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                {/* Empty container for layout */}
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
                      <div className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center text-xs font-medium text-[#525252] border border-[#e5e5e5]">
                        DY
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center text-white">
                        <Globe className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="font-semibold text-[15px] text-[#171717]">
                      {message.role === "user" ? "You" : "IdeaAI"}
                    </div>
                    <div className="prose prose-sm max-w-none text-[#404040] prose-p:leading-relaxed prose-pre:bg-[#f5f5f5] prose-pre:border prose-pre:border-[#e5e5e5] prose-pre:text-[#171717] prose-code:text-[#171717] prose-code:bg-[#f5f5f5] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
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
          messages.length === 0 ? "top-[42%] -translate-y-1/2" : "bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-12"
        }`}>
          <div className="w-full max-w-[672px]">
            
            {/* Hero Heading attached directly to the top of the input box */}
            {messages.length === 0 && (
              <h1 className="text-center text-[32px] font-semibold tracking-tight text-[#171717] mb-7 font-sans">
                What do you want to create?
              </h1>
            )}

            <div 
              className={`w-full bg-white rounded-2xl border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                isFocused ? "border-[#a3a3a3] shadow-[0_4px_16px_rgba(0,0,0,0.08)]" : "border-[#d4d4d4] hover:border-[#a3a3a3]"
              }`}
            >
              <div className="p-2 flex flex-col">
                
                {/* File Attachment Tag (Static for visual copy) */}
                {messages.length === 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-[3px] bg-[#f9fafb] border border-[#e5e5e5] rounded-[6px] text-[12px] font-medium text-[#525252] w-max mb-1 ml-1 mt-0.5 shadow-sm">
                    <div className="w-[16px] h-[16px] bg-white border border-[#e5e5e5] rounded-[4px] flex items-center justify-center">
                       <ImageIcon className="w-[10px] h-[10px] text-[#737373]" strokeWidth={2} />
                    </div>
                    image.png
                    <button className="text-[#a3a3a3] hover:text-[#525252] ml-0.5"><Plus className="w-3 h-3 rotate-45" strokeWidth={2.5} /></button>
                  </div>
                )}
                
                {/* Textarea */}
                <div className="px-2 pt-1 pb-1">
                  <textarea
                    value={input || ""}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask anything, @ to mention, / for actions"
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[22px] max-h-[200px] text-[#171717] placeholder:text-[#a3a3a3] text-[14px] leading-relaxed font-sans"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-1 ml-1 mr-1 pb-0.5">
                  
                  {/* Left Actions */}
                  <div className="flex items-center">
                    <button type="button" className="p-1 rounded-md text-[#a3a3a3] hover:text-[#525252] transition-colors">
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </button>
                    
                    <button type="button" className="flex items-center gap-1 px-1.5 py-1 ml-0.5 rounded-md hover:bg-[#f5f5f5] text-[13px] font-medium text-[#525252] transition-colors">
                      <span className="font-serif italic text-[#a3a3a3] text-[14px] font-medium">@</span> v0 Pro
                      <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-[#a3a3a3]" strokeWidth={2} />
                    </button>

                    {messages.length === 0 && (
                      <>
                        {/* Vertical divider */}
                        <div className="w-[1px] h-[14px] bg-[#e5e5e5] mx-1.5"></div>

                        <div className="flex items-center gap-1.5 px-1.5 py-[3px] bg-[#eff6ff] text-[#1d4ed8] rounded-[6px] text-[12px] font-medium cursor-pointer hover:bg-blue-100/50 transition-colors">
                          <div className="w-[14px] h-[14px] rounded-full bg-[#3b82f6] flex items-center justify-center text-white">
                            <span className="text-[9px] font-bold">M</span>
                          </div>
                          material-3
                          <button className="text-blue-400 hover:text-blue-600 ml-0.5"><Plus className="w-3 h-3 rotate-45" strokeWidth={2.5} /></button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2.5">
                    <button type="button" className="flex items-center gap-1 text-[13px] font-medium text-[#525252] hover:text-[#171717] transition-colors">
                      Project
                      <ChevronDown className="w-3.5 h-3.5 text-[#a3a3a3]" strokeWidth={2} />
                    </button>
                    
                    {isLoading ? (
                      <button 
                        type="button"
                        onClick={stop}
                        className="flex items-center justify-center w-[28px] h-[28px] rounded-[8px] transition-all bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <StopCircle className="w-[16px] h-[16px]" strokeWidth={2} />
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={submitMessage}
                        className={`flex items-center justify-center w-[28px] h-[28px] rounded-[8px] transition-all shadow-sm ${
                          messages.length === 0 || (input || "").trim() 
                            ? "bg-[#171717] text-white hover:bg-[#262626]" 
                            : "bg-[#f5f5f5] text-[#a3a3a3] cursor-not-allowed border border-[#e5e5e5]"
                        }`}
                      >
                        {messages.length === 0 || (input || "").trim() ? (
                           <ArrowUp className="w-[16px] h-[16px]" strokeWidth={2.5} />
                        ) : (
                           <Mic className="w-[16px] h-[16px]" strokeWidth={2.5} />
                        )}
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
          width: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d4d4d4;
          border-radius: 9999px;
          border: 4px solid rgba(0,0,0,0);
          background-clip: padding-box;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #a3a3a3;
        }
        
        /* Up and Down Buttons on Scrollbar */
        .custom-scrollbar::-webkit-scrollbar-button:single-button {
          display: block;
          background-size: 8px;
          background-repeat: no-repeat;
        }
        /* Up arrow */
        .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement {
          height: 14px;
          width: 14px;
          background-position: center 6px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(163, 163, 163)'><polygon points='50,00 0,50 100,50'/></svg>");
        }
        /* Down arrow */
        .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment {
          height: 14px;
          width: 14px;
          background-position: center 2px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(163, 163, 163)'><polygon points='0,0 100,0 50,50'/></svg>");
        }
        /* Hover states for buttons */
        .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(82, 82, 82)'><polygon points='50,00 0,50 100,50'/></svg>");
        }
        .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment:hover {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(82, 82, 82)'><polygon points='0,0 100,0 50,50'/></svg>");
        }
      `}} />
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-[7px] text-[14px] rounded-md transition-colors text-left group ${
      active ? "bg-[#f0f0f0] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#f0f0f0]"
    }`}>
      <span className={active ? "text-[#171717]" : "text-[#737373] group-hover:text-[#525252] transition-colors"}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function ChatNavItem({ label, isBranch = false }: { label: string, isBranch?: boolean }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#f0f0f0] rounded-md transition-colors text-left group">
      <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
        {isBranch ? (
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#737373] group-hover:text-[#525252] transition-colors">
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
        ) : (
          <div className="w-[14px] h-[14px] rounded-full border-[2px] border-dashed border-[#737373] group-hover:border-[#525252] transition-colors" />
        )}
      </div>
      <span className="truncate">{label}</span>
    </button>
  )
}
