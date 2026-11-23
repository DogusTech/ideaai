"use client"

import React, { useState, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Brain, Check, CheckCircle2, ChevronDown, Circle, CircleDashed, Clipboard, FilePlus2, Terminal, Pencil, Search, BriefcaseBusiness } from "lucide-react"
import { sanitizeAgentChatContent } from "@/lib/agent-reply"

type ChunkType = 'text' | 'think' | 'modify' | 'new' | 'delete'

interface ParsedChunk {
  type: ChunkType | 'activity'
  content: string
  isStreaming?: boolean
  activity?: Activity
}

type LanguageKind = {
  label: string
  color: string
  background: string
}

function languageForPath(path: string): LanguageKind {
  const extension = path.split(/[./\\]/).pop()?.toLowerCase() || ""
  const languages: Record<string, LanguageKind> = {
    ts: { label: "TS", color: "#3178c6", background: "#e8f1fb" },
    tsx: { label: "TSX", color: "#3178c6", background: "#e8f1fb" },
    js: { label: "JS", color: "#8a6d00", background: "#fff7c7" },
    jsx: { label: "JSX", color: "#087ea4", background: "#e5f8ff" },
    css: { label: "CSS", color: "#1572b6", background: "#e8f4ff" },
    scss: { label: "SCSS", color: "#c6538c", background: "#fff0f7" },
    html: { label: "HTML", color: "#d14", background: "#fff0ed" },
    json: { label: "JSON", color: "#8a6d00", background: "#fff7c7" },
    py: { label: "PY", color: "#3776ab", background: "#eaf3ff" },
    go: { label: "GO", color: "#00add8", background: "#e6faff" },
    rs: { label: "RS", color: "#b7410e", background: "#fff0e8" },
    java: { label: "JAVA", color: "#b07219", background: "#fff3df" },
    sql: { label: "SQL", color: "#336791", background: "#eaf2fb" },
    md: { label: "MD", color: "#525252", background: "#f1f1f1" },
    yml: { label: "YML", color: "#cb171e", background: "#fff0f0" },
    yaml: { label: "YAML", color: "#cb171e", background: "#fff0f0" },
  }
  return languages[extension] || { label: "FILE", color: "#737373", background: "#f1f1f1" }
}

function LanguageIcon({ path, size = "sm" }: { path: string; size?: "sm" | "md" }) {
  const isReactFile = path.split(/[./\\]/).pop()?.toLowerCase() === "tsx"
  if (!isReactFile) return null

  return (
    <img
      src="/icon.png"
      alt="React"
      title="React"
      className={`inline-block shrink-0 object-contain ${size === "md" ? "h-5 w-5" : "h-4 w-4"}`}
    />
  )
}

type Activity = {
  kind: "view" | "edit" | "search" | "thought" | "create" | "delete" | "terminal" | "brand" | "verify"
  label: string
  target?: string
  additions?: number
  deletions?: number
  duration?: string
}

function normalizeActivityText(text: string): string {
  return text.replace(
    /<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi,
    (match, path, content) => {
      const additions = String(content).split(/\r?\n/).filter((line: string) => line.trim()).length;
      return `\n[NEW] ${path} (+${additions} -0)\n`;
    }
  ).replace(
    /\[(MODIFY|NEW)\]\s+([^\n]+)\s*\n+\[NEW\]\s+\2\s+\(\+(\d+)\s+-0\)/gi,
    "[$1] $2 (+$3 -0)"
  );
}

