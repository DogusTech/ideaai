"use client"

import { useEffect, useState } from "react"
import { EmailAuthProvider, GoogleAuthProvider, linkWithCredential, linkWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { LocalModelsSettings } from "@/components/settings/local-models-settings"
import { getStoredSkills, saveStoredSkills, type AgentSkill } from "./skills-modal"
import { Check, Copy } from "lucide-react"
import { AgentBridge } from "@/app/utils/agent-bridge"
import { TuraenLogo } from "@/components/brand/turaen-logo"
import { STRIPE_PAYMENT_LINK_URL, type PlanState, isPro, savePlanState } from "@/lib/plan-entitlements"

type SettingsTab = "general" | "skills" | "provider-local" | "provider-account" | "provider-byok" | "agent" | "terminal" | "keybindings" | "about"
type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  initialTab?: string
  userEmail?: string | null
  onUseModel?: (modelName: string) => void
  plan?: PlanState
  onPlanChange?: (next: PlanState) => void
}

const NAV: Array<{ id: SettingsTab; label: string }> = [
  { id: "general", label: "General" },
  { id: "skills", label: "Skills (Customizations)" },
  { id: "provider-local", label: "Local Models" },
  { id: "provider-account", label: "Account & Billing" },
  { id: "provider-byok", label: "BYOK (Cloud APIs)" },
  { id: "agent", label: "Agent & Autonomy" },
  { id: "terminal", label: "Terminal & Shell" },
  { id: "keybindings", label: "Keybindings" },
  { id: "about", label: "About" },
]

function resolveTab(tab: string): SettingsTab {
  if (tab === "local-models") return "provider-local"
  if (tab === "account") return "provider-account"
  if (tab === "skills" || tab === "customizations") return "skills"
  return NAV.some((item) => item.id === tab) ? (tab as SettingsTab) : "general"
}

