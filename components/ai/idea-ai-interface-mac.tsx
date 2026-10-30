"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AntigravityMarkdown } from "./antigravity-markdown"
import { AgentBridge } from "@/app/utils/agent-bridge"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { SettingsModal } from "./settings-modal"
import { TeamModal } from "./team-modal"
import { ConstitutionalModalMac } from "./constitutional-modal-mac"

// ==========================================
// BESPOKE MINIMALIST SVG ICONS (NO LUCIDE)
// ==========================================

const IdeaAILogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="/Gemini_Generated_Image_dpurc9dpurc9dpur-removebg-preview.png"
    alt="IdeaAI"
    className={`${className} rounded-md object-cover`}
  />
)

const SearchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

const SidebarCollapseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="4" />
    <path d="M9 3v18" />
  </svg>
)

const PlusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const ComputerIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="12" x="3" y="4" rx="2.5" />
    <path d="M7 16h10" />
    <path d="M12 16v4" />
    <path d="M8 20h8" />
  </svg>
)

const AutomationsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
)

const ArtifactsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3 8 4-8 4-8-4z" />
    <path d="m4 11 8 4 8-4" />
    <path d="m4 16 8 4 8-4" />
  </svg>
)

const CustomizeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.5a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ChevronDownIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const ChevronRightIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const MicIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
)

const AudioWaveIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="4" y1="10" y2="14" />
    <line x1="8" x2="8" y1="6" y2="18" />
    <line x1="12" x2="12" y1="3" y2="21" />
    <line x1="16" x2="16" y1="7" y2="17" />
    <line x1="20" x2="20" y1="10" y2="14" />
  </svg>
)

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ArrowUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="19" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
)

const StopIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="5" y="5" rx="2" />
  </svg>
)

const MoonIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

const TerminalIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
)

const GitHubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
)

type Project = {
  id: string
  name: string
  files: string[]
  time: string
}

type ChatMessage = {
  id: string
  role: string
  content: string
}

type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
}

const CHAT_HISTORY_KEY = "ideaai_chat_history"
const CURRENT_CHAT_KEY = "ideaai_current_chat"

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function sessionTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === "user")
  return firstUserMessage?.content?.trim().slice(0, 48) || "Current conversation"
}

