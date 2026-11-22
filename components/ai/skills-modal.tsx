"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy } from "lucide-react"

export interface AgentSkill {
  id: string
  name: string
  description: string
  badge: "Local"
  enabled: boolean
  trigger: string
  zeroEgress: boolean
  definition: string
}

const DEFAULT_SKILLS: AgentSkill[] = [
  {
    id: "night-shift-automation",
    name: "night-shift-automation",
    description: "Executes queued autonomous overnight engineering tasks and self-healing loops safely on local models without external API calls.",
    badge: "Local",
    enabled: true,
    trigger: "Autonomous schedule / Night Shift queue",
    zeroEgress: true,
    definition: "Safe isolated Git worktree runner with verification command loop and zero network telemetry."
  },
  {
    id: "local-code-audit",
    name: "local-code-audit",
    description: "Scans repository files for security vulnerabilities, secrets, deprecated API usage, and performance bottlenecks completely offline.",
    badge: "Local",
    enabled: true,
    trigger: "Workspace file inspection / On-demand",
    zeroEgress: true,
    definition: "Static AST and regex parsing directly against the local workspace root with zero data egress."
  },
  {
    id: "test-generator",
    name: "test-generator",
    description: "Generates comprehensive unit and integration tests (Vitest, Jest, Playwright) for newly authored or modified source files.",
    badge: "Local",
    enabled: true,
    trigger: "File edit verification / Automated test runner",
    zeroEgress: true,
    definition: "Analyzes exported symbols and constructs minimal mocked test suites executing in the local runner."
  },
  {
    id: "git-sandbox-workflow",
    name: "git-sandbox-workflow",
    description: "Isolates speculative AI edits inside an ephemeral git branch or sandbox worktree, protecting your primary working tree.",
    badge: "Local",
    enabled: true,
    trigger: "Pre-task execution hook",
    zeroEgress: true,
    definition: "Creates ideaai/sandbox-branch and applies diffs with reversible rollback checkpoints."
  }
]

const SKILLS_STORAGE_KEY = "ideaai_local_skills"

export function getStoredSkills(): AgentSkill[] {
  if (typeof window === "undefined") return DEFAULT_SKILLS
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY)
    if (!raw) return DEFAULT_SKILLS
    return JSON.parse(raw) as AgentSkill[]
  } catch {
    return DEFAULT_SKILLS
  }
}

export function saveStoredSkills(skills: AgentSkill[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills))
}

interface SkillsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  const [skills, setSkills] = useState<AgentSkill[]>(() => getStoredSkills())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      saveStoredSkills(next)
      return next
    })
  }

  const handleCopyDefinition = (skill: AgentSkill) => {
    const text = `# Skill: ${skill.name}\n${skill.description}\n\nExecution:\n${skill.definition}`
    navigator.clipboard.writeText(text)
    setCopiedId(skill.id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const handleDuplicate = (skill: AgentSkill) => {
    const newSkill: AgentSkill = {
      ...skill,
      id: `${skill.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${skill.name}-copy`,
      enabled: false,
    }
    setSkills((prev) => {
      const next = [...prev, newSkill]
      saveStoredSkills(next)
      return next
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.16 }}
          role="dialog"
          aria-modal="true"
          className="flex h-[min(680px,90vh)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-[#e0e0e0] dark:border-[#333333] bg-[#ffffff] dark:bg-[#141414] text-[#000000] dark:text-[#ffffff] shadow-[0px_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0px_4px_32px_rgba(0,0,0,0.4)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e0e0e0] dark:border-[#222222] bg-[#ffffff] dark:bg-[#141414] px-6 py-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="headline-md tracking-tight font-medium text-[#000000] dark:text-[#ffffff]">Local Skills</h2>
                <span className="rounded-full bg-[#f1f1f1] dark:bg-[#222222] px-2.5 py-0.5 text-[11px] font-medium text-[#666666] dark:text-[#999999] border border-[#e0e0e0] dark:border-[#333333]">
                  100% Zero-Egress
                </span>
              </div>
              <p className="mt-1 body-md text-[#666666] dark:text-[#999999]">
                Modular local engineering skills executing strictly on your device runtime with zero cloud telemetry.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-[#666666] hover:bg-[#f1f1f1] dark:text-[#999999] dark:hover:bg-[#222222] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fbfbfb] dark:bg-[#111111]">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col gap-3 rounded-[24px] border border-[#e0e0e0] dark:border-[#262626] bg-[#ffffff] dark:bg-[#181818] p-5 transition-all hover:border-[#cccccc] dark:hover:border-[#333333]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-[#000000] dark:text-[#ffffff]">
                      {skill.name}
                    </span>
                    <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-[#000000] dark:text-[#ffffff]">
                      {skill.badge}
                    </span>
                    {skill.zeroEgress && (
                      <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                        Local Only
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyDefinition(skill)}
                      title="Copy skill definition"
                      className="grid h-8 w-8 place-items-center rounded-full border border-[#e0e0e0] dark:border-[#333333] hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs"
                    >
                      {copiedId === skill.id ? <Check size={14} /> : <Copy size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(skill)}
                      className="rounded-full border border-[#e0e0e0] dark:border-[#333333] px-3 py-1 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Duplicate
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer ml-1">
                      <input
                        type="checkbox"
                        checked={skill.enabled}
                        onChange={() => toggleSkill(skill.id)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0e0e0] peer-focus:outline-none rounded-full peer dark:bg-[#333333] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-black dark:peer-checked:bg-white dark:peer-checked:after:bg-[#111111]" />
                    </label>
                  </div>
                </div>

                <p className="body-md text-[#666666] dark:text-[#999999]">
                  {skill.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[#888888] dark:text-[#666666] pt-1 border-t border-[#f0f0f0] dark:border-[#202020]">
                  <span>Trigger: <strong className="font-medium text-[#444444] dark:text-[#aaaaaa]">{skill.trigger}</strong></span>
                  <span className="font-mono text-[11px] truncate max-w-[280px]">{skill.definition}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#e0e0e0] dark:border-[#222222] px-6 py-4 bg-[#ffffff] dark:bg-[#141414]">
            <span className="text-xs text-[#888888] dark:text-[#888888]">
              All skills execute locally within the active project workspace root.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] px-6 rounded-[40px] bg-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#111111] text-button-token font-medium transition-transform active:scale-95 shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
