"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
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
  Globe,
  Info,
  Users,
  Settings,
  ArrowRight,
  ChevronRight,
  Code2,
  Terminal
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { AntigravityMarkdown } from "./antigravity-markdown"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { SettingsModal } from "./settings-modal"
import { TeamModal } from "./team-modal"

type Project = {
  id: string
  name: string
  files: string[]
  time: string
}



export function IdeaAIInterface() {
  const [selectedDept, setSelectedDept] = useState("Software")
  const [projects, setProjects] = useState<Project[]>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ideaai_projects') || '[]') : [])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Gemini 3.1 Pro High")
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("general")
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  
  const folderInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)
  const addBtnRef = useRef<HTMLButtonElement>(null)
  const modelMenuRef = useRef<HTMLDivElement>(null)
  const modelBtnRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const body = React.useMemo(() => ({ department: selectedDept, project: selectedProject, model: selectedModel }), [selectedDept, selectedProject, selectedModel])

  const [messages, setMessages] = useState<any[]>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ideaai_current_chat') || '[]') : []);
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
    useEffect(() => {
      if (typeof window !== 'undefined') localStorage.setItem('ideaai_projects', JSON.stringify(projects));
    }, [projects]);
    useEffect(() => {
      if (typeof window !== 'undefined') localStorage.setItem('ideaai_current_chat', JSON.stringify(messages));
    }, [messages]);


  const stop = () => {
    abortControllerRef.current?.abort();
    setStatus('ready');
  };

  const sendMessage = async (message: any) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setStatus('submitted');
    setError(null);
    
    abortControllerRef.current = new AbortController();
    
    try {
      const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('ideaai_api_key') || '' : '';
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': storedApiKey
        },
        body: JSON.stringify({ 
          messages: newMessages
        }),
        signal: abortControllerRef.current.signal,
      });
        
        if (!res.ok) {
          let errText = "Bilinmeyen hata oluştu.";
          if (res.status === 504) {
            errText = "Sunucu (Modal GPU) şu anda uykudan uyanıyor (Cold Start). Lütfen 1 dakika bekleyip tekrar deneyin.";
          } else {
            try { 
              const j = await res.json(); 
              errText = j.error || errText; 
            } catch(e) { 
              errText = await res.text(); 
            }
          }
          throw new Error(errText);
        }
        
        const resData = await res.json();
        const fullText = resData.response || resData.text || "No response";
      const assistantId = Date.now().toString();
      
      setMessages([...newMessages, { id: assistantId, role: 'assistant', content: "" }]);
      setStatus('streaming');
      
      let i = 0;
      const chunkSize = 6;
      
      const interval = setInterval(() => {
        if (i < fullText.length) {
          const currentChunk = fullText.substring(0, i + chunkSize);
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: currentChunk } : m));
          i += chunkSize;
        } else {
          clearInterval(interval);
          setStatus('ready');
        }
      }, 15);
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err);
        setStatus('error');
      } else {
        setStatus('ready');
      }
    }
  };
  
  const [localInput, setLocalInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleCustomSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!localInput.trim() || isLoading) return;
    
    // In @ai-sdk/react 4.x, the method is sendMessage, not append.
    sendMessage({ id: Date.now().toString(), role: 'user', content: localInput });
    setLocalInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  }

  // Handle outside clicks to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (showAddMenu && addMenuRef.current && !addMenuRef.current.contains(target) && !addBtnRef.current?.contains(target)) {
        setShowAddMenu(false)
      }
      if (showModelMenu && modelMenuRef.current && !modelMenuRef.current.contains(target) && !modelBtnRef.current?.contains(target)) {
        setShowModelMenu(false)
      }
      // Extremely simple check for workspace menu using class matching to keep it minimalist
      if (showWorkspaceMenu && !(target as Element).closest('.workspace-dropdown-container')) {
        setShowWorkspaceMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showAddMenu, showModelMenu])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email)
      } else {
        setUserEmail(null)
      }
    })
    return () => unsubscribe()
  }, [])



  const handleFolderSelect = async () => {
    try {
      // Use File System Access API to avoid "Upload X files" browser prompt
      const directoryHandle = await (window as any).showDirectoryPicker({ mode: 'read' })
      const folderName = directoryHandle.name
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: folderName,
        files: [], // Skip counting to ensure instant loading
        time: "Just now"
      }
      
      setProjects(prev => [...prev, newProject])
      setSelectedProject(folderName)
      setShowAddMenu(false)
    } catch (err) {
      console.log('Folder selection cancelled or failed', err)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Just a mock handler for media for now
    if (e.target.files && e.target.files.length > 0) {
      setShowAddMenu(false)
      // Would process file here
    }
  }

  const insertAction = (char: string) => {
    setLocalInput(prev => prev + char)
    setShowAddMenu(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#fafafa] text-[#171717]">
      {/* Hidden file inputs for system dialogs */}
      {/* Note: Folder input removed in favor of window.showDirectoryPicker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
        accept="image/*,application/pdf" 
        multiple 
      />
      
      {/* SIDEBAR */}
      <aside className="w-[280px] shrink-0 bg-[#fafafa] border-r border-[#e5e5e5] flex flex-col justify-between hidden md:flex select-none">
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Workspace Header (Draggable for frameless desktop) */}
          <div className="h-[56px] flex items-center justify-between px-3 shrink-0" style={{ WebkitAppRegion: 'drag' } as any}>
            <div className="relative workspace-dropdown-container">
              <button 
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                style={{ WebkitAppRegion: 'no-drag' } as any}
                className="flex items-center hover:bg-[#f0f0f0] p-1.5 rounded-md transition-colors text-[14px] font-medium text-[#171717]"
              >
                <div className="w-[24px] h-[24px] rounded-full bg-[#2563eb] flex items-center justify-center text-white mr-2.5 shadow-sm">
                  <Globe className="w-[14px] h-[14px] opacity-90" strokeWidth={2} />
                </div>
                <span className="truncate max-w-[120px]">{userEmail ? userEmail.split('@')[0] : 'Workspace'}</span>
                <ChevronsUpDown className="w-4 h-4 text-[#a3a3a3] ml-1.5 shrink-0" strokeWidth={2} />
              </button>
              
              {showWorkspaceMenu && (
                <div className="absolute top-[100%] left-0 mt-1 w-[200px] bg-[#f4f4f4] rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#e5e5e5] flex flex-col z-50 py-2">
                  <button onClick={() => { setShowWorkspaceMenu(false); setIsTeamModalOpen(true); }} className="w-full flex items-center gap-3 px-3 py-[7px] text-[13px] text-[#525252] hover:bg-[#e5e5e5] text-left transition-colors font-medium">
                    <Users className="w-4 h-4" /> Add Team
                  </button>
                </div>
              )}
            </div>
            <button className="p-1.5 hover:bg-[#f0f0f0] rounded-md text-[#525252] transition-colors" style={{ WebkitAppRegion: 'no-drag' } as any}>
              <Sidebar className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
          </div>

          {/* New Chat Button (Split Button) */}
          <div className="px-3 pb-4">
            <div className="flex w-full bg-white hover:bg-[#f9f9f9] rounded-[8px] border border-[#e5e5e5] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => { setMessages([]); setLocalInput(""); }}
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
              <div className="px-2 pt-2 pb-1 text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider">
                Departments
              </div>
              <NavItem 
                icon={<Search className="w-[18px] h-[18px]" strokeWidth={2} />} 
                label="Software" 
                active={selectedDept === "Software"} 
                onClick={() => setSelectedDept("Software")} 
                onAddClick={(e) => { e.stopPropagation(); handleFolderSelect() }}
              />
              <NavItem 
                icon={<Home className="w-[18px] h-[18px]" strokeWidth={2} />} 
                label="Marketing" 
                active={selectedDept === "Marketing"} 
                onClick={() => setSelectedDept("Marketing")} 
                onAddClick={(e) => { e.stopPropagation(); handleFolderSelect() }}
              />
              <NavItem 
                icon={<LayoutGrid className="w-[18px] h-[18px]" strokeWidth={2} />} 
                label="Growth" 
                active={selectedDept === "Growth"} 
                onClick={() => setSelectedDept("Growth")} 
                onAddClick={(e) => { e.stopPropagation(); handleFolderSelect() }}
              />
              <NavItem 
                icon={<MessageSquare className="w-[18px] h-[18px]" strokeWidth={2} />} 
                label="Sales" 
                active={selectedDept === "Sales"} 
                onClick={() => setSelectedDept("Sales")} 
                onAddClick={(e) => { e.stopPropagation(); handleFolderSelect() }}
              />
              <NavItem 
                icon={<PenTool className="w-[18px] h-[18px]" strokeWidth={2} />} 
                label="Purchasing" 
                active={selectedDept === "Purchasing"} 
                onClick={() => setSelectedDept("Purchasing")} 
                onAddClick={(e) => { e.stopPropagation(); handleFolderSelect() }}
              />
              <NavItem 
                icon={<FileText className="w-[18px] h-[18px]" strokeWidth={2} />} 
                label="Business" 
                active={selectedDept === "Business"} 
                onClick={() => setSelectedDept("Business")} 
                onAddClick={(e) => { e.stopPropagation(); handleFolderSelect() }}
              />
            </div>

            {/* Projects Section */}
            <div className="mt-6">
              <div className="px-4 text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                Projects - {selectedDept}
                <div className="flex items-center gap-1">
                  <button className="text-[#a3a3a3] hover:text-[#525252]"><LayoutGrid className="w-3.5 h-3.5" /></button>
                  <button onClick={handleFolderSelect} className="text-[#a3a3a3] hover:text-[#525252] transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="px-2 space-y-[2px]">
                
                {projects.map(proj => (
                  <button 
                    key={proj.id}
                    onClick={() => setSelectedProject(proj.name)}
                    className={`w-full flex items-center justify-between px-2 py-[7px] text-[13px] font-medium rounded-md transition-colors text-left group mt-1 ${
                      selectedProject === proj.name ? "bg-[#e5e5e5] text-[#171717]" : "text-[#525252] hover:bg-[#f0f0f0]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selectedProject === proj.name ? "text-[#171717]" : "text-[#a3a3a3]"}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                      {proj.name}
                    </div>
                    <span className="text-[11px] text-[#a3a3a3] font-normal opacity-0 group-hover:opacity-100 transition-opacity">{proj.time}</span>
                  </button>
                ))}

                {projects.length === 0 && (
                  <div className="px-3 py-2 mt-1 text-[12px] text-[#a3a3a3] italic">
                    No projects yet.
                  </div>
                )}

              </div>
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
                {messages.length === 0 ? (
                  <div className="px-2 py-2 text-[12px] text-[#a3a3a3] italic">
                    No recent chats yet.
                  </div>
                ) : (
                  <>
                    <ChatNavItem label={userEmail ? `${userEmail.split('@')[0]}'s Idea Session` : "Current Session"} />
                    <button className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#f0f0f0] rounded-md transition-colors text-left group mt-1">
                      <MoreHorizontal className="w-[18px] h-[18px] shrink-0 text-[#737373] group-hover:text-[#525252] transition-colors" strokeWidth={2} />
                      <span className="truncate">More</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-3 bg-[#fafafa]">
          {/* User Profile */}
          <div className="flex items-center justify-between mt-2">
            <button 
              onClick={() => { setSettingsTab("account"); setIsSettingsOpen(true); }}
              className="flex items-center gap-2 hover:bg-[#f0f0f0] p-1.5 rounded-md transition-colors text-[14px] font-medium text-[#171717]"
            >
              <div className="w-[24px] h-[24px] rounded-full bg-gradient-to-br from-[#4f46e5] to-[#818cf8] flex items-center justify-center border border-[#c7d2fe] overflow-hidden relative shadow-sm">
                <div className="absolute bottom-0 w-3.5 h-2 bg-[#4f46e5] rounded-t-sm" />
              </div>
              <span className="truncate max-w-[100px]">{userEmail ? userEmail.split('@')[0] : 'User'}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 bg-white border border-[#e5e5e5] rounded-[6px] text-[13px] font-semibold text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                $0
              </div>
              <button 
                onClick={() => { setSettingsTab("general"); setIsSettingsOpen(true); }}
                className="p-1.5 text-[#737373] hover:text-[#171717] hover:bg-[#e5e5e5] rounded-md transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#fafafa]">
        
        {/* Chat History Canvas (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full pt-6 pb-48">
          <div className="max-w-[672px] mx-auto space-y-6">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                {/* Empty container for layout */}
              </div>
            ) : (
              <>
              {messages.map((message) => {
                const isUser = message.role === "user";
                const date = new Date(parseInt(message.id));
                const timeString = isNaN(date.getTime()) ? "18:41" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1 w-full"
                >
                  <div className="flex-1 overflow-hidden">
                    {isUser ? (
                      <div className="flex justify-end">
                        <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[24px] rounded-br-sm px-5 py-3.5 inline-block prose prose-sm max-w-[85%] text-[#171717] prose-p:leading-relaxed shadow-sm mt-1">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        {message.content === "" && (
                          <div className="text-[13px] text-[#737373] mb-1 pl-1">Working...</div>
                        )}
                        <div className="pt-1 w-full">
                          <AntigravityMarkdown content={message.content} />
                        </div>
                      </div>
                    )}
                  </div>
                  {!isUser && message.content !== "" && (
                    <div className="flex items-center space-x-3 text-[#a3a3a3] text-[13px] mt-2 mb-4 pl-1">
                      <span>{timeString}</span>
                      <button className="hover:text-[#737373] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                      <button className="hover:text-[#737373] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></button>
                      <button className="hover:text-[#737373] transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg></button>
                    </div>
                  )}
                </motion.div>
                );
              })}

              {/* Error Message Display */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 mt-4"
                >
                  <div className="flex-1 space-y-1.5 overflow-hidden">
                    <div className="font-semibold text-[15px] text-red-600 pl-1">
                      IdeaAI (System Error)
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-[20px] rounded-tl-sm px-5 py-3.5 inline-block text-sm text-red-700 mt-1">
                      {(() => {
                        try {
                          const parsed = JSON.parse(error.message);
                          return parsed.error || error.message;
                        } catch {
                          return error.message || "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.";
                        }
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Animated Loading Indicator for IdeaAI */}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1 w-full mt-2 pl-1"
                >
                  <div className="flex items-center text-[#737373] text-[15px]">
                    Working
                    <div className="flex items-center space-x-[2px] ml-1 mt-1">
                      <motion.div className="w-[3px] h-[3px] bg-[#737373] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-[3px] h-[3px] bg-[#737373] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-[3px] h-[3px] bg-[#737373] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              </>
            )}
            
            {/* Auto scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className={`absolute left-0 right-0 px-4 pb-8 transition-all duration-500 ease-in-out flex justify-center ${
          messages.length === 0 ? "top-[42%] -translate-y-1/2" : "bottom-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/95 to-transparent pt-12"
        }`}>
          <div className="w-full max-w-[800px]">
            
            {/* Hero Heading attached directly to the top of the input box */}
            {messages.length === 0 && (
              <h1 className="text-center text-[32px] font-semibold tracking-tight text-[#171717] mb-7 font-sans">
                What do you want to create?
              </h1>
            )}

            {/* Folder Selection Context above the input */}
            {selectedProject && (
              <div className="flex items-center gap-2 mb-2 ml-2 text-[#737373] text-[13px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                <span>{selectedProject}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            )}

            <form 
              onSubmit={handleCustomSubmit}
              className={`w-full bg-[#f4f4f4] rounded-[24px] border-none transition-all duration-300 flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${
                isFocused ? "shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-[#d4d4d4]" : ""
              }`}
            >
              <div className="p-3 flex flex-col relative bg-[#f4f4f4] rounded-t-[24px]">
                
                {/* Textarea */}
                <div className="px-1 pt-1 pb-2">
                  <textarea
                    ref={textareaRef}
                    name="message"
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask anything, @ to mention, / for actions"
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[44px] max-h-[300px] text-[#171717] placeholder:text-[#a3a3a3] text-[15px] leading-relaxed font-sans"
                    rows={1}
                  />
                </div>
                
                <div className="flex items-center justify-between ml-1 pb-1">
                  {/* Left Actions */}
                  <div className="flex items-center gap-1.5 relative">
                    <button 
                      ref={addBtnRef}
                      type="button" 
                      onClick={() => setShowAddMenu(!showAddMenu)}
                      className={`p-1.5 rounded-full transition-colors ${
                        showAddMenu ? "bg-[#e5e5e5] text-[#171717]" : "text-[#737373] hover:text-[#171717] hover:bg-[#e5e5e5]"
                      }`}
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </button>

                    {/* Popover Menu for + button */}
                    {showAddMenu && (
                      <div ref={addMenuRef} className="absolute bottom-[calc(100%+12px)] left-[-4px] mb-1 w-[200px] bg-[#f4f4f4] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#e5e5e5] flex flex-col z-50 py-2">
                        <div className="px-3 pb-2 pt-1 text-[13px] font-semibold text-[#737373]">
                          Add Context
                        </div>
                        <button onClick={handleFolderSelect} className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#e5e5e5] text-left transition-colors">
                          <LayoutGrid className="w-[18px] h-[18px] text-[#525252]" strokeWidth={1.5} /> New Project
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#e5e5e5] text-left transition-colors">
                          <ImageIcon className="w-[18px] h-[18px] text-[#525252]" strokeWidth={1.5} /> Media
                        </button>
                        <button onClick={() => insertAction('@')} className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#e5e5e5] text-left transition-colors">
                          <span className="text-[#525252] text-[17px] leading-none w-[18px] text-center font-normal">@</span> Mentions
                        </button>
                        <button onClick={() => insertAction('/')} className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#e5e5e5] text-left transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#525252]"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Actions
                        </button>
                        <button onClick={() => setShowAddMenu(false)} className="w-full flex items-center gap-3 px-3 py-[7px] text-[14px] text-[#525252] hover:bg-[#e5e5e5] text-left transition-colors">
                          <Globe className="w-[18px] h-[18px] text-[#525252]" strokeWidth={1.5} /> Browser
                        </button>
                      </div>
                    )}
                    
                    <div className="relative">
                      <button 
                        ref={modelBtnRef}
                        type="button" 
                        onClick={() => setShowModelMenu(!showModelMenu)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors text-[13px] font-medium ${
                          showModelMenu ? "bg-[#e5e5e5] text-[#171717]" : "hover:bg-white text-[#525252]"
                        }`}
                      >
                        {selectedModel}
                        <ChevronDown className="w-3.5 h-3.5 text-[#a3a3a3]" strokeWidth={2.5} />
                      </button>

                      {showModelMenu && (
                        <div ref={modelMenuRef} className="absolute bottom-[calc(100%+12px)] left-0 mb-1 w-[240px] bg-[#f4f4f4] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#e5e5e5] flex flex-col z-50 py-2">
                          <div className="px-3 pb-2 pt-1 text-[13px] font-semibold text-[#737373]">
                            Model
                          </div>
                          <button onClick={() => { setSelectedModel("Gemini 3.1 Pro High"); setShowModelMenu(false) }} className={`w-full flex items-center justify-between px-3 py-[7px] text-[14px] text-left transition-colors ${selectedModel === "Gemini 3.1 Pro High" ? "bg-[#e5e5e5] text-[#171717]" : "text-[#525252] hover:bg-[#e5e5e5]"}`}>
                            <span>Gemini 3.1 Pro High</span>
                          </button>
                          <button onClick={() => { setSelectedModel("Gemini 3.1 Flash"); setShowModelMenu(false) }} className={`w-full flex items-center justify-between px-3 py-[7px] text-[14px] text-left transition-colors ${selectedModel === "Gemini 3.1 Flash" ? "bg-[#e5e5e5] text-[#171717]" : "text-[#525252] hover:bg-[#e5e5e5]"}`}>
                            <span>Gemini 3.1 Flash</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (isListening) return;
                        setIsListening(true);
                        setTimeout(() => {
                          setLocalInput(prev => (prev ? prev + " " : "") + "What are the latest UI trends for AI agents?");
                          setIsListening(false);
                          textareaRef.current?.focus();
                        }, 2000);
                      }}
                      className={`p-1.5 rounded-full transition-colors relative ${isListening ? 'text-red-500 bg-red-50' : 'text-[#a3a3a3] hover:text-[#525252]'}`}
                    >
                       <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} strokeWidth={2} />
                       {isListening && (
                         <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#171717] text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap">
                           Listening...
                         </span>
                       )}
                    </button>
                    
                    {isLoading ? (
                      <button 
                        type="button"
                        onClick={stop}
                        className="flex items-center justify-center w-[32px] h-[32px] rounded-full transition-all bg-red-100 text-red-600 hover:bg-red-200 mr-1"
                      >
                        <StopCircle className="w-[18px] h-[18px]" strokeWidth={2} />
                      </button>
                    ) : (
                      <button 
                        type="submit"
                        disabled={!localInput.trim()}
                        className={`flex items-center justify-center w-[36px] h-[36px] rounded-full transition-all shadow-sm mr-1 ${
                          localInput.trim() 
                            ? "bg-[#1a73e8] text-white hover:bg-[#1557b0]" 
                            : "bg-[#e5e5e5] text-[#a3a3a3] cursor-not-allowed"
                        }`}
                      >
                         <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer row inside the text card */}
              <div className="w-full bg-[#ebebeb] px-4 py-2 flex items-center justify-between text-[#737373] text-[12px] font-medium rounded-b-[24px]">
                <button className="flex items-center gap-1.5 hover:text-[#171717] transition-colors">
                   <LayoutGrid className="w-3.5 h-3.5" />
                   Local
                   <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#171717] transition-colors">
                   Main Agent
                   <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <div className="w-full flex justify-center mt-3">
              <a 
                href="mailto:support@togetlink.com?subject=Report%20Inappropriate%20AI%20Content" 
                className="text-[11px] text-[#a3a3a3] hover:text-[#737373] transition-colors flex items-center gap-1"
                title="Report inappropriate content generated by AI"
              >
                Report an Issue with AI-Generated Content
              </a>
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

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsTab}
        userEmail={userEmail}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        userEmail={userEmail}
      />
    </div>
  )
}

function NavItem({ icon, label, active = false, onClick, onAddClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, onAddClick?: (e: React.MouseEvent) => void }) {
  return (
    <div className={`w-full flex items-center justify-between px-3 py-[7px] text-[14px] rounded-md transition-colors group ${
      active ? "bg-[#f0f0f0] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#f0f0f0]"
    }`}>
      <button onClick={onClick} className="flex flex-1 items-center gap-3 text-left">
        <span className={active ? "text-[#171717]" : "text-[#737373] group-hover:text-[#525252] transition-colors"}>
          {icon}
        </span>
        {label}
      </button>
      {active && onAddClick && (
        <button onClick={onAddClick} className="p-0.5 rounded-sm text-[#737373] hover:text-[#171717] hover:bg-[#e5e5e5] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
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

function ProjectItem({ label, time, active = false, onClick }: { label: string, time: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-[5px] text-[13px] rounded-md transition-colors text-left group ${
      active ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#f0f0f0]"
    }`}>
      <span className="truncate flex-1 pr-2">{label}</span>
      <span className="text-[11px] text-[#a3a3a3]">{time}</span>
    </button>
  )
}



