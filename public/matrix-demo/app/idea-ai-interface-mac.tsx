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
// GOOGLE SANS FLEX FONT IMPORT
// ==========================================
const GoogleSansFlexLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@8..144,-10..0,25..150,400..500,0..100&display=swap" rel="stylesheet" />
  </>
)

// ==========================================
// BESPOKE MINIMALIST SVG ICONS (NO LUCIDE)
// ==========================================

const IdeaAILogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg"
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

// ==========================================
// DEVELOPER TOOL INTEGRATION ICONS
// ==========================================

const GmailIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
)

const CalendarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect x="2" y="3" width="20" height="19" rx="3" fill="#4285F4"/>
    <rect x="4" y="8" width="16" height="12" rx="1" fill="#fff"/>
    <rect x="6" y="10" width="3" height="2.5" rx="0.5" fill="#4285F4"/>
    <rect x="10.5" y="10" width="3" height="2.5" rx="0.5" fill="#4285F4"/>
    <rect x="15" y="10" width="3" height="2.5" rx="0.5" fill="#4285F4"/>
    <rect x="6" y="14.5" width="3" height="2.5" rx="0.5" fill="#4285F4"/>
    <rect x="10.5" y="14.5" width="3" height="2.5" rx="0.5" fill="#4285F4"/>
    <rect x="7" y="2" width="2" height="3" rx="1" fill="#4285F4"/>
    <rect x="15" y="2" width="2" height="3" rx="1" fill="#4285F4"/>
  </svg>
)

const DriveIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M8.267 14.68l-1.6 2.76H22.4l1.6-2.76z" fill="#4285F4"/>
    <path d="M8 3L1.6 14.68l1.6 2.76L15.2 3z" fill="#0F9D58"/>
    <path d="M15.2 3H8l6.4 11.68h7.2z" fill="#FFCD40"/>
  </svg>
)

const NotionIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.37 2.29c-.467-.374-.7-.187-1.587-.28L3.84 3.293c-.467.047-.56.28-.374.467l.993.748zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.886l-15.177.84c-.56.047-.747.327-.747.98zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.187c-.094-.187 0-.653.327-.747l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933l3.222-.187zM3.098 1.87L16.913.936c1.681-.14 2.102.28 2.803.793L23.15 4.16c.467.374.607.84.607 1.354v17.437c0 1.167-.42 1.821-1.915 1.914l-15.457.934c-1.12.047-1.681-.14-2.289-.84L1.107 21.2c-.7-.934-.84-1.634-.84-2.707V4.348c0-1.4.42-2.427 1.831-2.477z"/>
  </svg>
)

const SlackIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
    <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
    <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
    <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
  </svg>
)

const FigmaIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83"/>
    <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF"/>
    <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E"/>
    <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262"/>
    <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE"/>
  </svg>
)

const SupabaseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M13.7 21.8c-.4.5-1.3.2-1.3-.5V13h8.2c.9 0 1.4 1.1.8 1.8L13.7 21.8z" fill="url(#sb-a)"/>
    <path d="M10.3 2.2c.4-.5 1.3-.2 1.3.5V11H3.4c-.9 0-1.4-1.1-.8-1.8L10.3 2.2z" fill="#3ECF8E"/>
    <defs><linearGradient id="sb-a" x1="12.5" y1="14" x2="19" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#249361"/><stop offset="1" stopColor="#3ECF8E"/></linearGradient></defs>
  </svg>
)

const FirebaseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M4.53 20.27L6.18 3.72a.42.42 0 0 1 .78-.18l1.74 3.28L4.53 20.27z" fill="#FFA000"/>
    <path d="M12.69 10.37L10.83 6.7 8.7 6.82l2.3 4.38 1.69-.83z" fill="#F57C00"/>
    <path d="M19.47 20.27L17.6 5.21a.42.42 0 0 0-.72-.22l-12.35 15.28L11.78 23.9a1.26 1.26 0 0 0 1.22 0l6.47-3.63z" fill="#FFCA28"/>
    <path d="M12.69 10.37L10.58 6.82a.42.42 0 0 0-.73 0L4.53 20.27l7.25 3.63z" fill="#FFA000"/>
  </svg>
)

const VercelIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 1L24 22H0L12 1Z"/>
  </svg>
)

const IntegrationsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12h6M14 12h6" />
    <path d="M12 4v6M12 14v6" />
    <circle cx="12" cy="12" r="2" />
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