export function SettingsModal({ isOpen, onClose, initialTab = "general", userEmail, onUseModel, plan = { tier: "free", devPreview: false }, onPlanChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(resolveTab(initialTab))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountMessage, setAccountMessage] = useState("")
  const [accountBusy, setAccountBusy] = useState(false)
  const [preference, setPreference] = useState<Record<string, string>>({})
  const [keyTest, setKeyTest] = useState<Record<string, string>>({})
  const [skillsList, setSkillsList] = useState<AgentSkill[]>([])
  const [copiedSkillId, setCopiedSkillId] = useState<string | null>(null)
  const [githubToken, setGithubToken] = useState("")
  const [githubAuth, setGithubAuth] = useState<{ configured?: boolean; authenticated?: boolean; account?: string; source?: string } | null>(null)
  const [githubMessage, setGithubMessage] = useState("")
  const [githubBusy, setGithubBusy] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(resolveTab(initialTab))
      setSkillsList(getStoredSkills())
      void AgentBridge.getGitHubAuth().then((result) => {
        if (result?.success) setGithubAuth(result)
      })
    }
  }, [initialTab, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const keys = ["theme", "language", "startup", "typography", "fontScale", "autosave", "approval", "worktree", "systemRules", "shell", "terminalFontSize", "liveStreaming", "cloudSync"]
    const stored = Object.fromEntries(keys.map((key) => [key, localStorage.getItem(`ideaai_${key}`) || ""]))
    setPreference(stored)
    applyPreference("theme", stored.theme || "System")
    applyPreference("typography", stored.typography || "OpenAI Sans")
    applyPreference("fontScale", stored.fontScale || "Default")
  }, [isOpen])

  const applyPreference = (key: string, value: string) => {
    if (key === "theme") {
      let isDark = false
      if (value === "Dark") {
        isDark = true
      } else if (value === "Light") {
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

      const bridge = (window as Window & { electronAPI?: { invoke: (name: string, ...args: any[]) => Promise<unknown> } }).electronAPI
      if (bridge) {
        void bridge.invoke("theme:set", isDark ? "dark" : "light").catch(() => undefined)
      }
    }
    if (key === "typography") {
      document.documentElement.style.setProperty("--font-sans", `'${value}', 'OpenAI Sans', 'Satoshi', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`)
    }
    if (key === "fontScale") {
      document.documentElement.style.setProperty("--ideaai-font-scale", value === "Compact" ? "0.94" : value === "Comfortable" ? "1.06" : "1")
    }
  }

  const savePreference = (key: string, value: string) => {
    setPreference((current) => ({ ...current, [key]: value }))
    localStorage.setItem(`ideaai_${key}`, value)
    applyPreference(key, value)
  }

  const handleToggleSkill = (id: string) => {
    setSkillsList((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      saveStoredSkills(next)
      return next
    })
  }

  const handleCopySkill = (skill: AgentSkill) => {
    navigator.clipboard.writeText(`# Skill: ${skill.name}\n${skill.description}\n\nExecution:\n${skill.definition}`)
    setCopiedSkillId(skill.id)
    setTimeout(() => setCopiedSkillId(null), 1800)
  }

  const testProviderKey = async (label: string, storageKey: string, url: string, makeHeaders: (key: string) => Record<string, string>, queryKey = false) => {
    const key = localStorage.getItem(storageKey)?.trim()
    if (!key) { setKeyTest((current) => ({ ...current, [label]: "Add an API key first" })); return }
    setKeyTest((current) => ({ ...current, [label]: "Checking…" }))
    try {
      const response = await fetch(queryKey ? `${url}${encodeURIComponent(key)}` : url, { headers: makeHeaders(key) })
      setKeyTest((current) => ({ ...current, [label]: response.ok ? "Connected" : `Provider returned ${response.status}` }))
    } catch { setKeyTest((current) => ({ ...current, [label]: "Could not reach provider" })) }
  }

  if (!isOpen) return null

  const currentUser = auth.currentUser
  const isGuest = currentUser?.isAnonymous ?? !userEmail

  const linkGoogle = async () => {
    if (!auth.currentUser) return
    setAccountBusy(true)
    setAccountMessage("")
    try {
      await linkWithPopup(auth.currentUser, new GoogleAuthProvider())
      setAccountMessage("Google account linked.")
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "Could not link Google account.")
    } finally { setAccountBusy(false) }
  }

  const linkEmail = async () => {
    if (!auth.currentUser) return
    setAccountBusy(true)
    setAccountMessage("")
    try {
      if (!email.trim() || password.length < 6) throw new Error("Enter a valid email and a password with at least 6 characters.")
      await linkWithCredential(auth.currentUser, EmailAuthProvider.credential(email.trim(), password))
      setAccountMessage("Email account linked.")
      setPassword("")
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "Could not link email account.")
    } finally { setAccountBusy(false) }
  }

  const saveGithubPat = async () => {
    setGithubBusy(true)
    setGithubMessage("")
    const result = await AgentBridge.setGitHubToken(githubToken)
    setGithubBusy(false)
    if (result?.success) {
      setGithubToken("")
      setGithubMessage(githubToken.trim() ? "GitHub PAT encrypted and saved on this device." : "GitHub PAT removed.")
      setGithubAuth((current) => ({ ...current, configured: Boolean(githubToken.trim()), authenticated: Boolean(githubToken.trim()), source: githubToken.trim() ? "pat" : "none" }))
    } else setGithubMessage(result?.error || "Could not save GitHub PAT.")
  }

  return (
    <div data-research-lab className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-6">
      <section role="dialog" aria-modal="true" aria-labelledby="settings-title" className="flex h-[min(800px,92vh)] w-full max-w-6xl min-w-0 overflow-hidden rounded-[24px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#111111] text-[#000000] dark:text-[#ffffff] shadow-[0px_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0px_4px_32px_rgba(0,0,0,0.4)]">
        <aside className="flex w-52 shrink-0 flex-col border-r border-[#e0e0e0] dark:border-[#222222] bg-[#fafafa] dark:bg-[#161616] p-3 sm:w-64 sm:p-5">
          <div className="mb-5 flex items-center gap-2 px-2">
            <TuraenLogo className="h-5 w-5 text-[#0A0A0A] dark:text-[#FAFAFA]" />
            <h2 id="settings-title" className="headline-md text-base font-semibold tracking-tight">Settings</h2>
          </div>
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto" aria-label="Settings sections">
            <button type="button" onClick={() => setActiveTab("general")} className={`w-full rounded-full px-3 py-2 text-left text-sm transition-colors ${activeTab === "general" ? "bg-[#f1f1f1] dark:bg-[#262626] font-medium text-[#000000] dark:text-[#ffffff]" : "text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"}`}>General</button>
            <button type="button" onClick={() => setActiveTab("skills")} className={`w-full rounded-full px-3 py-2 text-left text-sm transition-colors ${activeTab === "skills" ? "bg-[#f1f1f1] dark:bg-[#262626] font-medium text-[#000000] dark:text-[#ffffff]" : "text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"}`}>Skills (Local)</button>
            <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888888] dark:text-[#777777]">Providers</div>
            {NAV.slice(2, 5).map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`w-full rounded-full px-3 py-2 pl-5 text-left text-sm transition-colors ${activeTab === item.id ? "bg-[#f1f1f1] dark:bg-[#262626] font-medium text-[#000000] dark:text-[#ffffff]" : "text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"}`}>{item.label}</button>
            ))}
            <div className="my-3 border-t border-[#e0e0e0] dark:border-[#262626]" />
            {NAV.slice(5).map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`w-full rounded-full px-3 py-2 text-left text-sm transition-colors ${activeTab === item.id ? "bg-[#f1f1f1] dark:bg-[#262626] font-medium text-[#000000] dark:text-[#ffffff]" : "text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5"}`}>{item.label}</button>
            ))}
          </nav>
          <button type="button" onClick={onClose} className="mt-4 rounded-full border border-[#e0e0e0] dark:border-[#333333] px-3 py-2 text-sm text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Close settings</button>
        </aside>

        <main className="relative min-w-0 flex-1 overflow-y-auto bg-white dark:bg-[#111111] p-5 sm:p-8">
          {activeTab === "provider-local" && <LocalModelsSettings onUseModel={onUseModel} />}

          {activeTab === "skills" && (
            <section className="max-w-2xl space-y-6">
              <header>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold tracking-tight">Local Skills</h3>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-medium">100% Zero-Egress</span>
                </div>
                <p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">
                  Modular local agent skills executing directly on your machine with no external telemetry.
                </p>
              </header>

              <div className="space-y-3">
                {skillsList.map((skill) => (
                  <div key={skill.id} className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold">{skill.name}</span>
                        <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px]">{skill.badge}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleCopySkill(skill)} className="grid h-7 w-7 place-items-center rounded-full border border-[#e0e0e0] dark:border-[#333333] hover:bg-black/5 dark:hover:bg-white/5 text-xs">
                          {copiedSkillId === skill.id ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <input type="checkbox" checked={skill.enabled} onChange={() => handleToggleSkill(skill.id)} className="h-4 w-4 rounded accent-black dark:accent-white cursor-pointer" />
                      </div>
                    </div>
                    <p className="text-xs text-[#666666] dark:text-[#999999]">{skill.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "provider-account" && <section className="max-w-xl space-y-5">
            <header><h3 className="text-2xl font-semibold tracking-tight">Account & Billing</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">Manage your workspace identity, plan, and Stripe-ready Pro access.</p></header>
            <div className="rounded-[20px] border border-[#dcdcdc] bg-[#fafafa] p-4 dark:border-[#303030] dark:bg-[#181818]"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777]">Current plan</p><p className="mt-2 text-lg font-semibold">{isPro(plan) ? "Turaen Pro" : "Turaen Free"}</p><p className="mt-1 text-xs text-[#777] dark:text-[#aaa]">{isPro(plan) ? "Full local and autonomous engineering access." : "Lightweight local models and focused workspace limits."}</p></div><span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white dark:bg-white dark:text-black">{isPro(plan) ? "PRO" : "FREE"}</span></div><div className="mt-4 flex flex-wrap gap-2"><a href={STRIPE_PAYMENT_LINK_URL} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-full bg-black px-4 text-xs font-medium text-white dark:bg-white dark:text-black">Upgrade with Stripe</a><button type="button" onClick={async () => { const next = await savePlanState({ tier: isPro(plan) ? "free" : "pro", devPreview: !isPro(plan) }); onPlanChange?.(next) }} className="h-9 rounded-full border border-[#d8d8d8] px-4 text-xs font-medium hover:bg-black/5 dark:border-[#3a3a3a] dark:hover:bg-white/10">{isPro(plan) ? "Disable dev preview" : "Enable Pro dev preview"}</button></div><p className="mt-3 text-[11px] text-[#888]">Dev preview is local-only and lets you test both tiers before connecting Stripe webhooks.</p></div>
            <div className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#666666] dark:text-[#999999]">Current account</p><p className="mt-2 text-sm font-medium">{userEmail || currentUser?.email || (isGuest ? "Guest session" : "Signed in")}</p><p className="mt-1 text-xs text-[#666666] dark:text-[#999999]">{isGuest ? "Your guest session stays available on this device." : "Account linked to Turaen."}</p></div>
            {isGuest && <div className="space-y-3">
              <button type="button" onClick={() => void linkGoogle()} disabled={accountBusy || !currentUser} className="h-[36px] px-5 rounded-[40px] border border-[#e0e0e0] dark:border-[#333333] text-sm hover:bg-[#f5f5f5] dark:hover:bg-[#202020] disabled:opacity-50">Link Google account</button>
              <div className="flex min-w-0 flex-wrap gap-2">
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="min-w-40 flex-1 h-[36px] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-transparent px-4 text-sm outline-none focus:border-black dark:focus:border-white" />
                <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="min-w-36 flex-1 h-[36px] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-transparent px-4 text-sm outline-none focus:border-black dark:focus:border-white" />
                <button type="button" onClick={() => void linkEmail()} disabled={accountBusy || !currentUser} className="h-[36px] px-5 rounded-[40px] border border-[#e0e0e0] dark:border-[#333333] text-sm hover:bg-[#f5f5f5] dark:hover:bg-[#202020] disabled:opacity-50">Link email</button>
              </div>
            </div>}
            {accountMessage && <p role="status" className="break-words text-xs text-[#666666] dark:text-[#999999]">{accountMessage}</p>}
            <div className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] p-4">
              <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold">GitHub integration</p><p className="mt-1 text-xs text-[#666666] dark:text-[#999999]">{githubAuth?.authenticated ? `Connected${githubAuth.account ? ` as ${githubAuth.account}` : ""} via ${githubAuth.source || "GitHub"}.` : "Connect GitHub to let the agent push branches and open Pull Requests."}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${githubAuth?.authenticated ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-black/5 text-[#777] dark:bg-white/10 dark:text-[#aaa]"}`}>{githubAuth?.authenticated ? "Connected" : "Not connected"}</span></div>
              <label className="mt-4 block text-xs font-medium">GitHub Personal Access Token (PAT)<input type="password" autoComplete="new-password" value={githubToken} onChange={(event) => setGithubToken(event.target.value)} placeholder="github_pat_…" className="mt-2 w-full rounded-[14px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3 py-2.5 font-normal outline-none focus:border-black dark:focus:border-white" /></label>
              <div className="mt-3 flex items-center justify-between gap-3"><span className="text-[11px] text-[#777]">Stored with OS encrypted app storage.</span><button type="button" onClick={() => void saveGithubPat()} disabled={githubBusy || !githubToken.trim()} className="h-[32px] rounded-full border border-[#e0e0e0] dark:border-[#333333] px-4 text-xs hover:bg-[#f5f5f5] dark:hover:bg-[#202020] disabled:opacity-50">{githubBusy ? "Saving…" : "Save PAT"}</button></div>
              {githubAuth?.configured && <button type="button" onClick={() => { void AgentBridge.setGitHubToken("").then(() => { setGithubToken(""); setGithubAuth((current) => ({ ...current, configured: false, authenticated: false, source: "none" })); setGithubMessage("GitHub PAT removed.") }) }} className="mt-3 text-xs text-[#777] underline underline-offset-2">Remove saved PAT</button>}
              {githubMessage && <p role="status" className="mt-2 text-xs text-[#666666] dark:text-[#999999]">{githubMessage}</p>}
            </div>
            <label className="flex items-center justify-between rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm">Cloud sync<input type="checkbox" checked={preference.cloudSync === "true"} onChange={(event) => savePreference("cloudSync", String(event.target.checked))} className="accent-black dark:accent-white" /></label>
            <div className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#92959c]">Usage</p><p className="mt-2 text-sm">Local model requests are private to this device.</p><p className="mt-1 text-xs text-[#858990]">Cloud usage is managed by your linked Turaen account.</p></div>
          </section>}

          {activeTab === "provider-byok" && <section className="max-w-2xl space-y-6">
            <header><h3 className="text-2xl font-semibold tracking-tight">Bring your own keys</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">Keys stay in this app profile. Test a key to check that the provider accepts it.</p></header>
            {[
              { label: "OpenAI", key: "ideaai_openai_api_key", url: "https://api.openai.com/v1/models", headers: (value: string) => ({ Authorization: `Bearer ${value}` }) },
              { label: "Anthropic", key: "ideaai_anthropic_api_key", url: "https://api.anthropic.com/v1/models", headers: (value: string) => ({ "x-api-key": value, "anthropic-version": "2023-06-01" }) },
              { label: "Google Gemini", key: "ideaai_google_api_key", url: "https://generativelanguage.googleapis.com/v1beta/models?key=", headers: (_value: string) => ({}), queryKey: true },
              { label: "OpenRouter", key: "ideaai_openrouter_api_key", url: "https://openrouter.ai/api/v1/models", headers: (value: string) => ({ Authorization: `Bearer ${value}` }) },
            ].map((prov) => <div key={prov.key} className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] p-4"><label className="block text-sm font-medium">{prov.label}<input type="password" autoComplete="off" placeholder="Paste API key" defaultValue={typeof window !== "undefined" ? localStorage.getItem(prov.key) || "" : ""} onChange={(event) => localStorage.setItem(prov.key, event.target.value)} className="mt-2 w-full rounded-[14px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3 py-2.5 font-normal outline-none focus:border-black dark:focus:border-white" /></label><div className="mt-3 flex items-center justify-between gap-3"><button type="button" onClick={() => void testProviderKey(prov.label, prov.key, prov.url, prov.headers, "queryKey" in prov && prov.queryKey)} className="h-[32px] px-4 rounded-full border border-[#e0e0e0] dark:border-[#333333] text-xs hover:bg-[#f5f5f5] dark:hover:bg-[#202020]">Test connection</button><span role="status" className="text-[11px] text-[#777]">{keyTest[prov.label] || "Stored on this device"}</span></div></div>)}
          </section>}

          {activeTab === "general" && <section className="max-w-2xl space-y-5">
            <header><h3 className="text-2xl font-semibold tracking-tight">General</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">Tune the workspace to your preferred environment.</p></header>
            {[
              { key: "theme", label: "Appearance", values: ["System", "Light", "Dark"] },
              { key: "language", label: "Language", values: ["English"] },
              { key: "startup", label: "On startup", values: ["Restore last workspace", "Open workspace picker", "Choose each time"] },
              { key: "typography", label: "Interface font", values: ["OpenAI Sans", "Inter", "Satoshi", "Plus Jakarta Sans"] },
              { key: "fontScale", label: "Typography scale", values: ["Compact", "Default", "Comfortable"] }
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between gap-5 rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm">
                <span>{item.label}</span>
                <select value={preference[item.key] || item.values[0]} onChange={(event) => savePreference(item.key, event.target.value)} className="max-w-[56%] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3 py-1.5 text-xs text-[#000000] dark:text-[#ffffff] outline-none">
                  {item.values.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
            ))}
            <label className="flex items-center justify-between rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm">Auto-save drafts<input type="checkbox" checked={preference.autosave !== "false"} onChange={(event) => savePreference("autosave", String(event.target.checked))} className="accent-black dark:accent-white" /></label>
          </section>}

          {activeTab === "agent" && <section className="max-w-2xl space-y-5">
            <header><h3 className="text-2xl font-semibold tracking-tight">Agent & Autonomy</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">Choose how much control Turaen has while working.</p></header>
            <label className="flex items-center justify-between gap-5 rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm"><span>Approval mode</span><select value={preference.approval || "Ask before edits"} onChange={(event) => savePreference("approval", event.target.value)} className="rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3 py-1.5 text-xs outline-none">{["Ask before edits", "Auto-approve file edits", "Full auto"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="flex items-center justify-between rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm">Git worktree isolation<input type="checkbox" checked={preference.worktree === "true"} onChange={(event) => savePreference("worktree", String(event.target.checked))} className="accent-black dark:accent-white" /></label>
            <label className="block rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] p-4 text-sm">Custom system rules (.ideaairules)<textarea value={preference.systemRules || ""} onChange={(event) => savePreference("systemRules", event.target.value)} placeholder="Add project-specific guidance…" className="mt-3 min-h-32 w-full resize-y rounded-[14px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] p-3 text-xs outline-none focus:border-black dark:focus:border-white" /></label>
          </section>}

          {activeTab === "terminal" && <section className="max-w-2xl space-y-5">
            <header><h3 className="text-2xl font-semibold tracking-tight">Terminal & Shell</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">Configure the integrated project terminal.</p></header>
            {[
              { key: "shell", label: "Default shell", values: ["PowerShell", "CMD", "Git Bash", "WSL"] },
              { key: "terminalFontSize", label: "Font size", values: ["11", "12", "13", "14", "16"] }
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm">{item.label}<select value={preference[item.key] || (item.key === "shell" ? "PowerShell" : "13")} onChange={(event) => savePreference(item.key, event.target.value)} className="rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3 py-1.5 text-xs outline-none">{item.values.map((value) => <option key={value}>{value}</option>)}</select></label>
            ))}
            <label className="flex items-center justify-between rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#181818] px-4 py-3 text-sm">Stream agent commands in terminal<input type="checkbox" checked={preference.liveStreaming !== "false"} onChange={(event) => savePreference("liveStreaming", String(event.target.checked))} className="accent-black dark:accent-white" /></label>
          </section>}

          {activeTab === "keybindings" && <section className="max-w-xl space-y-5"><header><h3 className="text-2xl font-semibold tracking-tight">Keybindings</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">Workspace shortcuts.</p></header><div className="rounded-[16px] border border-[#e0e0e0] dark:border-[#262626] p-4 text-sm">Enter sends · Shift + Enter inserts a line break</div></section>}

          {activeTab === "about" && <section className="max-w-xl space-y-5"><header><TuraenLogo className="mb-4 h-12 w-12 text-[#0A0A0A] dark:text-[#FAFAFA]" /><h3 className="text-2xl font-semibold tracking-tight">About Turaen</h3><p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">A local-first engineering workspace with optional cloud providers.</p></header><p className="text-sm">Version 0.2.0 (2026–2027 Standard)</p><a href="https://turaen.com" target="_blank" rel="noreferrer" className="text-sm underline underline-offset-2">turaen.com</a></section>}
        </main>
      </section>
    </div>
  )
}