/** Stateless activity parser so text and action rows keep their source order. */
function parseActivityLine(rawLine: string): Activity | null {
  const line = rawLine.trim()
  if (!line) return null

  const thought = line.match(/^Thought for\s+(.+)$/i)
  if (thought) return { kind: "thought", label: "Thought", duration: thought[1] }

  const command = line.match(/^\[COMMAND\]\s+(.+)$/i)
  if (command) return { kind: "terminal", label: "Terminal", target: command[1].trim() }

  const brand = line.match(/^(?:Brand|Workspace)\s+(.+)$/i)
  if (brand) return { kind: "brand", label: "Workspace", target: brand[1].trim() }

  const verification = line.match(/^\[VERIFY\]\s+(.+)$/i)
  if (verification) return { kind: "verify", label: "Verified", target: verification[1].trim() }

  const edit = line.match(/^(?:Edit|Edited)\s+(.+?)(?:\s*\+(\d+)\s*-?\s*(\d+))?$/i)
  if (edit) {
    return {
      kind: "edit",
      label: "Edit",
      target: edit[1].trim(),
      additions: Number(edit[2] || 0),
      deletions: Number(edit[3] || 0),
    }
  }

  const view = line.match(/^(?:View|Viewed)\s+(.+)$/i)
  if (view) return { kind: "view", label: "View", target: view[1].trim() }

  const search = line.match(/^(?:Search(?:ed)?|Searched)\s+(.+)$/i)
  if (search) return { kind: "search", label: "Search", target: search[1].trim() }

  const action = line.match(/^\[(MODIFY|NEW|DELETE)\]\s+(.+?)(?:\s*\(\+(\d+)\s*-(\d+)\))?\s*$/i)
  if (action) {
    const kind = action[1].toLowerCase()
    return {
      kind: kind === "modify" ? "edit" : kind === "new" ? "create" : "delete",
      label: kind === "modify" ? "Edit" : kind === "new" ? "Create" : "Delete",
      target: action[2].trim(),
      additions: Number(action[3] || 0),
      deletions: Number(action[4] || 0),
    }
  }

  return null
}

function isFileActivity(activity: Activity) {
  return activity.kind === "edit" || activity.kind === "create" || activity.kind === "delete" || activity.kind === "view" || activity.kind === "search"
}

function activityGroupTitle(group: Activity[]) {
  const kinds = new Set(group.map((item) => item.kind))
  const edited = kinds.has("edit") || kinds.has("create") || kinds.has("delete")
  const read = kinds.has("view") || kinds.has("search")
  if (edited && read) return "Edited & Read"
  if (edited) return "Edited"
  if (read) return "Read"
  if (kinds.has("terminal")) return "Terminal"
  if (kinds.has("verify")) return "Verified"
  if (kinds.has("brand")) return "Workspace"
  return "Activity"
}

function activityGroupIcon(group: Activity[]) {
  if (group.some(isFileActivity)) return Pencil
  if (group.some((item) => item.kind === "terminal")) return Terminal
  if (group.some((item) => item.kind === "verify")) return Check
  if (group.some((item) => item.kind === "brand")) return BriefcaseBusiness
  return Circle
}

function ActivityDetail({ activity }: { activity: Activity }) {
  const icon = activity.kind === "terminal"
    ? <Terminal size={12} className="shrink-0 text-[#9A9A9A] dark:text-[#777777]" />
    : activity.kind === "verify"
      ? <Check size={12} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
      : activity.target
        ? <LanguageIcon path={activity.target} />
        : <Circle size={5} className="shrink-0 fill-current text-[#C4C4C4] dark:text-[#555555]" />

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[12px] leading-5">
      {icon}
      <span className="min-w-0 break-all font-mono text-[#6B6B6B] dark:text-[#A8A8A8]" title={activity.target || activity.label}>
        {activity.target || activity.label}
      </span>
      {activity.duration && <span className="shrink-0 text-[#9A9A9A] dark:text-[#777777]">{activity.duration}</span>}
      {(activity.additions || activity.deletions) ? (
        <span className="ml-auto shrink-0 font-mono text-[11px]">
          {activity.additions ? <span className="text-green-600 dark:text-green-400">+{activity.additions}</span> : null}
          {activity.deletions ? <span className="ml-1.5 text-red-500 dark:text-red-400">-{activity.deletions}</span> : null}
        </span>
      ) : null}
    </div>
  )
}

/** Compact numbered step header with its activity rows and no surrounding box. */
function ActivityStep({ step, activities }: { step: number; activities: Activity[] }) {
  const Icon = activityGroupIcon(activities)
  const title = activityGroupTitle(activities)
  return (
    <div className="my-2">
      <div className="flex items-center gap-2">
        <span className="w-4 shrink-0 text-right font-mono text-[10px] tabular-nums text-[#B4B4B4] dark:text-[#666666]">{step}</span>
        <Icon size={13} className="shrink-0 text-[#666666] dark:text-[#9A9A9A]" />
        <span className="text-[12.5px] font-medium text-[#404040] dark:text-[#D4D4D4]">{title}</span>
      </div>
      <div className="ml-[30px] mt-1 space-y-0.5">
        {activities.map((activity, index) => <ActivityDetail key={`${index}-${activity.target || activity.label}`} activity={activity} />)}
      </div>
    </div>
  )
}

