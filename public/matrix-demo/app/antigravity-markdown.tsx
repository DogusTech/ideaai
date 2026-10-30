"use client"

import React, { useState, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type ChunkType = 'text' | 'think' | 'modify' | 'new' | 'delete'

interface ParsedChunk {
  type: ChunkType
  content: string
  isStreaming?: boolean
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
      src="/matrix-demo/app/react-logo-badge.png"
      alt="React"
      title="React"
      className={`inline-block shrink-0 object-contain ${size === "md" ? "h-5 w-5" : "h-4 w-4"}`}
    />
  )
}

type Activity = {
  kind: "view" | "edit" | "search" | "thought" | "create" | "delete"
  label: string
  target?: string
  additions?: number
  deletions?: number
  duration?: string
}

function parseActivities(text: string): Activity[] {
  text = text.replace(
    /<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi,
    (match, path, content) => {
      const additions = String(content).split(/\r?\n/).filter((line: string) => line.trim()).length;
      return `\n[NEW] ${path} (+${additions} -0)\n`;
    }
  ).replace(
    /\[(MODIFY|NEW)\]\s+([^\n]+)\s*\n+\[NEW\]\s+\2\s+\(\+(\d+)\s+-0\)/gi,
    "[$1] $2 (+$3 -0)"
  );
  const activities: Activity[] = []
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const thought = line.match(/^(?:Thought for|Düşündü)\s+(.+)$/i)
    if (thought) {
      activities.push({ kind: "thought", label: "Thought", duration: thought[1] })
      continue
    }

    const edit = line.match(/^(?:Edit|Edited)\s+(.+?)(?:\s*\+(\d+)\s*-?\s*(\d+))?$/i)
    if (edit) {
      activities.push({
        kind: "edit",
        label: "Edit",
        target: edit[1].trim(),
        additions: Number(edit[2] || 0),
        deletions: Number(edit[3] || 0),
      })
      continue
    }

    const view = line.match(/^(?:View|Viewed)\s+(.+)$/i)
    if (view) {
      activities.push({ kind: "view", label: "View", target: view[1].trim() })
      continue
    }

    const search = line.match(/^(?:Search(?:ed)?|Searched)\s+(.+)$/i)
    if (search) {
      activities.push({ kind: "search", label: "Search", target: search[1].trim() })
      continue
    }

    const action = line.match(/^\[(MODIFY|NEW|DELETE)\]\s+(.+?)(?:\s*\(\+(\d+)\s*-(\d+)\))?\s*$/i)
    if (action) {
      const kind = action[1].toLowerCase()
      activities.push({
        kind: kind === "modify" ? "edit" : kind === "new" ? "create" : "delete",
        label: kind === "modify" ? "Edit" : kind === "new" ? "Create" : "Delete",
        target: action[2].trim(),
        additions: Number(action[3] || 0),
        deletions: Number(action[4] || 0),
      })
    }
  }
  return activities
}

