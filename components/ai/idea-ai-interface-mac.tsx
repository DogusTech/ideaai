"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AntigravityMarkdown } from "./antigravity-markdown"
import { AgentBridge, type WorkspaceEntry } from "@/app/utils/agent-bridge"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { SettingsModal } from "./settings-modal"
import { SkillsModal } from "./skills-modal"
import { FeedbackModal } from "./feedback-modal"
import { IntegratedTerminalPanel } from "./integrated-terminal-panel"
import { localModelsBridge, type InstalledOllamaModel } from "@/app/utils/local-models-bridge"
import { BookOpenText, Check, CheckCircle2, Code2, FolderOpen, GitBranch as GitBranchIcon, History, House, MessageSquare, Moon, Plus, Settings2, Sparkles, Workflow, Wrench, FileText, GitPullRequest, TestTube2, Eraser, Hand, ShieldCheck, ShieldAlert, ThumbsUp, ThumbsDown, Clipboard, Search, Pencil, BriefcaseBusiness } from "lucide-react"
import { DesktopTitlebar } from "./desktop-titlebar"
import { ProviderModelPicker, type ModelChoice } from "./provider-model-picker"
import { WorkspaceInspector, type PlanStep, type WorkspaceChange } from "./workspace-inspector"
import { NightShiftPanel } from "./night-shift-panel"
import { TuraenLogo } from "@/components/brand/turaen-logo"
import { CommandPalette } from "./command-palette"
import { UpgradeModal } from "./upgrade-modal"
import { canAttachFiles, getPlanState, hasUnlimitedQuota, isPro, nextPlanName, requiresProForModel, requiresProForSlashCommand, savePlanState, type PlanState } from "@/lib/plan-entitlements"
import { LOCAL_OLLAMA_LARGE_NUM_CTX, LOCAL_OLLAMA_NUM_CTX, packLocalConversation, truncateLocalText } from "@/lib/local-context"
import { formatAgentReplyForChat, planActiveIndex, sanitizeAgentChatContent, toAgentModelReply, type AgentModelReply, type ParsedAgentReply } from "@/lib/agent-reply"
import { startStripeCheckout } from "@/lib/stripe-billing"

// ==========================================
// BESPOKE MINIMALIST SVG ICONS
// ==========================================

const IdeaAILogo = ({ className = "w-6 h-6" }: { className?: string }) => <TuraenLogo className={className} />

const PlusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const ArrowUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="19" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
)

const TerminalIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
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
  model?: string
  durationSeconds?: number
  tokensPerSecond?: number
}

type FeedbackRating = "like" | "unlike"

type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
  workspacePath?: string
}

const APPROVAL_MANUAL = "Manual Review"
const APPROVAL_GUARD = "Smart Guard"
const APPROVAL_AUTONOMY = "Full Autonomy"

/** Keep legacy saved values working after the execution modes were renamed. */
function normalizeApprovalMode(value: string | null | undefined) {
  const normalized = String(value || "").trim().toLowerCase()
  if (["full auto", "turbo mode", "full autonomy"].includes(normalized)) return APPROVAL_AUTONOMY
  if (["auto-approve file edits", "auto approve file edits", "smart guard", "benim için onayla"].includes(normalized)) return APPROVAL_GUARD
  return APPROVAL_MANUAL
}

let messageIdCounter = 0