function formatElapsed(seconds?: number): string {
  if (!seconds || seconds < 1) return ""
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`
}

/** Compact roadmap: completed, active, and pending steps with elapsed time. */
function PlanChecklist({ steps, activeIndex, done, durationSeconds }: { steps: string[]; activeIndex: number; done: boolean; durationSeconds?: number }) {
  if (steps.length === 0) return null
  const elapsed = formatElapsed(durationSeconds)

  return (
    <div className="my-2">
      <ol className="space-y-0.5">
        {steps.map((step, index) => {
          const isCompleted = done || index < activeIndex
          const isActive = !done && index === activeIndex
          return (
            <li key={`${index}-${step.slice(0, 24)}`} className="flex items-start gap-2 text-[12.5px] leading-5">
              <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 size={13} className="text-[#8A8A8A] dark:text-[#8F8F8F]" />
                ) : isActive ? (
                  <CircleDashed size={13} className="animate-spin text-[#4A4A4A] dark:text-[#CFCFCF]" />
                ) : (
                  <Circle size={13} className="text-[#C4C4C4] dark:text-[#555555]" />
                )}
              </span>
              <span className={`min-w-0 break-words ${isCompleted ? "text-[#9A9A9A] dark:text-[#808080]" : isActive ? "font-medium text-[#171717] dark:text-[#F5F5F5]" : "text-[#A8A8A8] dark:text-[#6E6E6E]"}`}>
                {step}
              </span>
              {isActive && elapsed && <span className="ml-auto shrink-0 tabular-nums text-[11px] text-[#A0A0A0] dark:text-[#767676]">{elapsed}</span>}
            </li>
          )
        })}
      </ol>
      {done && elapsed ? (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8A8A8A] dark:text-[#8F8F8F]">
          <Check size={11} className="shrink-0" />
          <span>Completed in {elapsed}</span>
        </div>
      ) : null}
    </div>
  )
}

function parseAntigravityText(text: string): ParsedChunk[] {
  // Keep file operations visible while hiding implementation code from the chat.
  text = normalizeActivityText(text);
  text = text.replace(
    /(?:^|\n)Code\s*\n[\s\S]*?(?=\n(?:Mentor(?:'s)? Summary|Summary)\s*:|$)/gi,
    "\n"
  );
  text = text.replace(/```[\s\S]*?```/g, "\n");

  const chunks: ParsedChunk[] = []
  
  // Regex to match <think>...</think> (including unclosed tags during streaming)
  // and [MODIFY] filename, [NEW] filename, [DELETE] filename
  
  let currentText = ""
  let inThink = false
  let thinkContent = ""
  let hidingGeneratedCode = false
  
  const lines = text.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (hidingGeneratedCode) {
      if (/^(?:Mentor(?:'s)? Summary|Summary)\s*:/i.test(line.trim())) {
        hidingGeneratedCode = false
      } else {
        continue
      }
    }
    
    if (!inThink && line.includes('<think>')) {
      if (currentText) {
        chunks.push({ type: 'text', content: currentText })
        currentText = ""
      }
      inThink = true
      // Handle same-line content after <think>
      const parts = line.split('<think>')
      if (parts[1]) {
        if (parts[1].includes('</think>')) {
          const subparts = parts[1].split('</think>')
          thinkContent = subparts[0]
          chunks.push({ type: 'think', content: thinkContent, isStreaming: false })
          inThink = false
          thinkContent = ""
          currentText += subparts[1] + '\n'
        } else {
          thinkContent += parts[1] + '\n'
        }
      } else {
        thinkContent += '\n'
      }
      continue
    }
    
    if (inThink) {
      if (line.includes('</think>')) {
        const parts = line.split('</think>')
        thinkContent += parts[0]
        chunks.push({ type: 'think', content: thinkContent, isStreaming: false })
        inThink = false
        thinkContent = ""
        currentText += parts[1] + '\n'
      } else {
        thinkContent += line + '\n'
      }
      continue
    }
    
    // Activity lines keep their source order, so tool rows interleave with prose.
    const activity = parseActivityLine(line)
    if (activity) {
      if (currentText.trim()) {
        chunks.push({ type: 'text', content: currentText })
      }
      currentText = ""
      chunks.push({ type: 'activity', content: line, activity })
      if (activity.kind === 'create') hidingGeneratedCode = true
      continue
    }
    
    currentText += line + '\n'
  }
  
  if (inThink) {
    chunks.push({ type: 'think', content: thinkContent, isStreaming: true })
  } else if (currentText.trim() || currentText.includes('\n')) {
    chunks.push({ type: 'text', content: currentText })
  }
  
  return chunks
}

function ThinkBlock({ content, isStreaming, step }: { content: string, isStreaming?: boolean, step?: number }) {
  // Short reasoning stays visible; long reasoning collapses to keep the message crisp.
  const [isOpen, setIsOpen] = useState(content.length <= 800)

  // Streaming always opens the live reasoning row.
  const displayOpen = isStreaming ? true : isOpen

  return (
    <div className="my-2">
      <div className="flex items-center gap-2">
        {step !== undefined && <span className="w-4 shrink-0 text-right font-mono text-[10px] tabular-nums text-[#B4B4B4] dark:text-[#666666]">{step}</span>}
        <Brain size={13} className="shrink-0 text-[#666666] dark:text-[#9A9A9A]" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={displayOpen}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md text-left text-[12.5px] font-medium text-[#404040] transition-colors hover:text-[#171717] dark:text-[#D4D4D4] dark:hover:text-[#F5F5F5]"
        >
          <span className="truncate">{isStreaming ? "Thinking..." : "Thought process"}</span>
          <ChevronDown size={12} className={`shrink-0 transition-transform ${displayOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {displayOpen && (
        <div className="mt-1 ml-[30px] whitespace-pre-wrap break-words text-[12.5px] leading-6 text-[#525252] dark:text-[#B0B0B0]">
          {content}
          {isStreaming && <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-[#a3a3a3] align-middle" />}
        </div>
      )}
    </div>
  )
}

function CodeBlock({ node, inline, className, children, onApplyToFile, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '')
  const [copied, setCopied] = useState(false)
  
  // In react-markdown v9, inline is sometimes undefined. We can guess it's inline if no language class is present and no newlines exist.
  const isInline = inline || (!match && typeof children === 'string' && !children.includes('\n'))
  
  if (isInline) {
    return (
      <code className="rounded-md bg-[#f0f0f0] px-1.5 py-0.5 text-[13px] font-mono text-[#cf222e] dark:bg-[#2a2a2a] dark:text-[#F5F5F5]" {...props}>
        {children}
      </code>
    )
  }

  const code = String(children).replace(/\n$/, "")
  const language = match?.[1]?.toUpperCase() || "CODE"
  const copy = async () => { await navigator.clipboard?.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1200) }
  return <div className="my-3 overflow-hidden rounded-[14px] border border-[#303030] bg-[#191919] text-[#f5f5f5] shadow-sm transition-colors hover:border-[#3d3d3d]"><div className="flex items-center justify-between border-b border-[#2a2a2a] px-3 py-2"><span className="rounded-md bg-[#2a2a2a] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#bdbdbd]">{language}</span><div className="flex items-center gap-1"><button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-[#aaa] hover:bg-[#2a2a2a] hover:text-white">{copied ? <Check size={12} /> : <Clipboard size={12} />}{copied ? "Copied" : "Copy"}</button>{onApplyToFile && <button type="button" onClick={() => onApplyToFile(code)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-[#aaa] hover:bg-[#2a2a2a] hover:text-white"><FilePlus2 size={12} />Apply to File</button>}</div></div><pre className="overflow-x-auto p-4 text-[12px] leading-5" {...props}><code>{code}</code></pre></div>
}

type RenderItem =
  | { type: 'text'; content: string }
  | { type: 'think'; content: string; isStreaming?: boolean }
  | { type: 'activity-group'; activities: Activity[] }

/** Merge consecutive tool rows so a step reads once, e.g. "Edited & Read". */
function buildRenderItems(chunks: ParsedChunk[]): RenderItem[] {
  const items: RenderItem[] = []
  for (const chunk of chunks) {
    if (chunk.type === 'activity' && chunk.activity) {
      const last = items[items.length - 1]
      const previous = last && last.type === 'activity-group' ? last.activities[last.activities.length - 1] : null
      const sameGroup = Boolean(previous) && (
        (isFileActivity(previous as Activity) && isFileActivity(chunk.activity)) ||
        (!isFileActivity(previous as Activity) && previous!.kind === chunk.activity.kind)
      )
      if (last && last.type === 'activity-group' && sameGroup) {
        last.activities.push(chunk.activity)
      } else {
        items.push({ type: 'activity-group', activities: [chunk.activity] })
      }
      continue
    }
    if (chunk.type === 'think') {
      items.push({ type: 'think', content: chunk.content, isStreaming: chunk.isStreaming })
      continue
    }
    if (['modify', 'new', 'delete'].includes(chunk.type)) continue
    items.push({ type: 'text', content: chunk.content })
  }
  return items
}

export type AntigravityMessageMeta = {
  model?: string
  durationSeconds?: number
  tokensPerSecond?: number
}

export function AntigravityMarkdown({ content, onApplyToFile, sanitize = false, elapsedSeconds, meta }: { content: string; onApplyToFile?: (code: string) => void; sanitize?: boolean; elapsedSeconds?: number; meta?: AntigravityMessageMeta }) {
  // Agent replies are normalized at render time so raw JSON never reaches a
  // chat bubble, even for streams or messages persisted before this change.
  const sanitized = useMemo(() => (sanitize ? sanitizeAgentChatContent(content) : null), [content, sanitize])
  const source = sanitized?.content ?? content
  const chunks = useMemo(() => parseAntigravityText(source), [source])
  const items = useMemo(() => buildRenderItems(chunks), [chunks])
  const showLiveReasoning = Boolean(sanitized?.incomplete) && !chunks.some((chunk) => chunk.type === "think")
  const footerDuration = formatElapsed(meta?.durationSeconds ?? sanitized?.durationSeconds ?? elapsedSeconds)
  const footerParts = [
    meta?.model,
    footerDuration,
    meta?.tokensPerSecond ? `${meta.tokensPerSecond} tok/s` : "",
  ].filter((part): part is string => Boolean(part))
  let stepNumber = 0

  return (
    <div className="w-full flex flex-col gap-1">
      {sanitized && sanitized.planSteps.length > 0 && (
        <PlanChecklist
          steps={sanitized.planSteps}
          activeIndex={sanitized.activeIndex}
          done={sanitized.planDone}
          durationSeconds={sanitized.durationSeconds ?? elapsedSeconds}
        />
      )}
      {showLiveReasoning && (
        <div className="my-1 flex items-center gap-2 text-[12.5px] text-[#737373] dark:text-[#9A9A9A]">
          <span className="w-4 shrink-0 text-right font-mono text-[10px] tabular-nums text-[#B4B4B4] dark:text-[#666666]">{stepNumber + 1}</span>
          <CircleDashed size={13} className="shrink-0 animate-spin" />
          <span className="min-w-0 truncate">{sanitized?.thought ? sanitized.thought.replace(/\s+/g, " ").slice(0, 160) : "Working through the plan…"}</span>
        </div>
      )}
      {items.map((item, i) => {
        if (item.type === 'think') {
          stepNumber += 1
          return <ThinkBlock key={i} step={stepNumber} content={item.content} isStreaming={item.isStreaming} />
        }
        if (item.type === 'activity-group') {
          stepNumber += 1
          return <ActivityStep key={i} step={stepNumber} activities={item.activities} />
        }

        // It's just text
        const isError = item.content.includes("**Execution Error:**")
        return (
          <div key={i} className={`prose prose-sm max-w-none prose-p:leading-relaxed text-zinc-900 dark:text-[#F5F5F5] prose-headings:text-zinc-900 dark:prose-headings:text-[#F5F5F5] prose-p:text-zinc-900 dark:prose-p:text-[#F5F5F5] prose-li:text-zinc-900 dark:prose-li:text-[#F5F5F5] prose-strong:text-zinc-900 dark:prose-strong:text-[#F5F5F5] ${isError ? "rounded-xl border border-red-300 bg-red-50 px-3 py-2 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-200 prose-p:text-red-700 dark:prose-p:text-red-200" : ""}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: (props: any) => <CodeBlock {...props} onApplyToFile={onApplyToFile} />
              }}
            >
              {item.content}
            </ReactMarkdown>
          </div>
        )
      })}
      {footerParts.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] leading-4 text-[#9A9A9A] dark:text-[#777777]">
          {footerParts.map((part, index) => (
            <React.Fragment key={`${part}-${index}`}>
              {index > 0 && <span aria-hidden="true">·</span>}
              <span className="truncate">{part}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