function ActivityTimeline({ content }: { content: string }) {
  const activities = useMemo(() => parseActivities(content), [content])
  if (activities.length === 0) return null

  return (
    <div className="my-2 flex flex-col gap-2 text-[13px]">
      {activities.map((activity, index) => (
        <div key={`${activity.kind}-${activity.target || activity.duration}-${index}`} className="flex min-w-0 items-center gap-2.5 leading-6">
          {activity.target && <LanguageIcon path={activity.target} />}
          <span className="shrink-0 text-[#737373]">{activity.label}</span>
          {activity.target && (
            <span className="min-w-0 break-all font-mono text-[#525252]" title={activity.target}>
              {activity.target}
            </span>
          )}
          {activity.duration && <span className="text-[#8a8a8a]">{activity.duration}</span>}
          {(activity.additions || activity.deletions) ? (
            <span className="ml-auto shrink-0 font-mono text-[12px]">
              {activity.additions ? <span className="text-green-600">+{activity.additions}</span> : null}
              {activity.deletions ? <span className="ml-2 text-red-500">-{activity.deletions}</span> : null}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function parseAntigravityText(text: string): ParsedChunk[] {
  // Keep file operations visible while hiding implementation code from the chat.
  text = text.replace(
    /<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi,
    (match, path, content) => {
      const additions = String(content).split(/\r?\n/).filter((line: string) => line.trim()).length;
      return `\n[NEW] ${path} (+${additions} -0)\n`;
    }
  );
  text = text.replace(
    /\[(MODIFY|NEW)\]\s+([^\n]+)\s*\n+\[NEW\]\s+\2\s+\(\+(\d+)\s+-0\)/gi,
    "[$1] $2 (+$3 -0)"
  );
  text = text.replace(
    /(?:^|\n)Code\s*\n[\s\S]*?(?=\n(?:Mentor(?:'s)? Summary|Summary|Özet)\s*:|$)/gi,
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
      if (/^(?:Mentor(?:'s)? Summary|Summary|Özet)\s*:/i.test(line.trim())) {
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
    
    // Check for file actions
    const modifyMatch = line.match(/^\[MODIFY\]\s+(.+)$/)
    const newMatch = line.match(/^\[NEW\]\s+(.+)$/)
    const deleteMatch = line.match(/^\[DELETE\]\s+(.+)$/)
    
    if (modifyMatch || newMatch || deleteMatch) {
      if (currentText.trim()) {
        chunks.push({ type: 'text', content: currentText })
      }
      currentText = "" // reset
      
      if (modifyMatch) chunks.push({ type: 'modify', content: modifyMatch[1].trim() })
      else if (newMatch) {
        chunks.push({ type: 'new', content: newMatch[1].trim() })
        hidingGeneratedCode = true
      }
      else if (deleteMatch) chunks.push({ type: 'delete', content: deleteMatch[1].trim() })
      
      continue
    }

    if (
      /^(?:View|Viewed|Edit|Edited|Search|Searched|Thought for|Düşündü)\s+/i.test(line)
    ) {
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

function ThinkBlock({ content, isStreaming }: { content: string, isStreaming?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // If it's streaming, auto-open it. If done, collapse by default unless user toggled.
  const displayOpen = isStreaming ? true : isOpen

  return (
    <div className="my-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 py-1 text-left text-sm text-[#737373] hover:text-[#171717] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-[13px]">
            {isStreaming ? "Thinking..." : "Thought process"}
          </span>
        </div>
      </button>
      
      {displayOpen && (
        <div className="ml-6 max-h-[300px] overflow-y-auto py-1 text-[13px] text-[#525252] font-mono leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-[#a3a3a3] animate-pulse align-middle" />}
        </div>
      )}
    </div>
  )
}

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '')
  
  // In react-markdown v9, inline is sometimes undefined. We can guess it's inline if no language class is present and no newlines exist.
  const isInline = inline || (!match && typeof children === 'string' && !children.includes('\n'))
  
  if (isInline) {
    return (
      <code className="bg-[#f0f0f0] text-[#cf222e] px-1.5 py-0.5 rounded-md text-[13px] font-mono" {...props}>
        {children}
      </code>
    )
  }

  return null
}

export function AntigravityMarkdown({ content }: { content: string }) {
  const chunks = useMemo(() => parseAntigravityText(content), [content])

  return (
    <div className="w-full flex flex-col gap-1">
      <ActivityTimeline content={content} />
      {chunks.map((chunk, i) => {
        if (chunk.type === 'think') {
          return <ThinkBlock key={i} content={chunk.content} isStreaming={chunk.isStreaming} />
        }
        if (['modify', 'new', 'delete'].includes(chunk.type)) {
          return null
        }
        
        // It's just text
        return (
          <div key={i} className="prose prose-sm max-w-none text-[#171717] prose-p:leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock
              }}
            >
              {chunk.content}
            </ReactMarkdown>
          </div>
        )
      })}
    </div>
  )
}
