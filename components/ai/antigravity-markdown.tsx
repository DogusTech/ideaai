"use client"

import React, { useState, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChevronRight, ChevronDown, Edit3, PlusCircle, Trash2, FileTerminal, Copy, Check } from "lucide-react"
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type ChunkType = 'text' | 'think' | 'modify' | 'new' | 'delete'

interface ParsedChunk {
  type: ChunkType
  content: string
  isStreaming?: boolean
}

function parseAntigravityText(text: string): ParsedChunk[] {
  // Transform autonomous XML into beautiful UI blocks
  text = text.replace(/<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/g, (match, path, content) => {
     const ext = path.split('.').pop() || '';
     return `\n[NEW] ${path}\n\`\`\`${ext}\n${content.trim()}\n\`\`\`\n`;
  });

  const chunks: ParsedChunk[] = []
  
  // Regex to match <think>...</think> (including unclosed tags during streaming)
  // and [MODIFY] filename, [NEW] filename, [DELETE] filename
  
  let currentText = ""
  let inThink = false
  let thinkContent = ""
  
  const lines = text.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
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
      else if (newMatch) chunks.push({ type: 'new', content: newMatch[1].trim() })
      else if (deleteMatch) chunks.push({ type: 'delete', content: deleteMatch[1].trim() })
      
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
    <div className="my-3 border border-[#e5e5e5] rounded-xl overflow-hidden bg-[#fbfbfb]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#737373] hover:bg-[#f0f0f0] transition-colors"
      >
        <div className="flex items-center gap-2">
          {displayOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium text-[13px]">
            {isStreaming ? "Thinking..." : "Thought process"}
          </span>
        </div>
      </button>
      
      {displayOpen && (
        <div className="px-4 py-3 text-[13px] text-[#525252] border-t border-[#e5e5e5] max-h-[300px] overflow-y-auto font-mono leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-[#a3a3a3] animate-pulse align-middle" />}
        </div>
      )}
    </div>
  )
}

function FileActionBadge({ type, filename }: { type: ChunkType, filename: string }) {
  let Icon = FileTerminal
  let colorClass = ""
  let label = ""
  
  switch(type) {
    case 'modify':
      Icon = Edit3
      colorClass = "text-blue-600 bg-blue-50 border-blue-200"
      label = "Modifying"
      break
    case 'new':
      Icon = PlusCircle
      colorClass = "text-green-600 bg-green-50 border-green-200"
      label = "Creating"
      break
    case 'delete':
      Icon = Trash2
      colorClass = "text-red-600 bg-red-50 border-red-200"
      label = "Deleting"
      break
  }

  return (
    <div className={`my-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm ${colorClass}`}>
      <Icon className="w-4 h-4" strokeWidth={2} />
      <span className="text-[12px] font-semibold uppercase tracking-wider opacity-80">{label}</span>
      <span className="text-[14px] font-medium font-mono">{filename}</span>
    </div>
  )
}

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  
  if (inline) {
    return (
      <code className="bg-[#f0f0f0] text-[#cf222e] px-1.5 py-0.5 rounded-md text-[13px] font-mono" {...props}>
        {children}
      </code>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-xl border border-[#e5e5e5] bg-[#fbfbfb] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#e5e5e5] bg-[#f4f4f4]">
        <span className="text-[13px] font-medium text-[#737373] capitalize">{language || 'Code'}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[#737373] hover:text-[#171717] transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <SyntaxHighlighter
          style={oneLight}
          language={language}
          PreTag="div"
          customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export function AntigravityMarkdown({ content }: { content: string }) {
  const chunks = useMemo(() => parseAntigravityText(content), [content])

  return (
    <div className="w-full flex flex-col gap-1">
      {chunks.map((chunk, i) => {
        if (chunk.type === 'think') {
          return <ThinkBlock key={i} content={chunk.content} isStreaming={chunk.isStreaming} />
        }
        if (['modify', 'new', 'delete'].includes(chunk.type)) {
          return <FileActionBadge key={i} type={chunk.type} filename={chunk.content} />
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