type WorkspaceToolResult = {
  path: string
  content: string
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

  const runAgentWithTools = async (
    workspaceRoot: string,
    initialMessages: ChatMessage[],
    requestModel: (conversation: any[]) => Promise<string>
  ) => {
    const workspace = await AgentBridge.inspectWorkspace(workspaceRoot)
    if (!workspace.success) throw new Error(workspace.error || "Workspace could not be inspected")

    const entries = Array.isArray(workspace.content) ? workspace.content : []
    const tree = entries.map((entry: any) => `${entry.isDirectory ? "[DIR] " : "[FILE] "}${entry.path}`).join("\n")
    const systemPrompt = {
      role: "system",
      content: `You are IdeaAI, an autonomous coding agent running on the user's computer.
WORKSPACE ROOT: ${workspaceRoot}
You can inspect and modify files only inside this workspace root.

Available tools are represented as XML and must be used exactly:
<read_file path="relative/path"> to request a file, then wait for the tool result.
<write_file path="relative/path">file contents</write_file> to create or replace a file.
<run_command>command</run_command> to run a command with this workspace as cwd.

Never invent file contents or command output. Use read_file before editing an existing file.
Do not claim that a file was created or changed unless you emitted a <write_file> block.
The <write_file> block must contain the complete file contents, not a summary.
After tool results, continue the task and finish with a concise explanation. Do not use absolute paths.

WORKSPACE TREE:
${tree.slice(0, 50000)}`
    }

    let conversation: any[] = [systemPrompt, ...initialMessages]
    let finalText = ""
    const applied: string[] = []

    for (let round = 0; round < 4; round += 1) {
      finalText = await requestModel(conversation)

      const reads = Array.from(finalText.matchAll(/<read_file\s+path=["']([^"']+)["']\s*\/?>/gi))
      const writes = Array.from(finalText.matchAll(/<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi))
      const commands = Array.from(finalText.matchAll(/<run_command>([\s\S]*?)<\/run_command>/gi))
      const fencedWrites = Array.from(finalText.matchAll(/\[(?:NEW|MODIFY)\]\s+([^\r\n]+?)(?:\s+\(\+\d+\s+-\d+\))?\s*\r?\n+```[^\r\n]*\r?\n([\s\S]*?)```/gi))
      if (!reads.length && !writes.length && !commands.length && !fencedWrites.length) break

      const toolResults: WorkspaceToolResult[] = []
      for (const match of reads) {
        const relativePath = match[1].trim()
        const readResult = await AgentBridge.readFileInWorkspace(workspaceRoot, relativePath)
        toolResults.push({ path: relativePath, content: readResult.success ? String(readResult.content || "") : `ERROR: ${readResult.error}` })
      }
      for (const match of writes) {
        const relativePath = match[1].trim()
        const writeResult = await AgentBridge.writeFileInWorkspace(workspaceRoot, relativePath, match[2])
        if (!writeResult.success) throw new Error(writeResult.error || `Could not write ${relativePath}`)
        applied.push(`[WRITE] ${relativePath}`)
      }
      for (const match of fencedWrites) {
        const relativePath = match[1].trim()
        if (writes.some((write) => write[1].trim() === relativePath)) continue
        const writeResult = await AgentBridge.writeFileInWorkspace(workspaceRoot, relativePath, match[2])
        if (!writeResult.success) throw new Error(writeResult.error || `Could not write ${relativePath}`)
        applied.push(`[WRITE] ${relativePath}`)
      }
      for (const match of commands) {
        const command = match[1].trim()
        const commandResult = await AgentBridge.runCommandInWorkspace(workspaceRoot, command)
        toolResults.push({
          path: `command: ${command}`,
          content: `exit=${commandResult.success ? "0" : "1"}\nstdout:\n${commandResult.stdout || ""}\nstderr:\n${commandResult.stderr || commandResult.error || ""}`
        })
        applied.push(`[COMMAND] ${command}`)
      }

      conversation = [
        ...conversation,
        { role: "assistant", content: finalText },
        { role: "user", content: `TOOL RESULTS:\n${toolResults.map(result => `<tool_result path="${result.path}">\n${result.content}\n</tool_result>`).join("\n")}\nContinue the task. Do not repeat completed tool calls.` }
      ]
    }

    return { text: finalText, applied }
  }

  const runLocalAgent = (workspaceRoot: string, initialMessages: ChatMessage[]) =>
    runAgentWithTools(workspaceRoot, initialMessages, async (conversation) => {
      const result = await AgentBridge.askLocalAI(conversation)
      if (!result.success) throw new Error(result.error || "Local Ollama request failed")
      return String(result.text || result.content || "")
    })

  const runAzureAgent = (workspaceRoot: string, initialMessages: ChatMessage[], apiKey: string) =>
    runAgentWithTools(workspaceRoot, initialMessages, async (conversation) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          messages: conversation,
          model: "Azure Enterprise Cloud (Llama 3.2)",
        }),
        signal: abortControllerRef.current?.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || `Azure responded with ${response.status}`)
      return String(data.response || "")
    })

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
        const currentPath = currentProject?.files[0]
        if (!currentPath) throw new Error("Önce bir çalışma klasörü seçin.")

        setTerminalOutput("➜  ~ Analyzing codebase architecture...")
        const localResult = await runLocalAgent(currentPath, newMessages)

        let responseText = localResult.text
        if (localResult.applied.length) responseText += `\n\n${localResult.applied.join("\n")}`
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

      // Azure can reason remotely, but file and terminal tools execute locally.
      const isAzureModel = selectedModel === "Azure Enterprise Cloud (Llama 3.2)" || selectedModel === "IdeaAI Hybrid Engine (Pro)"
      if (isAzureModel && AgentBridge.isElectron()) {
        const currentProject = projects.find(p => p.name === selectedProject)
        const currentPath = currentProject?.files[0]
        if (!currentPath) throw new Error("Önce bir çalışma klasörü seçin.")

        setTerminalOutput("➜  ~ Connecting Azure reasoning to local workspace...")
        const azureResult = await runAzureAgent(currentPath, newMessages, storedApiKey)
        let responseText = azureResult.text
        if (azureResult.applied.length) responseText += `\n\n${azureResult.applied.join("\n")}`
        const duration = Math.max(1, Math.round((Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000))
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Thought for ${duration}s\n${responseText}`
        }])
        setStatus('ready')
        setTerminalOutput("✔ Azure task finished locally.")
        return
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
      className="flex h-screen w-full bg-[#f8f9fc] p-0 md:p-3 overflow-hidden select-none"
      style={{ fontFamily: "'Google Sans Flex', 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <GoogleSansFlexLink />
      <input type="file" ref={folderInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

      {/* Main Window Frame (Mac/Codex style rounded frame with subtle border & shadow) */}
      <div className="flex-1 flex w-full h-full bg-[#ffffff] rounded-none md:rounded-[20px] border-0 md:border md:border-[#000000]/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden relative">
        {/* ========================================================= */}
        {/* LEFT SIDEBAR (#f3f3f3, rgba(243, 243, 243), hsl(0, 0, 95)) */}
        {/* ========================================================= */}
        <aside className={`${sidebarCollapsed ? "w-[64px]" : "w-[260px]"} bg-[#f7f7f8] border-r border-[#ebebee] flex flex-col shrink-0 justify-between transition-[width] duration-200`}>
        
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
              onClick={() => { setSettingsTab("integrations"); setIsSettingsOpen(true); }}
              title="Integrations"
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#404040] hover:bg-[#eaeaea] hover:text-[#171717] transition-colors text-left`}
            >
              <IntegrationsIcon className="w-4 h-4 text-[#525252]" />
              {!sidebarCollapsed && <span>Integrations</span>}
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

              {/* Codex Inspired Minimalist Integrations Feed */}
              <div className="w-full flex flex-col gap-2 mb-6 max-w-[620px] text-left">
                <div 
                  onClick={() => {
                    setLocalInput("Check latest unread emails via Gmail and draft status reply.")
                    textareaRef.current?.focus()
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#f6f6f6] border border-transparent hover:border-[#eaeaea] cursor-pointer transition-all group"
                >
                  <GmailIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[13px] text-[#525252] group-hover:text-[#171717] font-medium truncate">
                    Your email to Mount Lemmon lodge bounced back
                  </span>
                </div>

                <div 
                  onClick={() => {
                    setLocalInput("Check Slack channel #proactivity-eng and summarize requests.")
                    textareaRef.current?.focus()
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#f6f6f6] border border-transparent hover:border-[#eaeaea] cursor-pointer transition-all group"
                >
                  <SlackIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[13px] text-[#525252] group-hover:text-[#171717] font-medium truncate">
                    Reply to Ty in proactivity-eng
                  </span>
                </div>

                <div 
                  onClick={() => {
                    setLocalInput("Check Google Calendar for upcoming review meeting and gather project notes.")
                    textareaRef.current?.focus()
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#f6f6f6] border border-transparent hover:border-[#eaeaea] cursor-pointer transition-all group"
                >
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[13px] text-[#525252] group-hover:text-[#171717] font-medium truncate">
                    Prep for the upcoming review with Tibo
                  </span>
                </div>
              </div>

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
      </div>

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