export function IdeaAIInterfaceMac() {
  const [hasHydrated, setHasHydrated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  const [showModelMenu, setShowModelMenu] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Azure Enterprise Cloud (Llama 3.2)")

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("models")
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null)
  const [isConstitutionalModalOpen, setIsConstitutionalModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

  const [selectedRepo, setSelectedRepo] = useState("Connect GitHub")
  const [githubRepos, setGithubRepos] = useState<any[]>([])
  const [isConnectingGithub, setIsConnectingGithub] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const [showRepoMenu, setShowRepoMenu] = useState(false)
  const [nightShiftEnabled, setNightShiftEnabled] = useState(false)

  // Accordion states
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [recentsOpen, setRecentsOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const folderInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [localInput, setLocalInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready')
  const [thinkingSeconds, setThinkingSeconds] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const thinkingStartedAtRef = useRef<number | null>(null)

  useEffect(() => {
    const storedActiveChatId = localStorage.getItem("ideaai_active_chat") || `chat-${Date.now()}`
    setProjects(readStoredJson<Project[]>("ideaai_projects", []))
    setChatSessions(readStoredJson<ChatSession[]>(CHAT_HISTORY_KEY, []))
    setMessages(readStoredJson<ChatMessage[]>(CURRENT_CHAT_KEY, []))
    setActiveChatId(storedActiveChatId)
    setNightShiftEnabled(localStorage.getItem("ideaai_night_shift") === "enabled")
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (hasHydrated) localStorage.setItem('ideaai_projects', JSON.stringify(projects))
  }, [projects, hasHydrated])

  useEffect(() => {
    if (hasHydrated && activeChatId) {
      localStorage.setItem(CURRENT_CHAT_KEY, JSON.stringify(messages))
      localStorage.setItem("ideaai_active_chat", activeChatId)
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeChatId, hasHydrated])

  useEffect(() => {
    if (status !== "submitted") return
    const timer = window.setInterval(() => {
      if (thinkingStartedAtRef.current) {
        setThinkingSeconds(Math.max(1, Math.round((Date.now() - thinkingStartedAtRef.current) / 1000)))
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (!hasHydrated || !activeChatId || messages.length === 0) return
    setChatSessions((previous) => {
      const nextSession: ChatSession = {
        id: activeChatId,
        title: sessionTitle(messages),
        messages,
        updatedAt: Date.now(),
      }
      const withoutCurrent = previous.filter((session) => session.id !== activeChatId)
      const next = [nextSession, ...withoutCurrent].slice(0, 30)
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [messages, activeChatId, hasHydrated])

  useEffect(() => {
    if (!hasHydrated || messages.length === 0 || chatSessions.length > 0) return
    const migratedSession: ChatSession = {
      id: activeChatId,
      title: sessionTitle(messages),
      messages,
      updatedAt: Date.now(),
    }
    setChatSessions([migratedSession])
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify([migratedSession]))
  }, [messages, activeChatId, chatSessions.length, hasHydrated])

  useEffect(() => {
    if (!hasHydrated || messages.length > 0 || !activeChatId) return
    const storedSession = chatSessions.find((session) => session.id === activeChatId)
    if (storedSession) setMessages(storedSession.messages)
  }, [activeChatId, chatSessions, messages.length, hasHydrated])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email)
        setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || "User")
      } else {
        setUserEmail(null)
        setUserName(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const stop = () => {
    abortControllerRef.current?.abort()
    setStatus('ready')
  }

  const handleMicClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (status === 'submitted') {
      stop()
      return
    }

    if (localInput.trim() && !isListening) {
      handleCustomSubmit()
      return
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setLocalInput((prev) => prev + (prev ? " " : "") + transcript)
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
    }
  }

  const sendMessage = async (message: any) => {
    const newMessages = [...messages, message]
    setMessages(newMessages)
    setStatus('submitted')
    thinkingStartedAtRef.current = Date.now()
    setThinkingSeconds(0)
    setError(null)

    abortControllerRef.current = new AbortController()

    try {
      const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('ideaai_api_key') || '' : ''

      // Local Electron Engine
      if (selectedModel === "Local Engine (Ollama)" && AgentBridge.isElectron()) {
        const currentProject = projects.find(p => p.name === selectedProject)
        const currentPath = currentProject && currentProject.files.length > 0 ? currentProject.files[0] : "Unknown"

        const systemPrompt = {
          role: "system",
          content: `You are IdeaAI, an autonomous senior engineering agent executing locally.
CURRENT WORKSPACE PATH: ${currentPath}

To create or modify files, output inside this exact XML format:
<write_file path="${currentPath !== "Unknown" ? currentPath : "C:/absolute/path"}/filename.extension">
your code here
</write_file>`
        }

        setTerminalOutput("➜  ~ Analyzing codebase architecture...")
        const localResult = await AgentBridge.askLocalAI([systemPrompt, ...newMessages])

        if (localResult.success) {
          let responseText = localResult.text
          const duration = Math.max(1, Math.round((Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000))
          responseText = `Thought for ${duration}s\n${responseText}`
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: responseText }])
          setStatus('ready')
          setTerminalOutput("✔ Local task finished.")
          if (localStorage.getItem("ideaai_desktop_notifications") === "enabled" && "Notification" in window && Notification.permission === "granted") {
            new Notification("IdeaAI task complete", { body: "Your local engineering task has finished." })
          }
          return
        }
      }

      // Cloud Azure or Fallback API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': storedApiKey,
        },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Server responded with ${res.status}`)
      }

      const data = await res.json()
      const duration = Math.max(1, Math.round((Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000))
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Thought for ${duration}s\n${data.response}`
      }])
      setStatus('ready')
      if (localStorage.getItem("ideaai_desktop_notifications") === "enabled" && "Notification" in window && Notification.permission === "granted") {
        new Notification("IdeaAI task complete", { body: "Your engineering task has finished." })
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatus('ready')
        return
      }
      setError(err)
      setStatus('error')
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**Execution Error:** ${err.message}`
      }])
    }
  }

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!localInput.trim()) return

    sendMessage({
      id: Date.now().toString(),
      role: 'user',
      content: localInput
    })
    setLocalInput("")
  }

  const startNewChat = () => {
    const nextChatId = `chat-${Date.now()}`
    setActiveChatId(nextChatId)
    setMessages([])
    setLocalInput("")
    localStorage.setItem(CURRENT_CHAT_KEY, "[]")
    localStorage.setItem("ideaai_active_chat", nextChatId)
  }

  const openChat = (session: ChatSession) => {
    setActiveChatId(session.id)
    setMessages(session.messages)
    setLocalInput("")
    localStorage.setItem(CURRENT_CHAT_KEY, JSON.stringify(session.messages))
    localStorage.setItem("ideaai_active_chat", session.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleCustomSubmit()
    }
  }

  const handleFolderSelect = async () => {
    try {
      if (AgentBridge.isElectron()) {
        const result = await AgentBridge.selectDirectory()
        if (result.success && result.path) {
          const folderName = result.path.split(/[/\\]/).pop() || result.path
          const newProject: Project = {
            id: Date.now().toString(),
            name: folderName,
            files: [result.path],
            time: "Just now"
          }
          setProjects(prev => [...prev, newProject])
          setSelectedProject(newProject.name)
        }
      } else if ('showDirectoryPicker' in window) {
        const directoryHandle = await (window as any).showDirectoryPicker({ mode: 'read' })
        const newProject: Project = {
          id: Date.now().toString(),
          name: directoryHandle.name,
          files: [],
          time: "Just now"
        }
        setProjects(prev => [...prev, newProject])
        setSelectedProject(newProject.name)
      } else {
        folderInputRef.current?.click()
      }
    } catch (err) {
      console.log('Folder selection cancelled', err)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const newProject: Project = {
        id: Date.now().toString(),
        name: file.name,
        files: [file.name],
        time: "Just now"
      }
      setProjects(prev => [...prev, newProject])
      setSelectedProject(newProject.name)
    }
  }

  const handleConnectGithub = () => {
    setIsConnectingGithub(true)
    setTimeout(() => {
      setIsConnectingGithub(false)
      setGithubConnected(true)
      setSelectedRepo("ideaai-production")
      setShowRepoMenu(false)
    }, 1200)
  }

  return (
    <div 
      className="flex h-screen w-full bg-[#ffffff] text-[#171717] overflow-hidden select-none"
      style={{ fontFamily: "'Google Sans', 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <input type="file" ref={folderInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

      {/* ========================================================= */}
      {/* LEFT SIDEBAR (#f3f3f3, rgba(243, 243, 243), hsl(0, 0, 95)) */}
      {/* ========================================================= */}
      <aside className={`${sidebarCollapsed ? "w-[64px]" : "w-[260px]"} bg-[#f3f3f3] border-r border-[#e5e5e5] flex flex-col shrink-0 justify-between transition-[width] duration-200`}>
        
        {/* Top Header & Navigation */}
        <div className="flex flex-col p-3">
          
          {/* Logo & Quick Action Buttons */}
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} px-2 pt-1 pb-4`}>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={startNewChat}>
              <IdeaAILogo className="w-6 h-6" />
              {!sidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight text-[#171717]">IdeaAI</span>}
            </div>
            
            <div className={`flex items-center gap-1.5 text-[#737373] ${sidebarCollapsed ? "absolute left-[40px]" : ""}`}>
              <button 
                onClick={() => textareaRef.current?.focus()}
                title="Search"
                className={`${sidebarCollapsed ? "hidden" : ""} p-1.5 rounded-md hover:bg-[#e8e8e8] hover:text-[#171717] transition-colors`}
              >
                <SearchIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setSidebarCollapsed(value => !value)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="p-1.5 rounded-md hover:bg-[#e8e8e8] hover:text-[#171717] transition-colors"
              >
                <SidebarCollapseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Sidebar Menu Items */}
          <div className="space-y-0.5 mb-5">
            <button
              onClick={startNewChat}
              title="New chat"
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#171717] hover:bg-[#eaeaea] transition-colors text-left`}
            >
              <PlusIcon className="w-4 h-4 text-[#525252]" />
              {!sidebarCollapsed && <span>New</span>}
            </button>

            <button
              onClick={() => {
                setSelectedModel("Local Engine (Ollama)")
                setNightShiftEnabled(true)
                localStorage.setItem("ideaai_night_shift", "enabled")
                setTerminalOutput("➜  ~ Switched to local Computer execution.")
              }}
              title="Computer"
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#404040] hover:bg-[#eaeaea] hover:text-[#171717] transition-colors text-left`}
            >
              <ComputerIcon className="w-4 h-4 text-[#525252]" />
              {!sidebarCollapsed && <span>Computer</span>}
            </button>

            <button
              onClick={() => setIsConstitutionalModalOpen(true)}
              title="Automations"
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#404040] hover:bg-[#eaeaea] hover:text-[#171717] transition-colors text-left`}
            >
              <AutomationsIcon className="w-4 h-4 text-[#525252]" />
              {!sidebarCollapsed && <span>Automations</span>}
            </button>

            <button
              onClick={() => setIsTeamModalOpen(true)}
              title="Artifacts"
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#404040] hover:bg-[#eaeaea] hover:text-[#171717] transition-colors text-left`}
            >
              <ArtifactsIcon className="w-4 h-4 text-[#525252]" />
              {!sidebarCollapsed && <span>Artifacts</span>}
            </button>

            <button
              onClick={() => { setSettingsTab("models"); setIsSettingsOpen(true); }}
              title="Customize"
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#404040] hover:bg-[#eaeaea] hover:text-[#171717] transition-colors text-left`}
            >
              <CustomizeIcon className="w-4 h-4 text-[#525252]" />
              {!sidebarCollapsed && <span>Customize</span>}
            </button>
          </div>

          {/* Section: Projects (Accordion) */}
          <div className={`mb-4 ${sidebarCollapsed ? "hidden" : ""}`}>
            <button 
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-[#8a8a8a] uppercase tracking-wider hover:text-[#171717] transition-colors"
            >
              <span>Projects</span>
              <div className="flex items-center gap-1">
                <span 
                  onClick={(e) => { e.stopPropagation(); handleFolderSelect(); }}
                  className="p-0.5 hover:text-[#171717] cursor-pointer"
                  title="Add folder"
                >
                  <PlusIcon className="w-3 h-3" />
                </span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${projectsOpen ? '' : '-rotate-90'}`} />
              </div>
            </button>

            {projectsOpen && (
              <div className="mt-1 space-y-0.5">
                {projects.length === 0 ? (
                  <div className="px-3 py-1.5 text-[12px] text-[#a3a3a3]">
                    No projects yet
                  </div>
                ) : (
                  projects.map(proj => (
                    <div 
                      key={proj.id}
                      onClick={() => setSelectedProject(proj.name)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors ${
                        selectedProject === proj.name ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#eaeaea]"
                      }`}
                    >
                      <span className="truncate">{proj.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section: Recents / Sessions (Accordion) */}
          <div className={sidebarCollapsed ? "hidden" : ""}>
            <button 
              onClick={() => setRecentsOpen(!recentsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-[#8a8a8a] uppercase tracking-wider hover:text-[#171717] transition-colors"
            >
              <span>Recents</span>
              <ChevronDownIcon className={`w-3 h-3 transition-transform ${recentsOpen ? '' : '-rotate-90'}`} />
            </button>

            {recentsOpen && (
              <div className="mt-1 space-y-0.5">
                {chatSessions.length === 0 ? (
                  <div className="px-3 py-1.5 text-[12px] text-[#a3a3a3]">
                    No recent chats
                  </div>
                ) : (
                  chatSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => openChat(session)}
                      className={`w-full px-3 py-1.5 rounded-md text-left text-[12px] truncate transition-colors ${
                        activeChatId === session.id
                          ? "bg-[#e5e5e5] text-[#171717] font-medium"
                          : "text-[#525252] hover:bg-[#eaeaea]"
                      }`}
                    >
                      {session.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className={`p-3 border-t border-[#e5e5e5] space-y-2 ${sidebarCollapsed ? "hidden" : ""}`}>
          {/* View Plans Pill Button (#f7f7f4) */}
          <button 
            onClick={() => { setSettingsTab("account"); setIsSettingsOpen(true); }}
            className="w-full py-1.5 px-3 bg-[#f7f7f4] hover:bg-[#ebebe7] border border-[#e5e5e5] rounded-full text-[12px] font-medium text-[#404040] hover:text-[#171717] transition-all flex items-center justify-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            View plans
          </button>

          {/* Sign In / Profile Row */}
          <div 
            onClick={() => {
              if (!userEmail) window.location.href = "/matrix-demo/app/login"
              else setIsSettingsOpen(true)
            }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-[#eaeaea] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center text-[12px] font-semibold text-[#171717]">
                {userEmail ? userEmail[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5 text-[#525252]" />}
              </div>
              <span className="text-[13px] font-medium text-[#171717] truncate">
                {userEmail || "Sign in"}
              </span>
            </div>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#8a8a8a]" />
          </div>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEW AREA                                            */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col bg-[#ffffff] relative overflow-hidden">
        
        {/* Top Utility Header Bar */}
        <header className="h-12 border-b border-[#f0f0f0] flex items-center justify-between px-6 shrink-0 bg-[#ffffff]">
          <div className="flex items-center gap-2 text-[12px] text-[#737373]">
            <span className="hover:text-[#171717] cursor-pointer font-medium">IdeaAI</span>
            <span>/</span>
            <span className="text-[#171717] font-medium">
              {selectedProject || "Workspace"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Night Protocol Pill */}
            <button 
              onClick={() => setIsConstitutionalModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f7f4] hover:bg-[#ebebe7] text-[#404040] hover:text-[#171717] rounded-md text-[12px] font-medium border border-[#e5e5e5] transition-colors"
            >
              <MoonIcon className="w-3.5 h-3.5 text-[#4f46e5]" />
              {nightShiftEnabled ? "Night Shift Active" : "Night Shift"}
            </button>

            {/* GitHub Connect Pill */}
            <div className="relative">
              <button 
                onClick={() => setShowRepoMenu(!showRepoMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f7f4] hover:bg-[#ebebe7] text-[#404040] hover:text-[#171717] rounded-md text-[12px] font-medium border border-[#e5e5e5] transition-colors"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
                <span>{selectedRepo}</span>
                <ChevronDownIcon className="w-3 h-3 opacity-60" />
              </button>

              {showRepoMenu && (
                <div className="absolute top-full right-0 mt-1.5 w-[260px] bg-[#ffffff] rounded-xl shadow-xl border border-[#e5e5e5] py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8a8a8a] uppercase tracking-wider border-b border-[#f0f0f0]">
                    Connected Repositories
                  </div>
                  {!githubConnected ? (
                    <div className="p-3">
                      <p className="text-[12px] text-[#525252] mb-3 leading-relaxed">
                        Connect your GitHub account for overnight commits and PR reviews.
                      </p>
                      <button
                        onClick={handleConnectGithub}
                        disabled={isConnectingGithub}
                        className="w-full flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#262626] text-white text-[12px] font-medium py-2 rounded-lg transition-colors"
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                        {isConnectingGithub ? "Connecting..." : "Connect GitHub"}
                      </button>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 text-[13px] font-medium text-[#171717] hover:bg-[#f2f2f2] rounded-md cursor-pointer">
                        ideaai-production
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================= */}
        {/* CENTER CONTENT: EMPTY STATE OR ACTIVE CONVERSATION       */}
        {/* ========================================================= */}
        {messages.length === 0 ? (
          
          <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
            <div className="w-full max-w-[700px] flex flex-col items-center text-center">
              
              {/* Category Kicker */}
              <div className="text-[12px] font-medium text-[#8a8a8a] tracking-wide mb-2 uppercase">
                Search & Build
              </div>

              {/* Main Headline */}
              <h1 className="text-[32px] md:text-[36px] font-semibold tracking-tight text-[#171717] mb-8">
                What would you like to build today?
              </h1>

              {/* Main Prompt Card (#f2f2f2, rgba(242, 242, 242), hsl(0, 0, 95)) */}
              <div className="w-full bg-[#f2f2f2] rounded-[20px] border border-[#e5e5e5] p-4 flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus-within:border-[#171717] transition-all">
                <textarea
                  ref={textareaRef}
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type @ to add context, files, or connectors"
                  className="w-full min-h-[95px] bg-transparent resize-none outline-none text-[15px] text-[#171717] placeholder:text-[#8a8a8a] leading-relaxed mb-3"
                />

                {/* Bottom Controls Row inside Prompt Card */}
                <div className="flex items-center justify-between pt-2 border-t border-[#e5e5e5]/60">
                  
                  {/* Left Controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleFolderSelect}
                      title="Add folder or file"
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#e5e5e5] text-[#525252] hover:text-[#171717] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>

                    {/* Search Pill (#f7f7f4) */}
                    <button 
                      onClick={() => textareaRef.current?.focus()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f7f4] hover:bg-[#ebebe7] border border-[#e5e5e5] rounded-full text-[12px] font-medium text-[#404040] transition-colors"
                    >
                      <SearchIcon className="w-3.5 h-3.5 text-[#525252]" />
                      <span>Search</span>
                      <ChevronDownIcon className="w-3 h-3 opacity-60 ml-0.5" />
                    </button>

                    {/* Computer Pill (#f7f7f4) */}
                    <button 
                      onClick={() => setSelectedModel("Local Engine (Ollama)")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f7f4] hover:bg-[#ebebe7] border border-[#e5e5e5] rounded-full text-[12px] font-medium text-[#404040] transition-colors"
                    >
                      <ComputerIcon className="w-3.5 h-3.5 text-[#525252]" />
                      <span>Computer</span>
                    </button>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    
                    {/* Model Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowModelMenu(!showModelMenu)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f7f4] hover:bg-[#ebebe7] border border-[#e5e5e5] rounded-full text-[12px] font-medium text-[#404040] transition-colors"
                      >
                        <span className="truncate max-w-[130px]">{selectedModel}</span>
                        <ChevronDownIcon className="w-3 h-3 opacity-60 ml-0.5" />
                      </button>

                      {showModelMenu && (
                        <div className="absolute bottom-full right-0 mb-2 w-[250px] bg-[#ffffff] rounded-xl shadow-xl border border-[#e5e5e5] py-1.5 z-50 text-left">
                          <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8a8a8a] uppercase tracking-wider">
                            Inference Engines
                          </div>
                          
                          <button 
                            onClick={() => { setSelectedModel("Azure Enterprise Cloud (Llama 3.2)"); setShowModelMenu(false); }}
                            className="w-full flex flex-col px-3 py-2 text-[12px] hover:bg-[#f2f2f2] text-[#171717] font-medium transition-colors text-left"
                          >
                            <span>Azure Enterprise Cloud (Llama 3.2)</span>
                            <span className="text-[10px] text-[#8a8a8a] font-normal">32GB RAM E-Class Azure VM</span>
                          </button>

                          <button 
                            onClick={() => { setSelectedModel("Local Engine (Ollama)"); setShowModelMenu(false); }}
                            className="w-full flex flex-col px-3 py-2 text-[12px] hover:bg-[#f2f2f2] text-[#171717] font-medium transition-colors text-left"
                          >
                            <span>Local Engine (Ollama)</span>
                            <span className="text-[10px] text-[#8a8a8a] font-normal">100% Offline & Private</span>
                          </button>

                          <button 
                            onClick={() => { setSelectedModel("Bring Your Own Key (BYOK)"); setShowModelMenu(false); }}
                            className="w-full flex flex-col px-3 py-2 text-[12px] hover:bg-[#f2f2f2] text-[#171717] font-medium transition-colors text-left"
                          >
                            <span>Bring Your Own Key (BYOK)</span>
                            <span className="text-[10px] text-[#8a8a8a] font-normal">OpenAI / Gemini Keys</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mic Button */}
                    <button 
                      onClick={handleMicClick}
                      title="Dictate voice prompt"
                      className={`w-8 h-8 flex items-center justify-center rounded-full border border-[#e5e5e5] transition-colors ${
                        isListening ? "bg-red-500 text-white animate-pulse" : "bg-[#f7f7f4] hover:bg-[#ebebe7] text-[#525252]"
                      }`}
                    >
                      <MicIcon className="w-4 h-4" />
                    </button>

                    {/* Submit / Audio Wave Circle Button */}
                    <button 
                      onClick={handleCustomSubmit}
                      disabled={!localInput.trim() && status !== 'submitted'}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                        localInput.trim() 
                          ? "bg-[#171717] text-white hover:scale-105" 
                          : "bg-[#171717] text-white opacity-85 hover:opacity-100"
                      }`}
                    >
                      {status === 'submitted' ? (
                        <StopIcon className="w-3.5 h-3.5 animate-pulse" />
                      ) : localInput.trim() ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <AudioWaveIcon className="w-3.5 h-3.5" />
                      )}
                    </button>

                  </div>

                </div>
              </div>

              {/* Two Suggestion Cards Below (#f2f2f2, hover #f7f7f4) */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4 text-left">
                
                {/* Card 1: Search Anything */}
                <div 
                  onClick={() => {
                    setLocalInput("Search across current repository architecture and find all references to authentication.")
                    textareaRef.current?.focus()
                  }}
                  className="bg-[#f2f2f2] hover:bg-[#f7f7f4] border border-[#e5e5e5] rounded-[16px] p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <SearchIcon className="w-4 h-4 text-[#525252] group-hover:text-[#171717]" />
                    <span className="text-[14px] font-semibold text-[#171717]">Search anything</span>
                  </div>
                  <p className="text-[12px] text-[#737373] leading-relaxed">
                    Get fast, accurate answers and deep codebase analysis from trusted sources.
                  </p>
                </div>

                {/* Card 2: Run Tasks with Computer (NEW) */}
                <div 
                  onClick={() => {
                    setSelectedModel("Local Engine (Ollama)")
                    setLocalInput("Delegate terminal and filesystem task: inspect package.json and run test suite.")
                    textareaRef.current?.focus()
                  }}
                  className="bg-[#f2f2f2] hover:bg-[#f7f7f4] border border-[#e5e5e5] rounded-[16px] p-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <ComputerIcon className="w-4 h-4 text-[#525252] group-hover:text-[#171717]" />
                    <span className="text-[14px] font-semibold text-[#171717]">Run tasks with Computer</span>
                    <span className="bg-[#dcfce7] text-[#15803d] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      NEW
                    </span>
                  </div>
                  <p className="text-[12px] text-[#737373] leading-relaxed">
                    Hand over engineering workflows to receive seamless outputs around the clock.
                  </p>
                </div>

              </div>

            </div>
          </div>

        ) : (
          
          /* Active Chat View */
          <div className="flex-1 flex flex-col w-full h-full pt-6 pb-28 px-4 md:px-12 max-w-4xl mx-auto overflow-y-auto">
            <div className="flex-1 space-y-6 pb-12">
              {messages.map((message, i) => (
                <motion.div 
                  key={message.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] text-[14px] leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-[18px] bg-[#f2f2f2] px-5 py-3.5 text-[#171717] border border-[#e5e5e5]'
                      : 'text-[#171717]'
                  }`}>
                    <AntigravityMarkdown content={message.content} />
                  </div>
                </motion.div>
              ))}

              {status === 'submitted' && (
                <div className="flex items-center gap-2 text-[13px] text-[#737373] px-2 py-3 animate-pulse">
                  <IdeaAILogo className="w-5 h-5" />
                  <span>Thought for {Math.max(1, thinkingSeconds)}s</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Floating Input Card (#f2f2f2) */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center">
              <div className="w-full max-w-3xl bg-[#f2f2f2] rounded-[18px] border border-[#e5e5e5] p-3 shadow-lg flex flex-col focus-within:border-[#171717] transition-all">
                <textarea
                  ref={textareaRef}
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply to IdeaAI..."
                  className="w-full max-h-[140px] min-h-[44px] bg-transparent resize-none outline-none text-[14px] text-[#171717] placeholder:text-[#8a8a8a] mb-2"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleFolderSelect}
                      className="p-1.5 text-[#525252] hover:text-[#171717] rounded-md hover:bg-[#e5e5e5] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>

                    <div className="text-[12px] font-medium text-[#737373] px-2 py-0.5 bg-[#f7f7f4] border border-[#e5e5e5] rounded-md">
                      {selectedModel}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleMicClick}
                      className={`w-7 h-7 flex items-center justify-center rounded-full border border-[#e5e5e5] transition-colors ${
                        isListening ? "bg-red-500 text-white animate-pulse" : "bg-[#f7f7f4] text-[#525252]"
                      }`}
                    >
                      <MicIcon className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={handleCustomSubmit}
                      disabled={!localInput.trim() && status !== 'submitted'}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#171717] text-white hover:opacity-90 disabled:opacity-40 transition-all"
                    >
                      {status === 'submitted' ? (
                        <StopIcon className="w-3.5 h-3.5 animate-pulse" />
                      ) : (
                        <ArrowUpIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        )}

      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialTab={settingsTab} 
        userEmail={userEmail} 
      />

      <ConstitutionalModalMac 
        isOpen={isConstitutionalModalOpen} 
        onClose={() => setIsConstitutionalModalOpen(false)} 
      />

      <TeamModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
        userEmail={userEmail} 
      />
    </div>
  )
}