function createMessageId() {
  return `message-${Date.now()}-${messageIdCounter++}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeMessages(messages: ChatMessage[]) {
  const seen = new Set<string>()
  const result: ChatMessage[] = []
  for (const message of messages) {
    // Empty assistant turns were written by an older streaming race.
    if (message.role === "assistant" && !String(message.content || "").trim()) continue
    const previous = result[result.length - 1]
    if (
      previous &&
      message.role === "assistant" &&
      previous.role === "assistant" &&
      previous.content === message.content
    ) continue
    const id = message.id && !seen.has(message.id) ? message.id : createMessageId()
    seen.add(id)
    result.push(id === message.id ? message : { ...message, id })
  }
  return result
}

type WorkspaceToolResult = {
  path: string
  content: string
}

type AgentRunResult = {
  text: string
  applied: string[]
  phaseSummaries: string[]
  changes: WorkspaceChange[]
  reply?: ParsedAgentReply
}

type WorkspaceMention = {
  path: string
  isDirectory: boolean
  content?: string
}

const slashCommands = [
  { command: "/fix", description: "Inspect and fix errors in the current workspace", icon: Wrench },
  { command: "/explain", description: "Explain selected files or architecture", icon: FileText },
  { command: "/test", description: "Generate and run unit tests", icon: TestTube2 },
  { command: "/commit", description: "Stage changes and create a Git commit", icon: Check },
  { command: "/pr", description: "Push branch and open a GitHub Pull Request", icon: GitPullRequest },
  { command: "/nightshift", description: "Queue current task into Night Shift", icon: Moon },
  { command: "/clear", description: "Clear current chat session", icon: Eraser },
]

const CHAT_HISTORY_KEY = "ideaai_chat_history"
const CURRENT_CHAT_KEY = "ideaai_current_chat"
const LAST_PROJECT_KEY = "ideaai_last_active_project"

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function sessionTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === "user")
  return firstUserMessage?.content?.trim().slice(0, 48) || "Current conversation"
}

function formatRelativeTimestamp(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  return `${months}mo`
}

function makePlan(prompt: string): PlanStep[] {
  const lower = prompt.toLowerCase()
  const steps = [
    "Inspect the selected workspace and identify the files relevant to this request.",
    lower.includes("bug") || lower.includes("fix") ? "Trace the failure and confirm its cause." : "Choose a focused implementation approach.",
    lower.includes("test") || lower.includes("build") ? "Apply the changes and run the requested verification." : "Apply the changes and check the affected code paths.",
  ]
  return steps.map((title, index) => ({ id: `${Date.now()}-${index}`, title, state: index === 0 ? "running" : "pending" }))
}

function updatePlanProgress(steps: PlanStep[], activeIndex: number): PlanStep[] {
  const active = Math.max(0, Math.min(activeIndex, steps.length - 1))
  return steps.map((step, index) => ({
    ...step,
    state: index < active ? "completed" : index === active ? "running" : "pending",
  }))
}

const ATTACHED_FILE_CONTEXT_LIMIT = 4000

// Local models run with a fixed num_ctx. Keep the system prompt, project rules,
// workspace tree and tool output inside a predictable token budget so Ollama
// never answers with a context-length / token overflow error.
const LOCAL_AGENTS_RULES_TOKEN_BUDGET = 1800
const LOCAL_WORKSPACE_TREE_TOKEN_BUDGET = 1400
const LOCAL_USER_INTENT_TOKEN_BUDGET = 400
const LOCAL_TOOL_RESULT_CHAR_LIMIT = 3000
const LOCAL_TOOL_RESULTS_TOTAL_CHARS = 7000
const LOCAL_VERIFICATION_CHAR_LIMIT = 3000

const AMERICAN_ENGLISH_INSTRUCTION = "Always respond in clear, concise American English unless the user explicitly requests another language."

function extractPrecisionWindow(content: string, intent: string, maxChars = 3500) {
  const source = String(content || "")
  if (source.length <= maxChars) return source
  const lines = source.split(/\r?\n/)
  const keywords = intent.toLowerCase().split(/[^a-z0-9_$-]+/).filter((token) => token.length >= 3).slice(0, 12)
  const anchors = lines.map((line, index) => {
    const lower = line.toLowerCase()
    const score = (keywords.filter((keyword) => lower.includes(keyword)).length * 3) + (/^(import|export|function|class|const|let|type|interface)\b/.test(line.trim()) ? 1 : 0)
    return { index, score }
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8)
  const selected = new Set<number>()
  anchors.forEach(({ index }) => { for (let cursor = Math.max(0, index - 5); cursor <= Math.min(lines.length - 1, index + 8); cursor++) selected.add(cursor) })
  const focused = [...selected].sort((a, b) => a - b).map((index) => `${String(index + 1).padStart(4, " ")} | ${lines[index]}`).join("\n")
  return (focused || lines.slice(0, 70).map((line, index) => `${String(index + 1).padStart(4, " ")} | ${line}`).join("\n")).slice(0, maxChars)
}

function extractUserIntent(content: string) {
  return content
    .replace(/\[Workspace file:[^\]]+\][\s\S]*?(?=\n\[Workspace file:|$)/gi, "")
    .replace(/\[Attached file:[^\]]+\]/gi, "")
    .trim()
}

function focusAttachedFileContext(content: string, userIntent: string) {
  return content.replace(
    /\[Workspace file:\s*([^\]]+)\]([\s\S]*?)(?=\n\[Workspace file:|$)/gi,
    (_match, filePath: string, rawFile: string) => {
      const fileContent = rawFile.trim()
      const lines = fileContent.split(/\r?\n/)
      if (fileContent.length <= ATTACHED_FILE_CONTEXT_LIMIT && lines.length <= 250) {
        return `[Workspace file: ${filePath}]\n${fileContent}`
      }

      const queryTokens = userIntent
        .toLowerCase()
        .split(/[^a-z0-9_$-]+/i)
        .filter((token) => token.length >= 3)
      const isKeyLine = (line: string) =>
        /^\s*(import|export|from|const|let|var|type|interface|class|function|async function)\b/.test(line) ||
        /use(State|Reducer|Effect|Memo|Callback)|set[A-Z]\w*|reducer|initial(State|Data)|config|schema/i.test(line)
      const isRelevant = (line: string) => {
        const normalized = line.toLowerCase()
        return queryTokens.some((token) => normalized.includes(token))
      }

      const selected = new Set<number>()
      lines.forEach((line, index) => {
        if (isKeyLine(line) || isRelevant(line)) {
          for (let offset = -2; offset <= 2; offset += 1) {
            const target = index + offset
            if (target >= 0 && target < lines.length) selected.add(target)
          }
        }
      })

      const focusedLines = Array.from(selected)
        .sort((a, b) => a - b)
        .map((index) => `${index + 1}: ${lines[index]}`)
      let focused = focusedLines.join("\n")
      if (!focused) focused = lines.slice(0, 80).map((line, index) => `${index + 1}: ${line}`).join("\n")
      if (focused.length > ATTACHED_FILE_CONTEXT_LIMIT) {
        focused = `${focused.slice(0, ATTACHED_FILE_CONTEXT_LIMIT - 80)}\n… [context truncated]`
      }

      return `[Workspace file: ${filePath}]\n[Focused context from ${lines.length} lines; matching sections, imports, and state retained]\n${focused}`
    }
  )
}

function compactWorkspaceTree(entries: WorkspaceEntry[]) {
  return entries
    .filter((entry) => entry.path.split(/[\\/]/).length <= 3)
    .slice(0, 180)
    .map((entry) => `${entry.isDirectory ? "[DIR] " : "[FILE] "}${entry.path}`)
    .join("\n")
}

function shouldUseLocalFastPath(messages: ChatMessage[]) {
  const latest = [...messages].reverse().find((message) => message.role === "user")
  if (!latest) return false
  const intent = extractUserIntent(latest.content).trim()
  if (!intent || intent.length > 220) return false
  if (/@[^\s]+|(?:^|\s)\/\w+/.test(latest.content)) return false
  return !/\b(fix|edit|modify|change|create|write|delete|refactor|implement|debug|test|run|build|commit|pull request|file|code|repository|workspace|function|component|bug|error)\b/i.test(intent)
}

export function IdeaAIInterfaceMac() {
  const [hasHydrated, setHasHydrated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  const [selectedModel, setSelectedModel] = useState("qwen2.5-coder:3b")
  const [installedLocalModels, setInstalledLocalModels] = useState<InstalledOllamaModel[]>([])

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("general")
  const [skillsModalOpen, setSkillsModalOpen] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null)
  const [plan, setPlan] = useState<PlanState>({ tier: "free", devPreview: false })
  const [lastTelemetry, setLastTelemetry] = useState<{ seconds: number; tokPerSecond: number; hardware: string } | null>(null)
  const [startingOllama, setStartingOllama] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  const [activeBrand, setActiveBrand] = useState("Turaen")
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null)
  const [approvalMenuOpen, setApprovalMenuOpen] = useState(false)
  const [approvalMode, setApprovalMode] = useState(APPROVAL_MANUAL)
  const [feedbackByMessage, setFeedbackByMessage] = useState<Record<string, FeedbackRating>>({})
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [installingOllama, setInstallingOllama] = useState(false)

  const [nightShiftOpen, setNightShiftOpen] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [terminalShell, setTerminalShell] = useState("PowerShell")
  const [terminalFontSize, setTerminalFontSize] = useState(13)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [inspectorTab, setInspectorTab] = useState<"plan" | "changes">("plan")
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([])
  const [workspaceChanges, setWorkspaceChanges] = useState<WorkspaceChange[]>([])
  const [pendingApproval, setPendingApproval] = useState<{ title: string; detail: string } | null>(null)
  const approvalResolverRef = useRef<((approved: boolean) => void) | null>(null)
  const [provider, setProvider] = useState("Local (Ollama)")
  const [gitBranch, setGitBranch] = useState("main")
  const [gitStatus, setGitStatus] = useState<any>(null)
  const [gitPullRequestUrl, setGitPullRequestUrl] = useState<string | null>(null)
  const [pastedImages, setPastedImages] = useState<string[]>([])
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [workspaceMentions, setWorkspaceMentions] = useState<WorkspaceMention[]>([])
  const [workspaceEntries, setWorkspaceEntries] = useState<WorkspaceMention[]>([])
  const [mentionMode, setMentionMode] = useState<"mention" | "command" | null>(null)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionIndex, setMentionIndex] = useState(0)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [draftProjectName, setDraftProjectName] = useState("")
  const [draftProjectFolders, setDraftProjectFolders] = useState<string[]>([])

  const folderInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const chatViewportRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [localInput, setLocalInput] = useState("")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming" | "error">("ready")
  const [thinkingSeconds, setThinkingSeconds] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const thinkingStartedAtRef = useRef<number | null>(null)
  const localStreamBufferRef = useRef("")
  const localStreamFrameRef = useRef<number | null>(null)
  const localStreamMessageIdRef = useRef<string | null>(null)
  const localStreamClosedRef = useRef(true)
  const lastScrolledMessageIdRef = useRef<string | null>(null)
  const prevStatusRef = useRef<"ready" | "submitted" | "streaming" | "error">("ready")
  const activeProject = projects.find((project) => project.name === selectedProject)
  const workspaceRoot = activeProject?.files[0] || ""

  useEffect(() => {
    setApprovalMode(normalizeApprovalMode(localStorage.getItem("ideaai_approval")))
  }, [])

  useEffect(() => {
    if (!workspaceRoot) { setActiveBrand("Turaen"); return }
    let cancelled = false
    const detectBrand = async () => {
      const packageResult = await AgentBridge.readFileInWorkspace(workspaceRoot, "package.json")
      if (packageResult.success) {
        try {
          const name = JSON.parse(String(packageResult.content || "")).name
          if (typeof name === "string" && name.trim() && !cancelled) { setActiveBrand(name.trim()); return }
        } catch { /* Fall through to AGENTS.md. */ }
      }
      const agentsResult = await AgentBridge.readFileInWorkspace(workspaceRoot, "AGENTS.md")
      const heading = String(agentsResult.content || "").match(/^#\s+(.+)$/m)?.[1]?.trim()
      const folder = workspaceRoot.split(/[\\/]/).filter(Boolean).pop()
      if (!cancelled) setActiveBrand(heading || folder || "Turaen")
    }
    void detectBrand()
    return () => { cancelled = true }
  }, [workspaceRoot])

  useEffect(() => {
    const viewport = chatViewportRef.current
    if (!viewport || messages.length === 0) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveTurnId(visible.target.getAttribute("data-turn-id"))
    }, { root: viewport, threshold: [0.25, 0.6, 0.9] })
    Object.values(messageRefs.current).forEach((node) => { if (node) observer.observe(node) })
    return () => observer.disconnect()
  }, [messages.length])

  const requestUpgrade = useCallback((reason: string) => {
    // Local development already has the highest tier with unlimited quotas.
    if (hasUnlimitedQuota(plan)) return
    setUpgradeReason(`Upgrade to ${nextPlanName(plan)}: ${reason}`)
  }, [plan])
  const updatePlan = useCallback((next: PlanState) => setPlan(next), [])

  useEffect(() => {
    let isMounted = true
    void getPlanState().then((state) => {
      if (isMounted) setPlan(state)
    })
    return () => { isMounted = false }
  }, [])
  useEffect(() => {
    let isMounted = true
    const params = new URLSearchParams(window.location.search)
    if (params.get("upgrade") !== "success" || !params.get("session_id")) return
    void fetch(`/api/billing/confirm?session_id=${encodeURIComponent(params.get("session_id") || "")}`, { cache: "no-store" })
      .then((response) => response.json())
      .then(async (result) => {
        if (!result?.success) throw new Error(result?.error || "Payment confirmation failed.")
        const next = await savePlanState({ tier: "pro", devPreview: false })
        if (isMounted) {
          setPlan(next)
          setUpgradeSuccess(true)
        }
        window.history.replaceState({}, "", window.location.pathname)
      })
      .catch((confirmationError) => {
        if (isMounted) setError(new Error(confirmationError instanceof Error ? confirmationError.message : "Payment confirmation failed."))
      })
    return () => { isMounted = false }
  }, [])
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandPaletteOpen(true) }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  // --- Automatic local open-source model discovery ---
  const isMountedRef = useRef(true)
  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const scanLocalModels = useCallback(() => {
    if (!localModelsBridge.available()) return
    void localModelsBridge.list().then((result) => {
      if (!isMountedRef.current) return
      if (result?.success && Array.isArray(result.models)) {
        setInstalledLocalModels(result.models)
        if (result.models.length > 0 && provider === "Local (Ollama)") {
          const match = result.models.find((m: InstalledOllamaModel) => m.name === selectedModel)
          if (!match) {
            setSelectedModel(result.models[0].name)
          }
        }
      }
    })
  }, [provider, selectedModel])

  useEffect(() => {
    scanLocalModels()
  }, [scanLocalModels])

  const selectLocalModel = (modelName: string) => {
    if (requiresProForModel("Local (Ollama)", modelName, plan)) { requestUpgrade("Models above 3B parameters are a Pro feature."); return }
    setProvider("Local (Ollama)")
    setSelectedModel(modelName)
    setIsSettingsOpen(false)
    scanLocalModels()
  }

  const startOllama = async () => {
    setStartingOllama(true)
    const result = await localModelsBridge.ensureOllamaReady()
    setStartingOllama(false)
    if (result?.success) { setError(null); setStatus("ready"); scanLocalModels() }
    else setError(new Error(result?.error || "Could not start Ollama."))
  }

  const browseOllama = async () => {
    const result = await localModelsBridge.browseOllamaBinary()
    if (result?.success) { setError(null); setStatus("ready"); scanLocalModels() }
    else if (!result?.canceled) setError(new Error(result?.error || "Could not select the Ollama executable."))
  }

  const installOllama = async () => {
    setInstallingOllama(true)
    const result = await localModelsBridge.installOllama()
    setInstallingOllama(false)
    if (result?.success) { setError(null); setStatus("ready"); scanLocalModels() }
    else setError(new Error(result?.error || "Could not install Ollama."))
  }

  const retryOllama = () => { setError(null); setStatus("ready") }
  const pullOllamaModel = async () => {
    const result = await localModelsBridge.pull(selectedModel)
    if (result?.success) { setError(null); setStatus("ready"); scanLocalModels() }
    else setError(new Error(result?.error || `Could not pull ${selectedModel}.`))
  }

  const revertWorkspaceChange = async (change: WorkspaceChange) => {
    if (!workspaceRoot) return
    const result =
      change.before === null
        ? await AgentBridge.deleteFileInWorkspace(workspaceRoot, change.path)
        : await AgentBridge.writeFileInWorkspace(workspaceRoot, change.path, change.before)
    if (result.success) setWorkspaceChanges((current) => current.filter((item) => item.path !== change.path))
  }

  const acceptWorkspaceChange = (filePath: string) =>
    setWorkspaceChanges((current) => current.filter((item) => item.path !== filePath))

  const applyCodeToFile = async (code: string) => {
    const target = workspaceMentions[0]?.path || workspaceEntries.find((entry) => !entry.isDirectory)?.path
    if (!workspaceRoot || !target) { setLocalInput((current) => `${current}${current ? "\n\n" : ""}${code}`); textareaRef.current?.focus(); return }
    const result = await AgentBridge.writeFileInWorkspace(workspaceRoot, target, code)
    if (result.success) setWorkspaceChanges((current) => [...current, { path: target, before: null, after: code, additions: code.split(/\r?\n/).length, deletions: 0 }])
  }

  const requestApproval = (title: string, detail: string) =>
    new Promise<boolean>((resolve) => {
      approvalResolverRef.current = resolve
      setPendingApproval({ title, detail })
      setInspectorOpen(true)
    })

  const resolveApproval = (approved: boolean) => {
    approvalResolverRef.current?.(approved)
    approvalResolverRef.current = null
    setPendingApproval(null)
  }

  const setExecutionMode = (mode: string) => {
    const normalized = normalizeApprovalMode(mode)
    setApprovalMode(normalized)
    localStorage.setItem("ideaai_approval", normalized)
    setApprovalMenuOpen(false)
  }

  const needsApproval = (kind: "file" | "command", detail: string) => {
    if (approvalMode === APPROVAL_AUTONOMY) return false
    if (approvalMode === APPROVAL_MANUAL) return true
    if (kind === "file") return false
    return /\b(rm|rmdir|del|erase|format|shutdown|restart|sudo|chmod|chown|git\s+(reset|clean|push|force))\b/i.test(detail)
  }

  const handleImagePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const images = Array.from(event.clipboardData.items)
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file))
    if (!images.length) return
    event.preventDefault()
    images.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.onload = () => {
          const scale = Math.min(1, 1280 / Math.max(image.width, image.height))
          const canvas = document.createElement("canvas")
          canvas.width = Math.max(1, Math.round(image.width * scale))
          canvas.height = Math.max(1, Math.round(image.height * scale))
          canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height)
          setPastedImages((previous) => [...previous, canvas.toDataURL("image/jpeg", 0.72)])
        }
        image.src = String(reader.result)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(event.target.files || []).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        if (!canAttachFiles(workspaceMentions.length + attachedFiles.length + 1, plan)) { requestUpgrade("Free plans can attach up to 2 files per prompt."); return }
        setAttachedFiles((previous) => [...previous, file.name])
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.onload = () => {
          const scale = Math.min(1, 1280 / Math.max(image.width, image.height))
          const canvas = document.createElement("canvas")
          canvas.width = Math.max(1, Math.round(image.width * scale))
          canvas.height = Math.max(1, Math.round(image.height * scale))
          canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height)
          setPastedImages((previous) => [...previous, canvas.toDataURL("image/jpeg", 0.72)])
        }
        image.src = String(reader.result)
      }
      reader.readAsDataURL(file)
    })
    event.target.value = ""
  }

  const runAgentWithTools = async (
    workspaceRoot: string,
    initialMessages: ChatMessage[],
    requestModel: (conversation: any[]) => Promise<AgentModelReply>,
    contextWindowTokens: number = LOCAL_OLLAMA_NUM_CTX
  ): Promise<AgentRunResult> => {
    const workspace = await AgentBridge.inspectWorkspace(workspaceRoot)
    if (!workspace.success) throw new Error(workspace.error || "Workspace could not be inspected")
    setPlanSteps((current) => updatePlanProgress(current, 0))

    const entries = Array.isArray(workspace.content) ? workspace.content as WorkspaceEntry[] : []
    const agentsRules = await AgentBridge.readFileInWorkspace(workspaceRoot, "AGENTS.md")
    const fallbackAgents = agentsRules.success ? agentsRules : await AgentBridge.readFile("AGENTS.md")
    const tree = compactWorkspaceTree(entries)
    const latestUserMessage = [...initialMessages].reverse().find((message) => message.role === "user")
    const userIntent = latestUserMessage ? extractUserIntent(latestUserMessage.content) : ""
    const preparedMessages = initialMessages.map((message) =>
      message.role === "user"
        ? { ...message, content: focusAttachedFileContext(message.content, userIntent) }
        : message
    )
    const systemPrompt = {
      role: "system",
      content: `You are Turaen, an autonomous coding agent running locally on the user's computer.
WORKSPACE ROOT: ${workspaceRoot}
You can inspect and modify files only inside this workspace root.
${AMERICAN_ENGLISH_INSTRUCTION}
PROJECT BRAND: ${activeBrand}
PROJECT RULES:
${fallbackAgents.success ? truncateLocalText(String(fallbackAgents.content || ""), LOCAL_AGENTS_RULES_TOKEN_BUDGET) : "No AGENTS.md file was found."}

USER INTENT:
${truncateLocalText(userIntent || "Follow the user's latest request exactly.", LOCAL_USER_INTENT_TOKEN_BUDGET)}

When the user attaches files with @, answer the user's specific question or execute the requested edit directly. Do not produce a generic file summary such as "Key Features", "State Management", or "Rendering" unless the user explicitly asks for a summary. Use the focused attached-file context first; request a targeted read_file only when the relevant code is missing.

Available tools are represented as XML and must be used exactly:
<read_file path="relative/path"> to request a file, then wait for the tool result.
<write_file path="relative/path">file contents</write_file> to create or replace a file.
For compact edits, prefer <patch_file path="relative/path"><<<<<<< SEARCH\nexact old text\n=======\nreplacement text\n>>>>>>> REPLACE</patch_file>. Never rewrite a large file when a targeted patch is sufficient.
<run_command>command</run_command> to run a command with this workspace as cwd.

Never invent file contents or command output. Use read_file before editing an existing file.
Do not claim that a file was created or changed unless you emitted a <write_file> block.
The <write_file> block must contain the complete file contents, not a summary.
After tool results, continue the task and finish with a concise explanation. Do not use absolute paths.
For each turn, return one structured JSON step with thought, brand_context, plan_steps, action, and message. Use the action fields for exactly one read_file, write_file, patch_file, run_terminal, verify, or final_answer operation. Keep thought concise and never invent tool output.

WORKSPACE TREE (use focused reads; do not request entire large files):
${truncateLocalText(tree, LOCAL_WORKSPACE_TREE_TOKEN_BUDGET)}`,
    }

    let conversation: any[] = [systemPrompt, ...preparedMessages]
    let finalText = ""
    let lastReply: ParsedAgentReply | null = null
    const applied: string[] = []
    const phaseLog: string[] = []
    const changes: WorkspaceChange[] = []
    let verificationResults: WorkspaceToolResult[] = []
    const writeAgentFile = async (relativePath: string, content: string) => {
      const previous = await AgentBridge.readFileInWorkspace(workspaceRoot, relativePath)
      const before = previous.success ? String(previous.content || "") : null
      if (needsApproval("file", relativePath) && !(await requestApproval("Approve file change", relativePath))) {
        applied.push(`[SKIPPED] ${relativePath} — approval declined`)
        phaseLog.push(`Skipped ${relativePath} — approval declined`)
        return
      }
      const result = await AgentBridge.writeFileInWorkspace(workspaceRoot, relativePath, content)
      if (!result.success) throw new Error(result.error || `Could not write ${relativePath}`)
      setPlanSteps((current) => updatePlanProgress(current, current.length - 1))
      const oldLines = before?.split("\n") || []
      const newLines = content.split("\n")
      const change = {
        path: relativePath,
        before,
        after: content,
        additions: newLines.filter((line) => !oldLines.includes(line)).length,
        deletions: oldLines.filter((line) => !newLines.includes(line)).length,
      }
      changes.push(change)
      setWorkspaceChanges((current) => [change, ...current.filter((item) => item.path !== relativePath)])
      setInspectorOpen(true)
      setInspectorTab("changes")
      applied.push(`[WRITE] ${relativePath}`)
      phaseLog.push(`Updated ${relativePath}`)
      const extension = relativePath.toLowerCase().split(".").pop() || ""
      const verificationCommand = ["js", "mjs", "cjs"].includes(extension)
        ? `node --check "${relativePath}"`
        : ["ts", "tsx"].includes(extension)
          ? `npx tsc --noEmit --pretty false --jsx react-jsx --moduleResolution bundler --module esnext --target es2022 "${relativePath}"`
          : extension === "json"
            ? `node -e "JSON.parse(require('fs').readFileSync('${relativePath.replace(/\\/g, "/")}', 'utf8'))"`
            : ""
      if (verificationCommand) {
        const verification = await AgentBridge.runCommandInWorkspace(workspaceRoot, verificationCommand)
        verificationResults.push({ path: `verification: ${relativePath}`, content: `${verificationCommand}\nexit=${verification.success ? "0" : "1"}\n${verification.stdout || ""}\n${verification.stderr || verification.error || ""}` })
        applied.push(verification.success ? `[VERIFY] ${relativePath}` : `[VERIFY FAILED] ${relativePath}`)
        phaseLog.push(verification.success ? `Verified ${relativePath}` : `Verification failed: ${relativePath}`)
      }
    }

    for (let round = 0; round < 6; round += 1) {
      verificationResults = []
      const packedConversation = packLocalConversation(conversation, {
        contextWindow: contextWindowTokens,
        reserveTokens: 1280,
        systemBudgetRatio: 0.62,
        maxMessages: 24,
      })
      const modelReply = await requestModel(packedConversation)
      finalText = modelReply.loopText
      lastReply = modelReply.parsed

      // The model's own plan_steps become the roadmap shown next to the chat.
      if (modelReply.parsed.planSteps.length > 0) {
        const active = planActiveIndex(modelReply.parsed.action, modelReply.parsed.planSteps.length)
        const planDone = modelReply.parsed.action === "final_answer" || active >= modelReply.parsed.planSteps.length
        setPlanSteps((current) =>
          modelReply.parsed.planSteps.map((title, index) => ({
            id: current[index]?.id || `agent-${Date.now()}-${index}`,
            title,
            state: planDone || index < active ? "completed" : index === active ? "running" : "pending",
          }))
        )
      }

      const reads = Array.from(finalText.matchAll(/<read_file\s+path=["']([^"']+)["']\s*\/?>/gi))
      const writes = Array.from(finalText.matchAll(/<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi))
      const commands = Array.from(finalText.matchAll(/<run_command>([\s\S]*?)<\/run_command>/gi))
      const fencedWrites = Array.from(
        finalText.matchAll(
          /\[(?:NEW|MODIFY)\]\s+([^\r\n]+?)(?:\s+\(\+\d+\s+-\d+\))?\s*\r?\n+```[^\r\n]*\r?\n([\s\S]*?)```/gi
        )
      )
      const patches = Array.from(finalText.matchAll(/<patch_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/patch_file>/gi))

      if (!reads.length && !writes.length && !commands.length && !fencedWrites.length && !patches.length && !verificationResults.length) break

      const toolResults: WorkspaceToolResult[] = []
      let remainingToolChars = LOCAL_TOOL_RESULTS_TOTAL_CHARS
      for (const match of reads.slice(0, 4)) {
        const relativePath = match[1].trim()
        const readResult = await AgentBridge.readFileInWorkspace(workspaceRoot, relativePath)
        const perFileBudget = Math.max(400, Math.min(LOCAL_TOOL_RESULT_CHAR_LIMIT, remainingToolChars))
        const content = readResult.success
          ? extractPrecisionWindow(String(readResult.content || ""), userIntent, perFileBudget)
          : `ERROR: ${readResult.error}`
        remainingToolChars = Math.max(0, remainingToolChars - content.length)
        toolResults.push({ path: relativePath, content })
      }
      for (const match of writes) {
        const relativePath = match[1].trim()
        await writeAgentFile(relativePath, match[2])
      }
      for (const match of fencedWrites) {
        const relativePath = match[1].trim()
        if (writes.some((write) => write[1].trim() === relativePath)) continue
        await writeAgentFile(relativePath, match[2])
      }
      for (const match of patches) {
        const relativePath = match[1].trim()
        const patch = match[2].match(/<<<<<<< SEARCH\s*\n([\s\S]*?)\n=======\s*\n([\s\S]*?)\n>>>>>>> REPLACE/)
        if (!patch) { toolResults.push({ path: `patch: ${relativePath}`, content: "Invalid patch format. Use exact SEARCH / REPLACE markers." }); continue }
        const previous = await AgentBridge.readFileInWorkspace(workspaceRoot, relativePath)
        const before = previous.success ? String(previous.content || "") : ""
        if (!before.includes(patch[1])) { toolResults.push({ path: `patch: ${relativePath}`, content: "SEARCH text was not found exactly. Read the focused file window and retry." }); continue }
        await writeAgentFile(relativePath, before.replace(patch[1], patch[2]))
      }
      for (const match of commands) {
        const command = match[1].trim()
        if (needsApproval("command", command) && !(await requestApproval("Approve terminal command", command))) {
          toolResults.push({ path: `command: ${command}`, content: "Not run: approval declined." })
          continue
        }
        const commandResult = await AgentBridge.runCommandInWorkspace(workspaceRoot, command)
        setPlanSteps((current) => updatePlanProgress(current, current.length - 1))
        toolResults.push({
          path: `command: ${command}`,
          content: `exit=${commandResult.success ? "0" : "1"}\nstdout:\n${String(commandResult.stdout || "").slice(-LOCAL_VERIFICATION_CHAR_LIMIT)}\nstderr:\n${String(commandResult.stderr || commandResult.error || "").slice(-LOCAL_VERIFICATION_CHAR_LIMIT)}`,
        })
        applied.push(`[COMMAND] ${command}`)
        phaseLog.push(`Ran ${command}`)
      }

      if (writes.length || fencedWrites.length || patches.length) {
        const verify = await AgentBridge.runCommandInWorkspace(workspaceRoot, "npx tsc --noEmit --pretty false")
        const verificationText = `npx tsc --noEmit --pretty false\nexit=${verify.success ? "0" : "1"}\n${String(verify.stdout || "").slice(-LOCAL_VERIFICATION_CHAR_LIMIT)}\n${String(verify.stderr || verify.error || "").slice(-LOCAL_VERIFICATION_CHAR_LIMIT)}`
        verificationResults.push({ path: "verification: workspace", content: verificationText })
        applied.push(verify.success ? "[VERIFY] workspace" : "[VERIFY FAILED] workspace")
        phaseLog.push(verify.success ? `Verified workspace (npx tsc --noEmit)` : `Workspace verification failed`)
      }

      const combinedToolResults = [...toolResults, ...verificationResults]
        .map((result) => `<tool_result path="${result.path}">\n${result.content}\n</tool_result>`)
        .join("\n")
      conversation = [
        ...conversation,
        { role: "assistant", content: finalText },
        {
          role: "user",
          content: `TOOL RESULTS:\n${truncateLocalText(combinedToolResults, 2200)}\nContinue the task. If verification failed, repair the exact error with at most two focused self-healing passes. Do not repeat completed tool calls.`,
        },
      ]
    }

    // Compact phase summaries: count-based instead of per-file line dumps.
    const updatedFiles = phaseLog.filter((line) => line.startsWith("Updated ")).length
    const skippedFiles = phaseLog.filter((line) => line.startsWith("Skipped ")).length
    const ranCommands = phaseLog.filter((line) => line.startsWith("Ran ")).length
    const verifiedItems = phaseLog.filter((line) => line.startsWith("Verified ")).length
    const failedVerifications = phaseLog.filter((line) => line.startsWith("Verification failed")).length

    const phaseSummaries: string[] = []
    if (updatedFiles > 0) phaseSummaries.push(`Updated ${updatedFiles} file${updatedFiles > 1 ? "s" : ""}`)
    if (skippedFiles > 0) phaseSummaries.push(`Skipped ${skippedFiles} file${skippedFiles > 1 ? "s" : ""} (approval declined)`)
    if (ranCommands > 0) phaseSummaries.push(`Ran ${ranCommands} command${ranCommands > 1 ? "s" : ""}`)
    if (verifiedItems > 0) phaseSummaries.push(`Verified ${verifiedItems} item${verifiedItems > 1 ? "s" : ""}`)
    if (failedVerifications > 0) phaseSummaries.push(`${failedVerifications} verification${failedVerifications > 1 ? "s" : ""} failed`)

    return { text: finalText, applied, phaseSummaries, changes, reply: lastReply ?? undefined }
  }

  const runLocalAgent = async (workspaceRoot: string, initialMessages: ChatMessage[]): Promise<AgentRunResult> => {
    if (shouldUseLocalFastPath(initialMessages)) {
      const latest = [...initialMessages].reverse().find((message) => message.role === "user")
      const result = await AgentBridge.askLocalAI([
        { role: "system", content: `${AMERICAN_ENGLISH_INSTRUCTION} You are Turaen's fast local assistant. Answer briefly and directly. Do not inspect files, use tools, or provide a generic summary.` },
        latest,
      ], { fastPath: true })
      if (!result.success) throw new Error(result.error || "Local Ollama request failed")
      return { text: String(result.text || result.content || ""), applied: [], phaseSummaries: [], changes: [] }
    }
    return runAgentWithTools(workspaceRoot, initialMessages, async (conversation) => {
      const result = await AgentBridge.askLocalAI(conversation, { structured: true })
      if (!result.success) throw new Error(result.error || "Local Ollama request failed")
      return toAgentModelReply(String(result.text || result.content || ""))
    }, LOCAL_OLLAMA_NUM_CTX)
  }

  const runAzureAgent = (workspaceRoot: string, initialMessages: ChatMessage[], apiKey: string) =>
    runAgentWithTools(workspaceRoot, initialMessages, async (conversation) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          messages: conversation,
          model: "Azure Enterprise Cloud (Llama 3.2)",
        }),
        signal: abortControllerRef.current?.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || `Azure responded with ${response.status}`)
      return toAgentModelReply(String(data.response || ""))
    }, LOCAL_OLLAMA_LARGE_NUM_CTX)

  // --- Dynamic System-Synced Theme Engine ---
  const syncAppTheme = useCallback((forcedTheme?: string) => {
    const storedTheme = forcedTheme || localStorage.getItem("ideaai_theme") || "System"
    let isDark = false

    if (storedTheme === "Dark") {
      isDark = true
    } else if (storedTheme === "Light") {
      isDark = false
    } else {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    if (isDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      document.body.classList.add("dark")
      document.body.classList.remove("light")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      document.body.classList.remove("dark")
      document.body.classList.add("light")
    }
    document.documentElement.dataset.ideaaiTheme = isDark ? "dark" : "light"
    document.documentElement.style.colorScheme = isDark ? "dark" : "light"

    // Sync electron nativeTheme if in desktop
    const bridge = (window as Window & { electronAPI?: { invoke: (name: string, ...args: any[]) => Promise<unknown> } }).electronAPI
    if (bridge) {
      void bridge.invoke("theme:set", isDark ? "dark" : "light").catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    syncAppTheme()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const current = localStorage.getItem("ideaai_theme") || "System"
      if (current === "System") {
        syncAppTheme()
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [syncAppTheme])

  // --- App Hydration & Persistent Project Loading ---
  useEffect(() => {
    const storedActiveChatId = localStorage.getItem("ideaai_active_chat") || `chat-${Date.now()}`
    const storedFont = localStorage.getItem("ideaai_typography") || "OpenAI Sans"
    document.documentElement.style.setProperty(
      "--font-sans",
      `'${storedFont}', 'OpenAI Sans', 'Satoshi', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
    )

    const storedProjects = readStoredJson<Project[]>("ideaai_projects", [])
    setProjects(storedProjects)

    // Restore last active project
    const lastActive = localStorage.getItem(LAST_PROJECT_KEY)
    if (lastActive && storedProjects.some((p) => p.name === lastActive)) {
      setSelectedProject(lastActive)
    } else if (storedProjects.length > 0) {
      setSelectedProject(storedProjects[0].name)
    }

    const savedSessions = readStoredJson<ChatSession[]>(CHAT_HISTORY_KEY, [])
    setChatSessions(savedSessions)
    setMessages(normalizeMessages(readStoredJson<ChatMessage[]>(CURRENT_CHAT_KEY, [])))
    setActiveChatId(storedActiveChatId)
    setTerminalShell(localStorage.getItem("ideaai_shell") || "PowerShell")
    setTerminalFontSize(Number(localStorage.getItem("ideaai_terminalFontSize")) || 13)
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (hasHydrated) localStorage.setItem("ideaai_projects", JSON.stringify(projects))
  }, [projects, hasHydrated])

  useEffect(() => {
    if (hasHydrated && selectedProject) {
      localStorage.setItem(LAST_PROJECT_KEY, selectedProject)
    }
  }, [selectedProject, hasHydrated])

  useEffect(() => {
    if (hasHydrated && activeChatId) {
      localStorage.setItem(CURRENT_CHAT_KEY, JSON.stringify(messages))
      localStorage.setItem("ideaai_active_chat", activeChatId)
    }

    const lastMessage = messages[messages.length - 1]
    const isNewUserTurn = lastMessage && lastMessage.role === "user" && lastMessage.id !== lastScrolledMessageIdRef.current
    const streamingJustEnded = prevStatusRef.current !== "ready" && status === "ready"
    const shouldScroll = isNewUserTurn || streamingJustEnded

    if (shouldScroll && messagesEndRef.current) {
      lastScrolledMessageIdRef.current = lastMessage?.id ?? null
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }

    prevStatusRef.current = status
  }, [messages, activeChatId, hasHydrated, status])

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
        workspacePath: selectedProject || undefined,
      }
      const withoutCurrent = previous.filter((session) => session.id !== activeChatId)
      const next = [nextSession, ...withoutCurrent].slice(0, 50)
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [messages, activeChatId, selectedProject, hasHydrated])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email)
        setUserName(currentUser.displayName || currentUser.email?.split("@")[0] || "User")
      } else {
        setUserEmail(null)
        setUserName(null)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!workspaceRoot || !AgentBridge.isElectron()) {
      setGitBranch("main")
      setGitStatus(null)
      return
    }
    let active = true
    void AgentBridge.getGitStatus(workspaceRoot).then((result) => {
      if (active) {
        setGitStatus(result)
        setGitBranch(result.branch || "main")
      }
    })
    return () => {
      active = false
    }
  }, [workspaceRoot])

  useEffect(() => {
    if (!workspaceRoot || !AgentBridge.isElectron()) {
      setWorkspaceEntries([])
      return
    }
    let active = true
    void AgentBridge.inspectWorkspace(workspaceRoot).then((result) => {
      if (active && result.success && Array.isArray(result.content)) {
        setWorkspaceEntries(result.content.map((entry) => ({ path: entry.path, isDirectory: entry.isDirectory })))
      }
    })
    return () => {
      active = false
    }
  }, [workspaceRoot])

  /** Flush buffered Ollama tokens into the single live assistant message. */
  const flushLocalStream = useCallback(() => {
    if (localStreamFrameRef.current !== null) {
      cancelAnimationFrame(localStreamFrameRef.current)
      localStreamFrameRef.current = null
    }
    const chunk = localStreamBufferRef.current
    localStreamBufferRef.current = ""
    if (!chunk || localStreamClosedRef.current) return
    const messageId = localStreamMessageIdRef.current || createMessageId()
    localStreamMessageIdRef.current = messageId
    setMessages((current) => {
      const existing = current.find((message) => message.id === messageId)
      if (existing) return current.map((message) => message.id === messageId ? { ...message, content: message.content + chunk } : message)
      return [...current, { id: messageId, role: "assistant", content: chunk }]
    })
  }, [])

  /**
   * Replace the live stream message in place. Reusing the same message id is
   * what keeps one prompt from producing a streamed reply plus a second final
   * reply, and prevents a late token flush from creating an empty trailing turn.
   */
  const finalizeAssistantMessage = useCallback((content: string, meta?: { model?: string; durationSeconds?: number; tokensPerSecond?: number }) => {
    if (localStreamFrameRef.current !== null) {
      cancelAnimationFrame(localStreamFrameRef.current)
      localStreamFrameRef.current = null
    }
    localStreamBufferRef.current = ""
    localStreamClosedRef.current = true
    const streamId = localStreamMessageIdRef.current
    localStreamMessageIdRef.current = null
    const messageId = streamId || createMessageId()
    setMessages((current) => {
      const cleaned = current.filter((message) => message.id === messageId || message.role !== "assistant" || message.content.trim())
      const existingIndex = cleaned.findIndex((message) => message.id === messageId)
      if (existingIndex >= 0) {
        const next = [...cleaned]
        next[existingIndex] = { ...next[existingIndex], content, ...meta }
        return next
      }
      return [...cleaned, { id: messageId, role: "assistant", content, ...meta }]
    })
  }, [])

  useEffect(() => {
    const unsubscribe = AgentBridge.onLocalToken(({ token, done }) => {
      if (localStreamClosedRef.current) return
      if (token) localStreamBufferRef.current += token
      if (done) {
        // Flush the final tokens before the promise resolves; never leave a
        // delayed animation frame that appends a second assistant bubble.
        flushLocalStream()
        return
      }
      setStatus("streaming")
      if (localStreamFrameRef.current !== null) return
      localStreamFrameRef.current = requestAnimationFrame(() => {
        window.setTimeout(() => flushLocalStream(), 30)
      })
    })
    return () => {
      unsubscribe()
      if (localStreamFrameRef.current !== null) {
        cancelAnimationFrame(localStreamFrameRef.current)
        localStreamFrameRef.current = null
      }
    }
  }, [flushLocalStream])

  const stop = () => {
    abortControllerRef.current?.abort()
    localStreamClosedRef.current = true
    if (localStreamFrameRef.current !== null) {
      cancelAnimationFrame(localStreamFrameRef.current)
      localStreamFrameRef.current = null
    }
    localStreamBufferRef.current = ""
    setStatus("ready")
  }

  // Only the structured `message` (plus plan/thought metadata) is persisted;
  // raw model JSON is never written into a chat bubble.
  const buildAssistantResponse = (result: AgentRunResult, duration: number) => {
    const formatted = result.reply
      ? formatAgentReplyForChat(result.reply, { done: true })
      : String(result.text || "").trim()
    const body = formatted || (result.phaseSummaries.length ? result.phaseSummaries.join(" ") : "Step complete.")
    const summary = result.phaseSummaries.length ? `\n${result.phaseSummaries.join("\n")}` : ""
    return [`Thought for ${duration}s`, body].filter(Boolean).join("\n") + summary
  }

  const sendMessage = async (message: any) => {
    const newMessages = [...messages, message]
    setMessages(newMessages)
    setStatus("submitted")
    thinkingStartedAtRef.current = Date.now()
    setThinkingSeconds(0)
    setError(null)
    setLastTelemetry(null)
    localStreamClosedRef.current = false
    localStreamBufferRef.current = ""
    localStreamMessageIdRef.current = null
    if (localStreamFrameRef.current !== null) {
      cancelAnimationFrame(localStreamFrameRef.current)
      localStreamFrameRef.current = null
    }
    setPlanSteps((current) => current.map((step, index) => ({ ...step, state: index === 0 ? "running" : "pending" })))

    abortControllerRef.current = new AbortController()

    try {
      const providerKey = selectedModel.startsWith("OpenAI")
        ? "ideaai_openai_api_key"
        : selectedModel.startsWith("Anthropic")
        ? "ideaai_anthropic_api_key"
        : "ideaai_google_api_key"
      const storedApiKey =
        typeof window !== "undefined"
          ? (provider === "BYOK" ? localStorage.getItem(providerKey) : localStorage.getItem("ideaai_api_key")) || ""
          : ""

      if (/\b(open|create|push|submit)\b[\s\S]*\b(pr|pull request)\b|\b(commit|push)\b/i.test(String(message.content || ""))) {
        await executeGitWorkflow(/\b(pr|pull request)\b/i.test(String(message.content || "")) ? "pr" : "commit", String(message.content || ""))
        return
      }

      if (provider === "Local (Ollama)" && AgentBridge.isElectron()) {
        const currentProject = projects.find((p) => p.name === selectedProject)
        const currentPath = currentProject?.files[0]
        if (!currentPath && !shouldUseLocalFastPath(newMessages)) throw new Error("Please select a workspace folder first.")

        const localResult = await runLocalAgent(currentPath || "", newMessages)
        setWorkspaceChanges((current) => [
          ...localResult.changes,
          ...current.filter((item) => !localResult.changes.some((next) => next.path === item.path)),
        ])

        const duration = Math.max(1, Math.round((Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000))
        const responseText = buildAssistantResponse(localResult, duration)
        const seconds = Math.max(0.1, (Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000)
        const tokPerSecond = Math.max(1, Math.round((responseText.length / 4) / seconds))
        finalizeAssistantMessage(responseText, { model: selectedModel, durationSeconds: duration, tokensPerSecond: tokPerSecond })
        setLastTelemetry({ seconds, tokPerSecond, hardware: "local" })
        setStatus("ready")
        setPlanSteps((current) => current.map((step) => ({ ...step, state: "completed" })))
        return
      }

      const isAzureModel =
        provider === "Account" ||
        selectedModel === "Azure Enterprise Cloud (Llama 3.2)" ||
        selectedModel === "IdeaAI Hybrid Engine (Pro)" ||
        selectedModel === "Turaen Hybrid Engine (Pro)"

      if (isAzureModel && AgentBridge.isElectron()) {
        const currentProject = projects.find((p) => p.name === selectedProject)
        const currentPath = currentProject?.files[0]
        if (!currentPath) throw new Error("Please select a workspace folder first.")

        const azureResult = await runAzureAgent(currentPath, newMessages, storedApiKey)
        setWorkspaceChanges((current) => [
          ...azureResult.changes,
          ...current.filter((item) => !azureResult.changes.some((next) => next.path === item.path)),
        ])
        const duration = Math.max(1, Math.round((Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000))
        const responseText = buildAssistantResponse(azureResult, duration)
        const seconds = Math.max(0.1, (Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000)
        const tokPerSecond = Math.max(1, Math.round((responseText.length / 4) / seconds))
        finalizeAssistantMessage(responseText, { model: selectedModel, durationSeconds: duration, tokensPerSecond: tokPerSecond })
        setLastTelemetry({ seconds, tokPerSecond, hardware: "cloud" })
        setStatus("ready")
        setPlanSteps((current) => current.map((step) => ({ ...step, state: "completed" })))
        return
      }

      // Cloud Azure or Fallback API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": storedApiKey,
        },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Server responded with ${res.status}`)
      }

      const data = await res.json()
      const duration = Math.max(1, Math.round((Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000))
      const cloudReply = toAgentModelReply(String(data.response || ""))
      const responseText = buildAssistantResponse(
        { text: String(data.response || ""), applied: [], phaseSummaries: [], changes: [], reply: cloudReply.parsed },
        duration,
      )
      const seconds = Math.max(0.1, (Date.now() - (thinkingStartedAtRef.current || Date.now())) / 1000)
      const tokPerSecond = Math.max(1, Math.round((String(data.response || "").length / 4) / seconds))
      finalizeAssistantMessage(responseText, { model: selectedModel, durationSeconds: duration, tokensPerSecond: tokPerSecond })
      setLastTelemetry({ seconds, tokPerSecond, hardware: "cloud" })
      setStatus("ready")
      setPlanSteps((current) => current.map((step) => ({ ...step, state: "completed" })))
    } catch (err: any) {
      if (err.name === "AbortError") {
        localStreamClosedRef.current = true
        setStatus("ready")
        return
      }
      setError(err)
      setStatus("error")
      setPlanSteps((current) => current.map((step, index) => ({ ...step, state: index === 0 ? "completed" : "pending" })))
      finalizeAssistantMessage(`**Execution Error:** ${err.message}`, { model: selectedModel })
    }
  }

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!localInput.trim() && pastedImages.length === 0 && attachedFiles.length === 0 && workspaceMentions.length === 0) return
    if (!canAttachFiles(workspaceMentions.length + attachedFiles.length, plan)) { requestUpgrade("Free plans can attach up to 2 files per prompt."); return }
    const typedCommand = localInput.trim().match(/^\/\S+/)?.[0]
    if (typedCommand && requiresProForSlashCommand(typedCommand, plan)) { requestUpgrade(`${typedCommand} is included with Turaen Pro.`); return }

    setPlanSteps(makePlan(localInput.trim() || "Review the attached files and images"))
    setInspectorOpen(true)
    setInspectorTab("plan")

    sendMessage({
      id: createMessageId(),
      role: "user",
      content: [
        localInput,
        ...workspaceMentions.map((file) => `[Workspace file: ${file.path}]\n${file.content || ""}`),
        ...attachedFiles.map((name) => `[Attached file: ${name}]`),
        ...pastedImages.map((image, index) => `![Attached image ${index + 1}](${image})`),
      ]
        .filter(Boolean)
        .join("\n\n"),
    })
    setLocalInput("")
    if (textareaRef.current) textareaRef.current.style.height = ""
    setPastedImages([])
    setAttachedFiles([])
    setWorkspaceMentions([])
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
    setMessages(normalizeMessages(session.messages))
    setLocalInput("")
    if (session.workspacePath && projects.some((p) => p.name === session.workspacePath)) {
      setSelectedProject(session.workspacePath)
    }
    localStorage.setItem(CURRENT_CHAT_KEY, JSON.stringify(session.messages))
    localStorage.setItem("ideaai_active_chat", session.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const activeItems = mentionMode === "mention"
      ? workspaceEntries.filter((entry) => entry.path.toLowerCase().includes(mentionQuery.toLowerCase()))
      : slashCommands.filter((item) => item.command.startsWith(`/${mentionQuery.toLowerCase()}`))
    if (mentionMode && activeItems.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setMentionIndex((index) => (index + 1) % activeItems.length)
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setMentionIndex((index) => (index - 1 + activeItems.length) % activeItems.length)
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        setMentionMode(null)
        return
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (mentionMode === "mention") void selectWorkspaceMention(activeItems[mentionIndex] as WorkspaceMention)
        else selectSlashCommand(activeItems[mentionIndex] as (typeof slashCommands)[number])
        return
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleCustomSubmit()
    }
  }

  const selectWorkspaceMention = async (entry: WorkspaceMention) => {
    if (entry.isDirectory) return
    if (!workspaceMentions.some((item) => item.path === entry.path) && !canAttachFiles(workspaceMentions.length + attachedFiles.length + 1, plan)) { requestUpgrade("Free plans can attach up to 2 files per prompt."); return }
    const tokenStart = localInput.lastIndexOf("@")
    const nextInput = `${localInput.slice(0, tokenStart)}@${entry.path} `
    setLocalInput(nextInput)
    setMentionMode(null)
    setMentionQuery("")
    setMentionIndex(0)
    const result = workspaceRoot ? await AgentBridge.readFileInWorkspace(workspaceRoot, entry.path) : { success: false }
    setWorkspaceMentions((current) => current.some((item) => item.path === entry.path)
      ? current
      : [...current, { ...entry, content: result.success ? String(result.content || "") : "" }])
    textareaRef.current?.focus()
  }

  const executeGitWorkflow = async (mode: "commit" | "pr", request = "") => {
    if (!workspaceRoot) {
      setError(new Error("Please select a workspace folder first."))
      setStatus("error")
      return
    }
    setStatus("submitted")
    setError(null)
    try {
      let statusResult = await AgentBridge.getGitStatus(workspaceRoot)
      if (!statusResult.success) throw new Error(statusResult.error || "Could not read Git status.")
      let branch = statusResult.branch || "main"
      if (mode === "pr" && (branch === "main" || branch === "master" || branch === "detached")) {
        const branchPrefix = /\b(fix|bug|error)\b/i.test(request) ? "fix" : /\b(refactor|cleanup)\b/i.test(request) ? "refactor" : "feat"
        const branchResult = await AgentBridge.createGitBranch(workspaceRoot, `turaen/${branchPrefix}-${Date.now()}`)
        if (!branchResult.success) throw new Error(branchResult.error || "Could not create a Pull Request branch.")
        branch = branchResult.branch
      }
      const diffResult = await AgentBridge.getGitDiff(workspaceRoot)
      const hasChanges = Boolean(statusResult.dirty || diffResult.diff?.trim())
      const prefix = /\b(fix|bug|error)\b/i.test(request) ? "fix" : /\b(refactor|cleanup)\b/i.test(request) ? "refactor" : "feat"
      const subject = request.replace(/^\/(commit|pr)\b/i, "").replace(/\s+/g, " ").trim().slice(0, 72) || (mode === "pr" ? "ship workspace changes" : "update workspace")
      const commitMessage = `${prefix}: ${subject}`
      let commitResult: any = { success: true, hash: "", message: commitMessage }
      if (hasChanges) {
        commitResult = await AgentBridge.commitGit(workspaceRoot, commitMessage)
        if (!commitResult.success) throw new Error(commitResult.error || "Could not create the Git commit.")
      }
      const pushResult = await AgentBridge.pushGit(workspaceRoot, branch)
      if (!pushResult.success) throw new Error(pushResult.error || "Could not push the Git branch.")
       let response = `Committed **${commitMessage}**${commitResult.hash ? ` (${commitResult.hash})` : ""} and pushed \`${branch}\`.`
      if (mode === "pr") {
        const prResult = await AgentBridge.createGitHubPullRequest(workspaceRoot, { title: commitMessage, body: `## Summary\n\n${commitMessage}\n\nCreated by Turaen from the desktop workspace.`, head: branch, base: "main" })
        if (!prResult.success) throw new Error(prResult.error || "Could not open the Pull Request.")
        setGitPullRequestUrl(prResult.url)
        response += `\n\n[Open Pull Request #${prResult.number}](${prResult.url})`
      }
      statusResult = await AgentBridge.getGitStatus(workspaceRoot)
      setGitStatus(statusResult)
      setGitBranch(statusResult.branch || branch)
      setInspectorOpen(true)
      setInspectorTab("changes")
      setMessages((current) => [...current, { id: createMessageId(), role: "assistant", content: response }])
      setStatus("ready")
    } catch (workflowError) {
      const message = workflowError instanceof Error ? workflowError.message : "Git workflow failed."
      setError(new Error(message))
      setMessages((current) => [...current, { id: createMessageId(), role: "assistant", content: `**Git Error:** ${message}` }])
      setStatus("error")
    }
  }

  const selectSlashCommand = (item: (typeof slashCommands)[number]) => {
    if (requiresProForSlashCommand(item.command, plan)) { requestUpgrade(`${item.command} is included with Turaen Pro.`); return }
    if (item.command === "/commit" || item.command === "/pr") {
      setLocalInput("")
      setMentionMode(null)
      void executeGitWorkflow(item.command.slice(1) as "commit" | "pr", item.command)
      return
    }
    if (item.command === "/clear") {
      startNewChat()
      setMentionMode(null)
      return
    }
    if (item.command === "/nightshift") {
      setNightShiftOpen(true)
      setMentionMode(null)
      return
    }
    const lineStart = Math.max(localInput.lastIndexOf("\n"), localInput.lastIndexOf(" ")) + 1
    setLocalInput(`${localInput.slice(0, lineStart)}${item.command} `)
    setMentionMode(null)
    setMentionQuery("")
    setMentionIndex(0)
    textareaRef.current?.focus()
  }

  const handleComposerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setLocalInput(value)
    event.currentTarget.style.height = "0px"
    event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 240)}px`
    const cursor = event.target.selectionStart
    const beforeCursor = value.slice(0, cursor)
    const mentionMatch = /(?:^|\s)@([^\s]*)$/.exec(beforeCursor)
    const commandMatch = /(?:^|\s)\/([^\s]*)$/.exec(beforeCursor)
    if (mentionMatch) {
      setMentionMode("mention")
      setMentionQuery(mentionMatch[1])
      setMentionIndex(0)
    } else if (commandMatch) {
      setMentionMode("command")
      setMentionQuery(commandMatch[1])
      setMentionIndex(0)
    } else {
      setMentionMode(null)
    }
  }

  const handleFolderSelect = async () => {
    try {
      if (AgentBridge.isElectron()) {
        const result = await AgentBridge.selectDirectory()
        if (result.success && result.path) {
          if (editingProject) {
            setDraftProjectFolders((current) =>
              current.includes(result.path!) ? current : [...current, result.path!]
            )
            return
          }
          const folderName = result.path.split(/[/\\]/).pop() || result.path
          const newProject: Project = {
            id: createMessageId(),
            name: folderName,
            files: [result.path],
            time: "Just now",
          }
          setProjects((prev) => [...prev.filter((p) => p.name !== folderName), newProject])
          setSelectedProject(newProject.name)
        }
      } else if ("showDirectoryPicker" in window) {
        const directoryHandle = await (window as any).showDirectoryPicker({ mode: "read" })
        const newProject: Project = {
            id: createMessageId(),
          name: directoryHandle.name,
          files: [],
          time: "Just now",
        }
        setProjects((prev) => [...prev.filter((p) => p.name !== directoryHandle.name), newProject])
        setSelectedProject(newProject.name)
      } else {
        folderInputRef.current?.click()
      }
    } catch (err) {
      console.log("Folder selection cancelled", err)
    }
  }

  const handleFolderFallback = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const folderName = file.webkitRelativePath.split(/[\\/]/)[0] || file.name
    const project: Project = { id: Date.now().toString(), name: folderName, files: [], time: "Just now" }
    setProjects((previous) => [...previous.filter((item) => item.name !== folderName), project])
    setSelectedProject(folderName)
    event.target.value = ""
  }

  const openProjectEditor = (project: Project) => {
    setEditingProject(project)
    setDraftProjectName(project.name)
    setDraftProjectFolders(project.files)
  }

  const saveProjectEditor = () => {
    if (!editingProject) return
    const name = draftProjectName.trim() || editingProject.name
    setProjects((current) =>
      current.map((project) => (project.id === editingProject.id ? { ...project, name, files: draftProjectFolders } : project))
    )
    if (selectedProject === editingProject.name) setSelectedProject(name)
    setEditingProject(null)
  }

  // Model Choices with Auto-Discovery of Local Models (References 4 & 5)
  const defaultLocalModelChoices: ModelChoice[] = [
    { value: "Local (Ollama)::qwen2.5-coder:3b", label: "qwen2.5-coder:3b", provider: "Local", detail: "3B lightweight · Local Engine", badge: "Free" },
    { value: "Local (Ollama)::qwen3:8b", label: "qwen3:8b", provider: "Local", detail: "8B parameters · Local Engine", badge: "PRO" },
    { value: "Local (Ollama)::qwen2.5-coder:7b", label: "qwen2.5-coder:7b", provider: "Local", detail: "7B code specialist · Local Engine", badge: "PRO" },
    { value: "Local (Ollama)::llama3.2:3b", label: "llama3.2:3b", provider: "Local", detail: "3B lightweight · Local Engine", badge: "Local" },
  ]

  const discoveredLocalChoices: ModelChoice[] = installedLocalModels.map((m) => ({
    value: `Local (Ollama)::${m.name}`,
    label: m.name,
    provider: "Local",
    detail: `${(m.sizeBytes / 1024 ** 3).toFixed(1)} GB · Ollama`,
    badge: "Installed",
    installed: true,
  }))

  const combinedLocalChoices: ModelChoice[] = [
    ...discoveredLocalChoices,
    ...defaultLocalModelChoices
      .filter((def) => !discoveredLocalChoices.some((disc) => disc.label === def.label))
      .map((def) => ({ ...def, unavailable: installedLocalModels.length > 0 })),
  ]

  const providerModelOptions: ModelChoice[] = [
    ...combinedLocalChoices,
    { value: "Account::Azure Enterprise Cloud (Llama 3.2)", label: "Turaen Cloud", provider: "Cloud", detail: "Secure managed model · Account", badge: "PRO" },
    { value: "BYOK::OpenAI GPT-4.1", label: "GPT-4.1", provider: "OpenAI", detail: "Bring your own API key", badge: "PRO" },
    { value: "BYOK::Anthropic Claude", label: "Claude", provider: "Anthropic", detail: "Bring your own API key", badge: "PRO" },
  ]

  const currentProviderModel = `${provider}::${selectedModel}`

  const selectProviderModel = (value: string) => {
    const separator = value.indexOf("::")
    const nextProvider = value.slice(0, separator)
    const nextModel = value.slice(separator + 2)
    if (requiresProForModel(nextProvider, nextModel, plan)) { requestUpgrade(nextProvider === "BYOK" ? "BYOK cloud providers are included with Turaen Pro." : "This model is a Pro model."); return }
    setProvider(nextProvider)
    setSelectedModel(nextModel)
    if (nextProvider === "Local (Ollama)") void localModelsBridge.load(nextModel)
  }

  const copyResponse = async (message: ChatMessage) => {
    const clean = message.role === "assistant" ? sanitizeAgentChatContent(message.content).content : message.content
    await navigator.clipboard.writeText(clean)
    setCopiedMessageId(message.id)
    window.setTimeout(() => setCopiedMessageId((current) => current === message.id ? null : current), 1600)
  }

  const recordFeedback = async (message: ChatMessage, rating: FeedbackRating, messageIndex: number) => {
    setFeedbackByMessage((current) => ({ ...current, [message.id]: rating }))
    const prompt = [...messages.slice(0, messageIndex)].reverse().find((item) => item.role === "user")
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: message.id,
          conversationId: activeChatId,
          rating,
          model: selectedModel,
          brandContext: activeBrand,
          promptSnippet: String(prompt?.content || "").slice(0, 500),
          responseSnippet: (message.role === "assistant" ? sanitizeAgentChatContent(message.content).content : message.content).slice(0, 1000),
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* Feedback remains visually selected if the network is offline. */ }
  }

  const userTurns = messages.filter((message) => message.role === "user")
  const scrollToTurn = (messageId: string) => messageRefs.current[messageId]?.scrollIntoView({ behavior: "smooth", block: "center" })

  // Grouped Projects Tree with Sessions
  const groupedWorkspaces = projects.map((p) => ({
    project: p,
    sessions: chatSessions.filter((s) => s.workspacePath === p.name),
  }))

  const unassignedSessions = chatSessions.filter(
    (s) => !s.workspacePath || !projects.some((p) => p.name === s.workspacePath)
  )

  const renderComposer = () => (
    <>
      {error && /Ollama|local AI/i.test(error.message) && <div role="alert" className="mx-auto mb-3 flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-[#3a3a3a] bg-[#1c1c1c] px-4 py-3 text-xs text-[#e5e5e5]"><span className="min-w-0 flex-1">{error.message}</span>{/ECONNREFUSED|timed out|Could not connect|did not become ready/i.test(error.message) && <button type="button" onClick={() => void startOllama()} disabled={startingOllama} className="shrink-0 rounded-full border border-transparent bg-[#0A0A0A] px-3 py-1.5 font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50 dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#E4E4E7]">{startingOllama ? "Starting…" : "Start Ollama"}</button>}{/not found|not installed|executable/i.test(error.message) && <><button type="button" onClick={() => void browseOllama()} className="shrink-0 rounded-full border border-[#555] px-3 py-1.5 font-medium">Browse…</button><button type="button" onClick={() => void installOllama()} disabled={installingOllama} className="shrink-0 rounded-full border border-transparent bg-[#0A0A0A] px-3 py-1.5 font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50 dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#E4E4E7]">{installingOllama ? "Installing…" : "Install Ollama"}</button></>}{/model.*(not found|missing)|pull/i.test(error.message) ? <button type="button" onClick={() => void pullOllamaModel()} className="shrink-0 rounded-full border border-transparent bg-[#0A0A0A] px-3 py-1.5 font-medium text-[#FAFAFA] hover:bg-[#27272A] dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#E4E4E7]">Pull Model</button> : !/ECONNREFUSED|timed out|Could not connect|did not become ready|not found|not installed|executable/i.test(error.message) && <button type="button" onClick={retryOllama} className="shrink-0 rounded-full border border-[#555] px-3 py-1.5 font-medium">Retry</button>}</div>}
      {terminalVisible && (
        <div className="mx-auto mb-3 w-full max-w-3xl">
          <IntegratedTerminalPanel
            cwd={workspaceRoot || undefined}
            workspaceRoot={workspaceRoot || undefined}
            shell={terminalShell}
            fontSize={terminalFontSize}
            onClose={() => setTerminalVisible(false)}
          />
        </div>
      )}

      {/* Toolbar Pill Row */}
      <div className="mx-auto mb-2 flex w-full max-w-3xl min-w-0 items-center gap-1.5 px-1 text-xs text-[#666666] dark:text-[#999999]">
        <button
          type="button"
          onClick={handleFolderSelect}
          title={workspaceRoot || "Choose project folder"}
          className="inline-flex max-w-[38%] min-w-0 h-[32px] items-center gap-1.5 truncate rounded-full px-3 py-1 bg-[#ffffff] dark:bg-[#1f1f1f] border border-[#e0e0e0] dark:border-[#333333] hover:bg-[#f5f5f5] dark:hover:bg-[#282828] transition-colors shadow-sm"
        >
          <FolderOpen size={14} className="shrink-0 text-[#000000] dark:text-[#ffffff]" />
          <span className="truncate font-medium text-[#000000] dark:text-[#ffffff]">
            {selectedProject || "Choose folder"}
          </span>
        </button>

        <span className="inline-flex shrink-0 h-[32px] items-center gap-1.5 rounded-full px-3 py-1 bg-[#ffffff] dark:bg-[#1f1f1f] border border-[#e0e0e0] dark:border-[#333333] text-[#000000] dark:text-[#ffffff] shadow-sm">
          <GitBranchIcon size={13} className="text-[#666666] dark:text-[#999999]" />
          <span className="font-medium">{gitBranch}</span>
        </span>
        {gitStatus?.repository?.name && <span className="inline-flex min-w-0 max-w-[28%] items-center gap-1.5 truncate rounded-full border border-[#e0e0e0] bg-[#ffffff] px-3 py-1 text-[#000000] shadow-sm dark:border-[#333333] dark:bg-[#1f1f1f] dark:text-[#ffffff]" title={gitStatus.repository.fullName}>
          <span className="truncate font-medium">{gitStatus.repository.name}</span>
          {(gitStatus.ahead || gitStatus.behind) ? <span className="shrink-0 text-[10px] text-[#777777] dark:text-[#aaaaaa]">↑{gitStatus.ahead || 0} ↓{gitStatus.behind || 0}</span> : <span className="shrink-0 text-[10px] text-emerald-600 dark:text-emerald-400">synced</span>}
        </span>}

        <button
          type="button"
          onClick={() => setTerminalVisible((visible) => !visible)}
          aria-expanded={terminalVisible}
          className={`ml-auto inline-flex shrink-0 h-[32px] items-center gap-1.5 rounded-full px-3.5 py-1 border transition-colors shadow-sm ${
            terminalVisible
              ? "bg-[#000000] text-[#ffffff] border-[#000000] dark:bg-[#ffffff] dark:text-[#111111] dark:border-[#ffffff] font-medium"
              : "bg-[#ffffff] dark:bg-[#1f1f1f] text-[#666666] dark:text-[#999999] border-[#e0e0e0] dark:border-[#333333] hover:bg-[#f5f5f5] dark:hover:bg-[#282828] hover:text-[#000000] dark:hover:text-[#ffffff]"
          }`}
        >
          <TerminalIcon className="h-3.5 w-3.5" />
          <span>Terminal</span>
        </button>
      </div>

      {/* Floating Prompt Composer Card (24px radius, layered elevation) */}
      <div className="ideaai-composer relative mx-auto w-full max-w-3xl min-w-0 overflow-visible rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.18)]">
        {(pastedImages.length > 0 || attachedFiles.length > 0 || workspaceMentions.length > 0) && (
          <div className="flex min-w-0 flex-wrap gap-2 px-4 pt-3">
            {pastedImages.map((image, index) => (
              <div key={`image-${index}`} className="relative">
                <img src={image} alt="Attached preview" className="h-12 w-12 rounded-[12px] object-cover" />
                <button
                  type="button"
                  onClick={() => setPastedImages((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label="Remove image"
                  className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-black text-white dark:bg-white dark:text-black text-xs shadow-sm"
                >
                  ×
                </button>
              </div>
            ))}
            {attachedFiles.map((name, index) => (
              <button
                type="button"
                key={`${name}-${index}`}
                onClick={() => setAttachedFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                className="max-w-full truncate rounded-full bg-[#f1f1f1] dark:bg-[#262626] px-3 py-1 text-xs text-[#444444] dark:text-[#cccccc]"
              >
                {name} ×
              </button>
            ))}
            {workspaceMentions.map((file) => (
              <button
                type="button"
                key={file.path}
                onClick={() => setWorkspaceMentions((items) => items.filter((item) => item.path !== file.path))}
                className="inline-flex max-w-full items-center gap-1 truncate rounded-full border border-[#3d3d3d] bg-[#2a2a2a] px-3 py-1 text-xs text-[#f5f5f5] dark:border-[#3d3d3d] dark:bg-[#2a2a2a]"
                title={file.path}
              >
                <Code2 size={12} className="shrink-0" />
                <span className="truncate">@{file.path}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={localInput}
          onChange={handleComposerChange}
          onPaste={handleImagePaste}
          onKeyDown={handleKeyDown}
          placeholder="Ask to make changes, @mention files, or run /commands."
          className="block min-h-[88px] max-h-[240px] w-full min-w-0 resize-none overflow-y-auto bg-transparent px-5 py-4 text-sm leading-6 text-zinc-900 dark:text-[#F5F5F5] outline-none placeholder:text-[#8E8E8E]"
        />

        {mentionMode && (
          <div className="absolute bottom-[92px] left-3 z-30 max-h-64 w-[min(92%,520px)] overflow-y-auto rounded-2xl border border-[#e0e0e0] bg-white p-1 shadow-2xl dark:border-[#333333] dark:bg-[#171717]">
            {mentionMode === "mention" ? (
              workspaceEntries.filter((entry) => entry.path.toLowerCase().includes(mentionQuery.toLowerCase())).map((entry, index) => (
                <button key={entry.path} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => void selectWorkspaceMention(entry)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${index === mentionIndex ? "bg-zinc-100 dark:bg-[#2a2a2a]" : "hover:bg-zinc-50 dark:hover:bg-[#222222]"}`}>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{entry.isDirectory ? "DIR" : "FILE"}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-900 dark:text-[#F5F5F5]">{entry.path}</span>
                </button>
              ))
            ) : (
              slashCommands.filter((item) => item.command.startsWith(`/${mentionQuery.toLowerCase()}`)).map((item, index) => {
                const Icon = item.icon
                return <button key={item.command} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectSlashCommand(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${index === mentionIndex ? "bg-zinc-100 dark:bg-[#2a2a2a]" : "hover:bg-zinc-50 dark:hover:bg-[#222222]"}`}><Icon size={15} className="text-zinc-500 dark:text-zinc-400" /><span className="min-w-0"><span className="block text-sm text-zinc-900 dark:text-[#F5F5F5]">{item.command}</span><span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{item.description}</span></span></button>
              })
            )}
          </div>
        )}

        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 px-3 pb-3 pt-1">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => attachmentInputRef.current?.click()}
              title="Attach images or files"
              aria-label="Attach images or files"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <span className="max-w-36 truncate rounded-full bg-[#f1f1f1] dark:bg-[#262626] px-3 py-1 text-[11px] font-medium text-[#666666] dark:text-[#999999]">
              {status === "ready" ? "Ready" : status === "error" ? "Needs attention" : "Working"}
            </span>
            <div className="relative">
              <button type="button" onClick={() => setApprovalMenuOpen((open) => !open)} aria-expanded={approvalMenuOpen} className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-medium transition-colors ${approvalMode === APPROVAL_AUTONOMY ? "border-amber-400/40 text-amber-600 dark:text-amber-400" : "border-[#e0e0e0] text-[#777] hover:bg-black/5 dark:border-[#303030] dark:text-[#aaa] dark:hover:bg-white/10"}`}>
                {approvalMode === APPROVAL_MANUAL ? <Hand size={12} /> : approvalMode === APPROVAL_AUTONOMY ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                <span>{approvalMode}</span>
              </button>
              {approvalMenuOpen && <div className="absolute bottom-9 left-0 z-40 w-72 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white p-1.5 shadow-2xl dark:border-[#333] dark:bg-[#171717]">
                {[
                  { mode: APPROVAL_MANUAL, icon: Hand, label: APPROVAL_MANUAL, detail: "Ask before editing files or running terminal commands" },
                  { mode: APPROVAL_GUARD, icon: ShieldCheck, label: APPROVAL_GUARD, detail: "Auto-approve safe workspace actions; ask only for high-impact operations" },
                  { mode: APPROVAL_AUTONOMY, icon: ShieldAlert, label: APPROVAL_AUTONOMY, detail: "Direct terminal and file execution without confirmation prompts" },
                ].map((item) => { const Icon = item.icon; return <button key={item.mode} type="button" onClick={() => setExecutionMode(item.mode)} className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${approvalMode === item.mode ? "bg-black/[0.04] dark:bg-white/[0.06]" : ""}`}><Icon size={16} className={`mt-0.5 shrink-0 ${item.mode === APPROVAL_AUTONOMY ? "text-amber-500" : "text-[#666] dark:text-[#aaa]"}`} /><span><span className={`block text-xs font-medium ${item.mode === APPROVAL_AUTONOMY ? "text-amber-600 dark:text-amber-400" : "text-[#222] dark:text-[#eee]"}`}>{item.label}</span><span className="mt-0.5 block text-[10px] leading-4 text-[#777] dark:text-[#999]">{item.detail}</span></span></button> })}
              </div>}
            </div>
            <button type="button" onClick={() => setCommandPaletteOpen(true)} className="hidden h-7 items-center gap-1 rounded-full border border-[#e0e0e0] px-2 text-[10px] text-[#888] hover:bg-black/5 dark:border-[#303030] dark:hover:bg-white/10 sm:inline-flex" title="Command palette"><span>⌘K</span></button>
            <span title={plan.localEntitlement ? "Local development entitlement · unlimited usage" : undefined} className="rounded-full border border-[#e0e0e0] px-2.5 py-1 text-[10px] font-semibold tracking-wide dark:border-[#303030]">{isPro(plan) ? (plan.localEntitlement ? "PRO · LOCAL" : "PRO") : "FREE"}</span>
            {lastTelemetry && <span className="hidden truncate text-[10px] text-[#888] md:inline">{lastTelemetry.seconds.toFixed(1)}s · {lastTelemetry.tokPerSecond} tok/s · {lastTelemetry.hardware}</span>}
          </div>

          <div className="ml-auto flex min-w-0 max-w-full items-center gap-2">
            <ProviderModelPicker
              value={
                providerModelOptions.some((item) => item.value === currentProviderModel)
                  ? currentProviderModel
                  : "Local (Ollama)::qwen2.5-coder:3b"
              }
              choices={providerModelOptions}
              onChange={selectProviderModel}
              onOpenManageModels={() => {
                setSettingsTab("provider-local")
                setIsSettingsOpen(true)
              }}
            />
            {/* Circular Monochrome CTA Button */}
            <button
              type="button"
              onClick={handleCustomSubmit}
              disabled={
                !localInput.trim() &&
                pastedImages.length === 0 &&
                attachedFiles.length === 0 &&
                workspaceMentions.length === 0 &&
                status !== "submitted"
              }
              aria-label={status === "submitted" ? "Stop response" : "Send message"}
              className="ideaai-primary-action grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform active:scale-95 disabled:opacity-30 shadow-sm"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )

  // Never render an empty assistant turn (created by an older stream race).
  const renderedMessages = useMemo(
    () => messages.filter((message) => message.role !== "assistant" || sanitizeAgentChatContent(message.content).content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim().length > 0),
    [messages],
  )

  return (
    <div
      data-research-lab
      className="ideaai-canvas flex h-screen w-full select-none flex-col overflow-hidden transition-colors"
    >
      <input type="file" ref={folderInputRef} onChange={handleFolderFallback} className="hidden" />
      <input
        type="file"
        ref={attachmentInputRef}
        accept="image/*,.pdf,.txt,.md,.ts,.tsx,.js,.jsx,.json"
        multiple
        onChange={handleAttachmentChange}
        className="hidden"
      />

      <DesktopTitlebar
        projectName={selectedProject}
        inspectorOpen={inspectorOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onToggleInspector={() => setInspectorOpen((open) => !open)}
      />

      <div className="ideaai-canvas relative flex min-h-0 flex-1">
        {/* ========================================================= */}
        {/* LEFT COMPACT ICON RAIL (32px / 40px icon rhythm)          */}
        {/* ========================================================= */}
        <nav
          aria-label="Main navigation"
          className="ideaai-rail flex w-[56px] shrink-0 flex-col items-center gap-2 border-r py-3"
        >
          <button
            type="button"
            onClick={startNewChat}
            title="Workspace"
            aria-label="Workspace"
            className="grid h-9 w-9 place-items-center rounded-full bg-black/5 dark:bg-white/10 text-[#000000] dark:text-[#ffffff] transition-colors"
          >
            <House size={16} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={() => setNightShiftOpen(true)}
            title="Night Shift"
            aria-label="Night Shift"
            className="grid h-9 w-9 place-items-center rounded-full text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors"
          >
            <Moon size={16} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={() => setSkillsModalOpen(true)}
            title="Skills (Customizations)"
            aria-label="Skills"
            className="grid h-9 w-9 place-items-center rounded-full text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors"
          >
            <Sparkles size={16} strokeWidth={1.8} />
          </button>

          <div className="mt-auto flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(true)}
              title="Give Feedback"
              aria-label="Give Feedback"
              className="grid h-9 w-9 place-items-center rounded-full text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors"
            >
              <MessageSquare size={16} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => {
                setSettingsTab("general")
                setIsSettingsOpen(true)
              }}
              title="Settings"
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-full text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors"
            >
              <Settings2 size={16} strokeWidth={1.8} />
            </button>

            <span
          title={userName || "Turaen account"}
              className="grid h-7 w-7 place-items-center rounded-full bg-[#e0e0e0] dark:bg-[#262626] text-[10px] font-semibold text-[#000000] dark:text-[#ffffff]"
            >
              {(userName || "IA").slice(0, 2).toUpperCase()}
            </span>
          </div>
        </nav>

        {/* ========================================================= */}
        {/* LEFT EXPANDED SIDEBAR (References 6, 7 & 9)              */}
        {/* ========================================================= */}
        {sidebarOpen && (
          <aside className="ideaai-sidebar flex w-[260px] shrink-0 flex-col overflow-hidden border-r">
            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-6">
              {/* Header / Brand */}
              <div className="flex items-center justify-between px-2">
                <button type="button" onClick={startNewChat} className="flex items-center gap-2.5">
                  <IdeaAILogo className="h-6 w-6" />
                  <span className="text-sm font-semibold tracking-tight text-[#000000] dark:text-[#ffffff]">
                    Turaen
                  </span>
                </button>
                <button type="button" onClick={() => { setSettingsTab("provider-account"); setIsSettingsOpen(true) }} className="relative grid h-8 w-8 place-items-center rounded-full border border-black/10 text-xs font-semibold text-[#555] transition hover:bg-black/5 dark:border-white/15 dark:text-[#ccc] dark:hover:bg-white/10" aria-label="Open profile and billing">
                  {(userName || userEmail || "U").slice(0, 1).toUpperCase()}{isPro(plan) && <span title={plan.localEntitlement ? "Local development entitlement · unlimited usage" : "Pro plan active"} aria-hidden="true" className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">+</span>}
                </button>
              </div>

              {/* Primary Nav Actions (References 6 & 7) */}
              <div className="space-y-1">
                {/* + New Session Button (Monochrome Pill) */}
                <button
                  type="button"
                  onClick={startNewChat}
                  className="ideaai-primary-action flex h-[38px] w-full items-center gap-2 rounded-[40px] px-4 text-button-token font-medium transition-transform active:scale-95 shadow-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>New Session</span>
                </button>
                <button type="button" onClick={() => { setSettingsTab("provider-account"); setIsSettingsOpen(true) }} title={plan.localEntitlement ? "Local development entitlement · unlimited usage" : undefined} className="flex h-[36px] w-full items-center justify-between rounded-full border border-black/[0.06] bg-black/[0.025] px-3 text-sm font-medium text-[#444] transition-colors hover:bg-black/[0.07] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#ccc] dark:hover:bg-white/[0.09]"><span>See plans</span><span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] dark:bg-white/10">{isPro(plan) ? "Pro" : "Free"}</span></button>

                {/* Night Shift in primary sidebar */}
                <button
                  type="button"
                  onClick={() => setNightShiftOpen(true)}
                  className="flex h-[36px] w-full items-center justify-between rounded-full px-3 text-sm font-medium text-[#444444] dark:text-[#cccccc] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-[#000000] dark:text-[#ffffff]" />
                    <span>Night Shift</span>
                  </div>
                  <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px] text-[#666666] dark:text-[#999999]">
                    Local
                  </span>
                </button>

                {/* Skills in primary sidebar */}
                <button
                  type="button"
                  onClick={() => setSkillsModalOpen(true)}
                  className="flex h-[36px] w-full items-center justify-between rounded-full px-3 text-sm font-medium text-[#444444] dark:text-[#cccccc] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#000000] dark:text-[#ffffff]" />
                    <span>Skills</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px]">
                    Zero-Egress
                  </span>
                </button>
              </div>

              {/* Grouped Projects Tree */}
              <section className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <h2 className="headline-lg text-xs font-medium text-[#888888] dark:text-[#777777]">
                    Projects
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const project = projects.find((item) => item.name === selectedProject)
                        if (project) openProjectEditor(project)
                      }}
                      disabled={!projects.length}
                      aria-label="Edit project"
                      title="Edit project"
                      className="grid h-6 w-6 place-items-center rounded-full text-[#666666] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
                    >
                      ···
                    </button>
                    <button
                      type="button"
                      onClick={handleFolderSelect}
                      aria-label="Add project folder"
                      title="Add folder"
                      className="grid h-6 w-6 place-items-center rounded-full text-[#666666] hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {projects.length === 0 ? (
                    <p className="px-2 text-xs text-[#888888] dark:text-[#777777]">
                      Select a workspace to start.
                    </p>
                  ) : (
                    groupedWorkspaces.map(({ project, sessions }) => {
                      const isSelected = selectedProject === project.name
                      return (
                        <div key={project.id} className="space-y-1">
                          <div
                            className={`group flex items-center justify-between rounded-[12px] px-2.5 py-1.5 transition-colors ${
                              isSelected
                                ? "bg-[#f1f1f1] dark:bg-[#222222] text-[#000000] dark:text-[#ffffff]"
                                : "text-[#555555] dark:text-[#aaaaaa] hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedProject(project.name)}
                              className="flex items-center gap-2 truncate text-left text-xs font-medium"
                            >
                              <FolderOpen size={13} className="shrink-0" />
                              <span className="truncate">{project.name}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openProjectEditor(project)}
                              className="text-[10px] text-[#999999] opacity-0 group-hover:opacity-100 hover:text-black dark:hover:text-white"
                            >
                              ···
                            </button>
                          </div>

                          {/* Nested sessions under active project */}
                          {isSelected && sessions.length > 0 && (
                            <div className="ml-4 space-y-0.5 border-l border-[#e0e0e0] dark:border-[#262626] pl-2">
                              {sessions.slice(0, 5).map((session) => (
                                <button
                                  key={session.id}
                                  type="button"
                                  onClick={() => openChat(session)}
                                  className={`flex w-full items-center justify-between truncate rounded-md px-2 py-1 text-left text-[11px] transition-colors ${
                                    activeChatId === session.id
                                      ? "bg-black/5 dark:bg-white/10 font-medium text-[#000000] dark:text-[#ffffff]"
                                      : "text-[#777777] dark:text-[#888888] hover:bg-black/5 dark:hover:bg-white/5"
                                  }`}
                                >
                                  <span className="truncate">{session.title}</span>
                                  <span className="shrink-0 text-[10px] text-[#aaaaaa] dark:text-[#666666]">
                                    {formatRelativeTimestamp(session.updatedAt)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </section>

              {/* Recent Sessions */}
              {unassignedSessions.length > 0 && (
                <section className="space-y-2">
                  <h2 className="headline-lg px-2 text-xs font-medium text-[#888888] dark:text-[#777777]">
                    Recent
                  </h2>
                  <div className="space-y-0.5">
                    {unassignedSessions.slice(0, 10).map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => openChat(session)}
                        className={`flex w-full items-center justify-between truncate rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                          activeChatId === session.id
                            ? "bg-[#f1f1f1] dark:bg-[#222222] font-medium text-[#000000] dark:text-[#ffffff]"
                            : "text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{session.title}</span>
                        <span className="shrink-0 text-[10px] text-[#aaaaaa] dark:text-[#666666]">
                          {formatRelativeTimestamp(session.updatedAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Footer with Settings & Give Feedback (Reference 9) */}
            <div className="ideaai-sidebar border-t p-3 space-y-1">
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(true)}
                className="flex h-[32px] w-full items-center gap-2 rounded-full px-3 text-xs font-medium text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors"
              >
                <MessageSquare size={13} />
                <span>Give Feedback</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettingsTab("general")
                  setIsSettingsOpen(true)
                }}
                className="flex h-[32px] w-full items-center gap-2 rounded-full px-3 text-xs font-medium text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors"
              >
                <Settings2 size={13} />
                <span>Settings</span>
              </button>
            </div>
          </aside>
        )}

        {/* ========================================================= */}
        {/* MAIN VIEW AREA                                            */}
        {/* ========================================================= */}
        <main className="ideaai-canvas relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* CENTER CONTENT: EMPTY STATE (REFERENCE 8) OR ACTIVE CONVERSATION */}
          {messages.length === 0 ? (
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden justify-between">
              <div className="grid min-h-0 flex-1 place-items-center px-5 text-center">
                <div className="flex flex-col items-center gap-4 max-w-xl">
                  <TuraenLogo className="h-12 w-12 text-[#0A0A0A] dark:text-[#FAFAFA]" />
                  <h1 className="headline-display tracking-tight text-[#000000] dark:text-[#ffffff]">
                    Good to see you{userName ? `, ${userName}` : ""}. What's next?
                  </h1>
                  <p className="body-md text-[#666666] dark:text-[#999999]">
                    Type a task below to run local models, inspect code, or queue an overnight self-healing shift.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setNightShiftOpen(true)}
                      className="inline-flex h-[34px] items-center gap-1.5 rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1f1f1f] px-4 text-xs font-medium text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#282828] transition-colors shadow-sm"
                    >
                      <Moon size={12} className="text-[#000000] dark:text-[#ffffff]" />
                      <span>night shift</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSkillsModalOpen(true)}
                      className="inline-flex h-[34px] items-center gap-1.5 rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1f1f1f] px-4 text-xs font-medium text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#282828] transition-colors shadow-sm"
                    >
                      <Sparkles size={12} className="text-[#000000] dark:text-[#ffffff]" />
                      <span>skills</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-6 sm:px-6">{renderComposer()}</div>
            </section>
          ) : (
            <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              <div ref={chatViewportRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
                {userTurns.length > 0 && <nav aria-label="Conversation turns" className="absolute left-0 top-1/2 z-20 hidden w-3 -translate-y-1/2 flex-col items-center gap-1.5 md:flex">{userTurns.map((turn, turnIndex) => <button key={turn.id} type="button" onClick={() => scrollToTurn(turn.id)} title={turn.content.slice(0, 120)} aria-label={`Jump to turn ${turnIndex + 1}`} className={`group relative h-0.5 rounded-full transition-all ${activeTurnId === turn.id ? "w-3 bg-[#0A0A0A] dark:bg-[#FAFAFA]" : "w-2 bg-[#c4c4c4] hover:w-3 hover:bg-[#777] dark:bg-[#555] dark:hover:bg-[#aaa]"}`}><span className="pointer-events-none absolute left-4 top-1/2 hidden w-52 -translate-y-1/2 rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-left text-[10px] leading-4 text-[#444] shadow-xl group-hover:block dark:border-[#333] dark:bg-[#202020] dark:text-[#ddd]">{turn.content.slice(0, 140)}{turn.content.length > 140 ? "…" : ""}</span></button>)}</nav>}
                <div className="mx-auto w-full max-w-3xl space-y-6 pb-6">
                  {renderedMessages.map((message, index) => (
                    <motion.div
                      key={`${message.id || "message"}-${index}`}
                      ref={(node) => { messageRefs.current[message.id] = node }}
                      data-message-id={message.id}
                      data-turn-id={renderedMessages.slice(0, index + 1).reverse().find((item) => item.role === "user")?.id || message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`ideaai-message-content min-w-0 max-w-[90%] break-words select-text text-sm leading-6 ${
                          message.role === "user"
                            ? "rounded-[18px] border border-[#e0e0e0] bg-zinc-100 px-4 py-3 text-zinc-900 dark:border-[#3D3D3D] dark:bg-[#2A2A2A] dark:text-[#F5F5F5]"
                            : "text-zinc-900 dark:text-[#F5F5F5]"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === "assistant" && <TuraenLogo className="mt-1 h-4 w-4 shrink-0 text-[#0A0A0A] dark:text-[#FAFAFA]" />}
                          <AntigravityMarkdown
                            content={message.content}
                            onApplyToFile={applyCodeToFile}
                            sanitize={message.role === "assistant"}
                            elapsedSeconds={(status === "submitted" || status === "streaming") && index === renderedMessages.length - 1 ? thinkingSeconds : undefined}
                            meta={message.role === "assistant" ? {
                              model: message.model || (index === renderedMessages.length - 1 && (status === "submitted" || status === "streaming") ? selectedModel : undefined),
                              durationSeconds: message.durationSeconds ?? (index === renderedMessages.length - 1 && (status === "submitted" || status === "streaming") ? thinkingSeconds : undefined),
                              tokensPerSecond: message.tokensPerSecond ?? (index === renderedMessages.length - 1 ? lastTelemetry?.tokPerSecond : undefined),
                            } : undefined}
                          />
                        </div>
                        {message.role === "assistant" && <div className="mt-2 flex items-center gap-1 border-t border-black/[0.06] pt-2 text-[#888] dark:border-white/[0.08] dark:text-[#999]">
                          <button type="button" onClick={() => void copyResponse(message)} title="Copy full response" aria-label="Copy full response" className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] hover:bg-black/5 dark:hover:bg-white/10">{copiedMessageId === message.id ? <Check size={12} /> : <Clipboard size={12} />}<span>{copiedMessageId === message.id ? "Copied" : "Copy"}</span></button>
                          <button type="button" onClick={() => void recordFeedback(message, "like", messages.findIndex((item) => item.id === message.id))} title="Good response" aria-label="Good response" className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] hover:bg-black/5 dark:hover:bg-white/10 ${feedbackByMessage[message.id] === "like" ? "text-emerald-600 dark:text-emerald-400" : ""}`}><ThumbsUp size={12} /><span>Good response</span></button>
                          <button type="button" onClick={() => void recordFeedback(message, "unlike", messages.findIndex((item) => item.id === message.id))} title="Bad response" aria-label="Bad response" className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] hover:bg-black/5 dark:hover:bg-white/10 ${feedbackByMessage[message.id] === "unlike" ? "text-red-600 dark:text-red-400" : ""}`}><ThumbsDown size={12} /><span>Bad response</span></button>
                        </div>}
                      </div>
                    </motion.div>
                  ))}
                  {status === "submitted" && (
                    <div className="flex items-center gap-2 px-1 py-2 text-xs text-[#666666] dark:text-[#999999]">
                      <IdeaAILogo className="h-4 w-4 opacity-50 grayscale" />
                      <span className="rounded-full border border-black/[0.08] px-2 py-0.5 font-medium dark:border-white/[0.1]">{activeBrand}</span>
                      <span>Working… {Math.max(1, thinkingSeconds)}s</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-6 sm:px-6">{renderComposer()}</div>
            </section>
          )}
        </main>

        {inspectorOpen && (
          <WorkspaceInspector
            tab={inspectorTab}
            onTabChange={setInspectorTab}
            steps={planSteps}
            changes={workspaceChanges}
            onRevert={(change) => void revertWorkspaceChange(change)}
            onAccept={acceptWorkspaceChange}
          />
        )}
        {inspectorOpen && gitPullRequestUrl && (
          <div className="pointer-events-auto absolute bottom-4 right-4 z-20 rounded-xl border border-emerald-500/30 bg-white/95 px-3 py-2 text-xs shadow-xl backdrop-blur dark:bg-[#171717]/95">
            <span className="mr-2 text-[#666666] dark:text-[#aaaaaa]">Pull Request ready</span>
            <a href={gitPullRequestUrl} target="_blank" rel="noreferrer" className="font-medium text-emerald-600 underline underline-offset-2 dark:text-emerald-400">Open on GitHub</a>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      {editingProject && (
        <div data-research-lab className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-edit-title"
            className="w-full max-w-xl rounded-[24px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#111111] text-[#000000] dark:text-[#ffffff] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]">
                  Workspace project
                </p>
                <h2 id="project-edit-title" className="mt-1 headline-md text-xl font-medium tracking-tight">
                  Edit project
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-[#888888] hover:bg-black/5 dark:hover:bg-white/5"
              >
                ×
              </button>
            </div>
            <label className="mt-5 block text-xs font-medium text-[#666666] dark:text-[#999999]">
              Project name
              <input
                value={draftProjectName}
                onChange={(event) => setDraftProjectName(event.target.value)}
                className="mt-2 w-full h-[40px] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-transparent px-4 text-sm text-[#000000] dark:text-[#ffffff] outline-none focus:border-black dark:focus:border-white"
              />
            </label>
            <div className="mt-5 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#666666] dark:text-[#999999]">Source folders</h3>
              <span className="text-[10px] text-[#888888]">{draftProjectFolders.length}</span>
            </div>
            <div className="mt-2 max-h-48 overflow-y-auto rounded-[16px] border border-[#e0e0e0] dark:border-[#333333] bg-[#fafafa] dark:bg-[#161616]">
              {draftProjectFolders.map((folder) => (
                <div
                  key={folder}
                  className="flex items-center gap-3 border-b border-[#e0e0e0] dark:border-[#222222] px-4 py-3 last:border-b-0"
                >
                  <span className="min-w-0 flex-1 truncate text-xs text-[#555555] dark:text-[#aaaaaa]" title={folder}>
                    {folder.split(/[\\/]/).filter(Boolean).pop() || folder}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDraftProjectFolders((items) => items.filter((item) => item !== folder))}
                    aria-label={`Remove ${folder}`}
                    className="grid h-7 w-7 place-items-center rounded-full text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleFolderSelect}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="text-sm">＋</span>Add source folder
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setProjects((items) => items.filter((item) => item.id !== editingProject.id))
                  if (selectedProject === editingProject.name) setSelectedProject(null)
                  setEditingProject(null)
                }}
                className="rounded-full bg-red-500/10 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20"
              >
                Remove project
              </button>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-full px-4 py-2 text-xs text-[#777777] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveProjectEditor}
                  className="h-[36px] px-5 rounded-[40px] bg-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#111111] text-button-token font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Approval Dialog */}
      {pendingApproval && (
        <div data-research-lab className="fixed inset-0 z-[95] grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-title"
            className="w-full max-w-md rounded-[24px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#111111] text-[#000000] dark:text-[#ffffff] p-5 shadow-2xl"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
              Agent approval
            </p>
            <h2 id="approval-title" className="mt-2 text-lg font-semibold tracking-tight">
              {pendingApproval.title}
            </h2>
            <pre className="mt-4 max-h-48 overflow-auto rounded-[14px] bg-[#f5f5f5] dark:bg-[#181818] p-3 text-xs leading-5 text-[#555555] dark:text-[#cccccc] font-mono">
              {pendingApproval.detail}
            </pre>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => resolveApproval(false)}
                className="h-[36px] px-4 rounded-full text-xs text-[#777777] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => resolveApproval(true)}
                className="h-[36px] px-5 rounded-[40px] bg-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#111111] text-button-token font-medium"
              >
                Approve
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsTab}
        userEmail={userEmail}
        onUseModel={selectLocalModel}
        plan={plan}
        onPlanChange={updatePlan}
      />

      <SkillsModal
        isOpen={skillsModalOpen}
        onClose={() => setSkillsModalOpen(false)}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

      <NightShiftPanel
        isOpen={nightShiftOpen}
        onClose={() => setNightShiftOpen(false)}
        currentWorkspaceRoot={workspaceRoot}
        onSelectWorkspace={handleFolderSelect}
        onOpenModelHub={() => {
          setNightShiftOpen(false)
          setSettingsTab("provider-local")
          setIsSettingsOpen(true)
        }}
        plan={plan}
        onUpgrade={requestUpgrade}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenNightShift={() => setNightShiftOpen(true)}
        onOpenSettings={() => { setSettingsTab("general"); setIsSettingsOpen(true) }}
        onOpenBilling={() => { setSettingsTab("provider-account"); setIsSettingsOpen(true) }}
        onRunGit={() => { setInspectorTab("changes"); setInspectorOpen(true) }}
        onFocusComposer={() => textareaRef.current?.focus()}
        onSwitchModel={() => { setSettingsTab("provider-local"); setIsSettingsOpen(true) }}
        onRunCommand={(command) => { if (requiresProForSlashCommand(command, plan)) { requestUpgrade(`${command} is included with Turaen Pro.`); return } setLocalInput(`${command} `); textareaRef.current?.focus() }}
      />
      <UpgradeModal isOpen={Boolean(upgradeReason)} reason={upgradeReason || undefined} plan={plan} onClose={() => setUpgradeReason(null)} />
      {upgradeSuccess && <div className="fixed inset-0 z-50 grid place-items-center bg-emerald-600/95 p-6 text-white"><div className="flex max-w-md flex-col items-center text-center"><motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="grid h-24 w-24 place-items-center rounded-full border-4 border-white/80 bg-white text-emerald-600 shadow-2xl"><CheckCircle2 className="h-14 w-14" strokeWidth={2.5} /></motion.div><h2 className="mt-7 text-3xl font-semibold tracking-tight">Turaen Pro is active</h2><p className="mt-3 text-sm text-white/85">Your workspace has been upgraded. Full local models, cloud providers, and Night Shift automation are now available.</p><button type="button" onClick={() => setUpgradeSuccess(false)} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50">Continue to workspace</button></div></div>}
    </div>
  )
}
