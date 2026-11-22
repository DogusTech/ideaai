"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Command, GitBranch, Moon, Settings2, Sparkles } from "lucide-react"

type PaletteAction = { id: string; label: string; detail: string; icon: typeof Command; run: () => void }

export function CommandPalette({ isOpen, onClose, onOpenNightShift, onOpenSettings, onOpenBilling, onRunGit, onFocusComposer, onSwitchModel, onRunCommand }: {
  isOpen: boolean
  onClose: () => void
  onOpenNightShift: () => void
  onOpenSettings: () => void
  onOpenBilling: () => void
  onRunGit: () => void
  onFocusComposer: () => void
  onSwitchModel: () => void
  onRunCommand: (command: string) => void
}) {
  const [query, setQuery] = useState("")
  useEffect(() => { if (isOpen) setQuery("") }, [isOpen])
  const actions = useMemo<PaletteAction[]>(() => [
    { id: "model", label: "Switch model", detail: "Open the model picker", icon: Sparkles, run: onSwitchModel },
    { id: "nightshift", label: "Open Night Shift", detail: "Queue autonomous work", icon: Moon, run: onOpenNightShift },
    { id: "billing", label: "Account & Billing", detail: "Manage your Turaen plan", icon: Sparkles, run: onOpenBilling },
    { id: "settings", label: "Open Settings", detail: "Configure the workspace", icon: Settings2, run: onOpenSettings },
    { id: "git", label: "Open Git changes", detail: "Inspect the current repository", icon: GitBranch, run: onRunGit },
    { id: "composer", label: "Focus composer", detail: "Start typing a task", icon: Command, run: onFocusComposer },
    { id: "explain", label: "Run /explain", detail: "Explain selected context", icon: Command, run: () => onRunCommand("/explain") },
    { id: "fix", label: "Run /fix", detail: "Inspect and fix the workspace", icon: Command, run: () => onRunCommand("/fix") },
    { id: "test", label: "Run /test", detail: "Generate and run tests", icon: Command, run: () => onRunCommand("/test") },
    { id: "pr", label: "Run /pr", detail: "Prepare a pull request", icon: GitBranch, run: () => onRunCommand("/pr") },
  ], [onFocusComposer, onOpenBilling, onOpenNightShift, onOpenSettings, onRunCommand, onRunGit, onSwitchModel])
  const filtered = actions.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase()))
  if (!isOpen) return null
  return <div className="fixed inset-0 z-[130] bg-black/35 p-4 backdrop-blur-sm" onMouseDown={onClose}><section role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(event) => event.stopPropagation()} className="mx-auto mt-[12vh] w-full max-w-xl overflow-hidden rounded-[20px] border border-[#dedede] bg-white shadow-2xl dark:border-[#303030] dark:bg-[#171717]"><div className="flex items-center gap-3 border-b border-[#ededed] px-4 dark:border-[#2a2a2a]"><Command size={16} className="text-[#888]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") onClose(); if (event.key === "Enter" && filtered[0]) { filtered[0].run(); onClose() } }} placeholder="Search commands…" className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#999]" /><kbd className="rounded-md border border-[#ddd] px-1.5 py-0.5 text-[10px] text-[#888] dark:border-[#3a3a3a]">ESC</kbd></div><div className="p-2">{filtered.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { item.run(); onClose() }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#f5f5f5] dark:hover:bg-[#242424]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f1f1] text-[#555] dark:bg-[#262626] dark:text-[#ccc]"><Icon size={15} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-[#888]">{item.detail}</span></span><ArrowRight size={14} className="text-[#aaa]" /></button> })}{filtered.length === 0 && <p className="px-3 py-6 text-center text-xs text-[#888]">No matching commands</p>}</div><div className="flex items-center gap-3 border-t border-[#ededed] px-4 py-2 text-[10px] text-[#888] dark:border-[#2a2a2a]"><span><kbd className="rounded border px-1">↵</kbd> run</span><span><kbd className="rounded border px-1">esc</kbd> close</span><span className="ml-auto">Turaen command center</span></div></section></div>
}
