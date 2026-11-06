import React, { useState, useEffect } from "react"
import { X, User, Settings, Palette, Zap, Puzzle, Globe, Laptop, HelpCircle, ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  initialTab?: string
  userEmail?: string | null
}

const TABS = [
  { id: "general", label: "General" },
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "models", label: "AI Brain & Engine" },
  { id: "integrations", label: "Integrations & CI/CD" },
  { id: "customizations", label: "Customizations" },
  { id: "browser", label: "Browser" },
  { id: "app", label: "App" },
]

export function SettingsModal({ isOpen, onClose, initialTab = "general", userEmail }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedAvatar, setSelectedAvatar] = useState(0)
  const [localProjects, setLocalProjects] = useState<string[]>([])
  const [activeEngine, setActiveEngine] = useState("hybrid")
  const [keySaved, setKeySaved] = useState(false)
  const [railwayToken, setRailwayToken] = useState("")
  const [railwayTokenType, setRailwayTokenType] = useState<"account" | "workspace" | "project">("workspace")
  const [railwayConnected, setRailwayConnected] = useState(false)
  const [railwayStatus, setRailwayStatus] = useState("")
  const [railwayLoading, setRailwayLoading] = useState(false)
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({})
  const [desktopNotifications, setDesktopNotifications] = useState(false)
  const [browserPreference, setBrowserPreference] = useState<"Google" | "Microsoft Edge">("Google")
  const [codeGeneration, setCodeGeneration] = useState(true)
  const [webResearch, setWebResearch] = useState(true)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [conversations, setConversations] = useState<Array<{ title: string; updatedAt?: number }>>([])

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      fetch("/api/integrations/railway")
        .then((response) => response.json())
        .then((data) => setRailwayConnected(data.connected === true))
        .catch(() => setRailwayConnected(false))
      setLocalProjects(JSON.parse(localStorage.getItem("ideaai_projects") || "[]").map((project: { name?: string }) => project.name || "").filter(Boolean))
      setDesktopNotifications(localStorage.getItem("ideaai_desktop_notifications") === "enabled")
      setBrowserPreference(localStorage.getItem("ideaai_browser_preference") === "edge" ? "Microsoft Edge" : "Google")
      setCodeGeneration(localStorage.getItem("ideaai_skill_code_generation") !== "disabled")
      setWebResearch(localStorage.getItem("ideaai_skill_web_research") !== "disabled")
      setSystemPrompt(localStorage.getItem("ideaai_global_system_prompt") || "")
      setConversations(JSON.parse(localStorage.getItem("ideaai_chat_history") || "[]").map((item: { title?: string; updatedAt?: number }) => ({ title: item.title || "Untitled conversation", updatedAt: item.updatedAt })).slice(0, 30))
    }
  }, [isOpen, initialTab])

  if (!isOpen) return null

  const abstractAvatars = [
    "bg-gradient-to-br from-[#4f46e5] to-[#818cf8]", // Primary Indigo
    "bg-gradient-to-br from-[#059669] to-[#34d399]", // Emerald
    "bg-gradient-to-br from-[#dc2626] to-[#f87171]", // Rose
    "bg-gradient-to-br from-[#d97706] to-[#fbbf24]", // Amber
    "bg-[#171717]", // Solid Dark
    "bg-gradient-to-br from-[#c026d3] to-[#f472b6]", // Fuchsia
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-[900px] h-[700px] max-h-[90vh] bg-[#f9f9f9] rounded-[16px] shadow-2xl flex overflow-hidden border border-[#e5e5e5]"
      >
        {/* Left Sidebar */}
        <div className="w-[240px] bg-[#f4f4f4] border-r border-[#e5e5e5] flex flex-col pt-8 pb-4 shrink-0">
          <div className="px-4 text-[13px] font-semibold text-[#171717] mb-4">Settings</div>
          
          <div className="flex-1 overflow-y-auto px-2 space-y-[2px]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                  activeTab === tab.id 
                    ? "bg-[#e5e5e5] text-[#171717] font-medium" 
                    : "text-[#525252] hover:bg-[#ebebeb]"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <div className="mt-8 mb-2 px-2 text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider">
              Projects
            </div>
            
            {localProjects.map((proj, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTab("projects")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] truncate transition-colors ${activeTab === "projects" ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#ebebeb]"}`}
                title={proj}
              >
                {proj.split('\\').pop() || proj}
              </button>
            ))}

            <button 
              onClick={() => setActiveTab("projects")}
              className="w-full text-left px-3 py-1.5 text-[13px] text-[#737373] hover:text-[#171717] transition-colors"
            >
              Manage Projects...
            </button>

            <div className="mt-4">
              <button 
                onClick={() => setActiveTab("projects")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${activeTab === "projects" ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#ebebeb]"}`}
              >
                Not in Project
              </button>
              <button 
                onClick={() => setActiveTab("conversations")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${activeTab === "conversations" ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#ebebeb]"}`}
              >
                Conversations
              </button>
            </div>
          </div>

          <div className="px-2 mt-auto pt-4 border-t border-[#e5e5e5]">
            <button 
              onClick={() => setActiveTab("shortcuts")}
              className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${activeTab === "shortcuts" ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#ebebeb]"}`}
            >
              Shortcuts
            </button>
            <button 
              onClick={() => setActiveTab("feedback")}
              className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${activeTab === "feedback" ? "bg-[#e5e5e5] text-[#171717] font-medium" : "text-[#525252] hover:bg-[#ebebeb]"}`}
            >
              Provide Feedback
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-1.5 rounded-md text-[#737373] hover:bg-[#f4f4f4] hover:text-[#171717] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-10">
            
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">General</h2>
                <p className="text-[14px] text-[#737373] mb-8">Configure agent execution, queued message delivery, and permissions.</p>

                <div className="space-y-8">
                  {/* Execution */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Execution</h3>
                    <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                      <div>
                        <div className="text-[14px] text-[#171717] font-medium">Queued Messages</div>
                        <div className="text-[13px] text-[#737373]">Configure when follow-up messages are sent.</div>
                        <div className="text-[12px] text-[#a3a3a3] flex items-center gap-1 mt-0.5">Keyboard shortcuts <HelpCircle className="w-3 h-3" /></div>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] text-[#525252] transition-colors">
                        Queue After Turn <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Agent Settings */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Agent Settings</h3>
                    <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                      <div className="max-w-[70%]">
                        <div className="text-[14px] text-[#171717] font-medium">Security Preset</div>
                        <div className="text-[13px] text-[#737373] leading-snug mt-0.5">Choose a predefined security preset for the agent. This controls terminal auto-execution policy, and file access policy.</div>
                        <div className="text-[12px] text-[#a3a3a3] flex items-center gap-1 mt-1">Learn more about Default <HelpCircle className="w-3 h-3" /></div>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] text-[#525252] transition-colors">
                        Default <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Agent Behavior */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Agent Behavior</h3>
                    <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                      <div className="max-w-[70%]">
                        <div className="text-[14px] text-[#171717] font-medium">Artifact Review Policy</div>
                        <div className="text-[13px] text-[#737373] leading-snug mt-0.5">Specifies Agent's behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.</div>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] text-[#525252] transition-colors">
                        Always Ask <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* File Permissions */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#171717] mb-3">File Permissions</h3>
                    <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                      <div>
                        <div className="text-[14px] text-[#171717] font-medium">File Access Rules</div>
                        <div className="text-[13px] text-[#737373] mt-0.5">Configure allowed and denied paths for file reads and writes.</div>
                      </div>
                      <button className="px-4 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] font-medium text-[#171717] transition-colors">
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Account & Usage</h2>
                <p className="text-[14px] text-[#737373] mb-8">Manage your profile, and account details.</p>

                

                <div className="space-y-8">
                  {/* Avatar Selection */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Profile Avatar</h3>
                    <div className="p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                      <div className="text-[13px] text-[#737373] mb-4">Choose a modern abstract avatar for your workspace identicon.</div>
                      <div className="flex items-center gap-3">
                        {abstractAvatars.map((bg, index) => (
                          <button 
                            key={index}
                            onClick={() => setSelectedAvatar(index)}
                            className={`relative w-12 h-12 rounded-full border-[3px] transition-all ${bg} ${
                              selectedAvatar === index ? "border-white shadow-[0_0_0_2px_#171717]" : "border-transparent hover:scale-105"
                            }`}
                          >
                            {selectedAvatar === index && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Account Details</h3>
                    <div className="p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5] space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#737373]">Email Address</span>
                        <span className="text-[14px] font-medium text-[#171717]">{userEmail || "user@togetlink.com"}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-[#e5e5e5]">
                        <span className="text-[13px] text-[#737373]">Current Balance</span>
                        <span className="text-[14px] font-semibold text-[#171717]">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-[#e5e5e5]">
                        <span className="text-[13px] text-[#737373]">Account Status</span>
                        <span className="text-[13px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
            
            {/* APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Appearance</h2>
                <p className="text-[14px] text-[#737373] mb-8">Customize the look and feel of the platform.</p>
                
                <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Theme Preferences</h3>
                <div className="flex gap-4 mb-8">
                  <button className="flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-[#171717] bg-[#f4f4f4]">
                    <div className="w-full h-24 rounded-lg bg-white border border-[#e5e5e5] shadow-sm flex flex-col p-2 gap-2">
                       <div className="w-1/2 h-3 bg-[#f0f0f0] rounded-sm"></div>
                       <div className="w-3/4 h-3 bg-[#f0f0f0] rounded-sm"></div>
                    </div>
                    <span className="text-[13px] font-medium text-[#171717]">Light Mode</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border border-[#e5e5e5] hover:border-[#a3a3a3] transition-colors bg-[#f4f4f4] opacity-70 cursor-not-allowed">
                    <div className="w-full h-24 rounded-lg bg-[#171717] border border-[#262626] shadow-sm flex flex-col p-2 gap-2">
                       <div className="w-1/2 h-3 bg-[#262626] rounded-sm"></div>
                       <div className="w-3/4 h-3 bg-[#262626] rounded-sm"></div>
                    </div>
                    <span className="text-[13px] font-medium text-[#737373]">Dark Mode (Soon)</span>
                  </button>
                </div>
              </div>
            )}

            {/* MODELS TAB */}
            {activeTab === "models" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">AI Brain & Engine</h2>
                <p className="text-[14px] text-[#737373] mb-8">Select the computational engine that powers IdeaAI's autonomy.</p>
                
                <div className="space-y-4 mb-8">
                  {/* Option 1: Azure Enterprise Cloud */}
                  <label 
                    onClick={() => setActiveEngine("hybrid")}
                    className={`flex flex-col p-4 bg-white border-2 rounded-xl cursor-pointer shadow-sm relative overflow-hidden transition-colors ${activeEngine === "hybrid" ? "border-[#171717]" : "border-[#e5e5e5] hover:border-[#d4d4d4]"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          ☁️
                        </div>
                        <div className="text-[15px] font-semibold text-[#171717]">Azure Enterprise Cloud (Llama 3.2)</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full ${activeEngine === "hybrid" ? "border-[5px] border-[#171717]" : "border-2 border-[#d4d4d4]"}`}></div>
                    </div>
                    <p className="text-[13px] text-[#525252] leading-relaxed mb-3">
                      Powered by high-performance Microsoft Azure E-series Compute (4 vCPU, 32GB RAM). 
                      Runs deterministic cloud execution and overnight GitHub CI/CD agents while you sleep.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold uppercase tracking-wide">
                        Azure E-Class (32GB)
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-semibold uppercase tracking-wide">
                        Cloud Worker Live
                      </span>
                    </div>
                  </label>

                  {/* Option 2: BYOK */}
                  <div 
                    onClick={() => setActiveEngine("byok")}
                    className={`flex flex-col p-4 border rounded-xl transition-colors cursor-pointer ${activeEngine === "byok" ? "bg-[#f4f4f4] border-[#171717] border-2" : "bg-[#f4f4f4] border-[#e5e5e5] hover:border-[#d4d4d4]"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#e5e5e5] flex items-center justify-center text-[#737373] text-xs font-bold">
                          🔑
                        </div>
                        <div className="text-[15px] font-semibold text-[#171717]">Bring Your Own Key (BYOK)</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full bg-white ${activeEngine === "byok" ? "border-[5px] border-[#171717]" : "border-2 border-[#d4d4d4]"}`}></div>
                    </div>
                    <p className="text-[13px] text-[#737373] mb-4">
                      Connect your own OpenAI or Anthropic keys. <span className="font-semibold text-[#171717]">100% Free during Early Stage.</span>
                    </p>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="password" 
                        placeholder="sk-proj-... or sk-ant-..." 
                        className="w-full p-2.5 rounded-lg border border-[#d4d4d4] text-[13px] focus:outline-none focus:border-[#171717] bg-white shadow-sm"
                        defaultValue={typeof window !== 'undefined' ? localStorage.getItem('ideaai_api_key') || '' : ''}
                        onChange={(e) => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('ideaai_api_key', e.target.value.trim());
                            setKeySaved(false);
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          setKeySaved(true);
                          setActiveEngine("byok");
                          setTimeout(() => setKeySaved(false), 2000);
                        }}
                        className={`absolute right-2 top-1.5 px-3 py-1 rounded text-[11px] font-medium transition-colors ${keySaved ? "bg-green-500 hover:bg-green-600 text-white" : "bg-[#171717] hover:bg-[#262626] text-white"}`}
                      >
                        {keySaved ? "Saved!" : "Save Key"}
                      </button>
                    </div>
                  </div>

                  {/* Option 3: Local Engine */}
                  <label 
                    onClick={() => setActiveEngine("local")}
                    className={`flex flex-col p-4 bg-white border rounded-xl cursor-pointer transition-colors ${activeEngine === "local" ? "border-[#171717] border-2" : "border-[#e5e5e5] hover:border-[#d4d4d4]"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#171717] flex items-center justify-center text-white text-xs font-bold">
                          🖥️
                        </div>
                        <div className="text-[15px] font-semibold text-[#171717]">Local Engine (Ollama)</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full ${activeEngine === "local" ? "border-[5px] border-[#171717]" : "border-2 border-[#d4d4d4]"}`}></div>
                    </div>
                    <p className="text-[13px] text-[#737373]">
                      Run open-source models completely offline on your own hardware. Maximum privacy, zero latency. Requires 16GB+ RAM.
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === "integrations" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Integrations & CI/CD</h2>
                <p className="text-[14px] text-[#737373] mb-8">Connect external services to enable autonomous overnight execution.</p>
                
                {/* GitHub App */}
                <div className="flex flex-col p-4 bg-white border border-[#e5e5e5] rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#171717] flex items-center justify-center overflow-hidden">
                        <img src="/matrix-demo/app/png-transparent-github-social-media-computer-icons-logo-android-github-logo-computer-wallpaper-banner.png" alt="GitHub" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[#171717]">GitHub Repository Access</div>
                        <div className="text-[13px] text-[#737373]">Required for overnight push & PR automation</div>
                      </div>
                    </div>
                    <a href="/api/github/auth" className="px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white rounded-lg text-[13px] font-medium transition-colors">
                      Connect GitHub
                    </a>
                  </div>
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <p className="text-[12px] text-blue-800">
                      <strong>Status:</strong> Not connected. IdeaAI cannot push code or monitor failing GitHub Actions overnight until you authorize access.
                    </p>
                  </div>
                </div>

                {/* Railway */}
                <div className="flex flex-col p-4 bg-white border border-[#e5e5e5] rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#e5e5e5] flex items-center justify-center overflow-hidden">
                      <img src="/matrix-demo/app/9253400_imgwebp-removebg-preview.png" alt="Railway" className="h-full w-full object-contain p-1" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[#171717]">Railway Cloud Execution</div>
                        <div className="text-[13px] text-[#737373]">Run an overnight worker while your computer is offline</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[12px] font-medium ${railwayConnected ? "bg-emerald-100 text-emerald-700" : "bg-[#f4f4f4] text-[#737373]"}`}>
                      {railwayConnected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-5 text-[#737373]">
                    Railway is optional. It provides cloud compute for overnight jobs; GitHub access is still required for repository checkout and pull requests.
                  </p>
                  {!railwayConnected && (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-2">
                        <select value={railwayTokenType} onChange={(event) => setRailwayTokenType(event.target.value as typeof railwayTokenType)} className="rounded-lg border border-[#d4d4d4] bg-white px-3 py-2 text-[13px] text-[#171717]">
                          <option value="workspace">Workspace token</option>
                          <option value="project">Project token</option>
                          <option value="account">Account token</option>
                        </select>
                        <input type="password" value={railwayToken} onChange={(event) => setRailwayToken(event.target.value)} placeholder="Railway token" className="min-w-0 flex-1 rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] text-[#171717] focus:outline-none focus:border-[#171717]" />
                      </div>
                      <button
                        type="button"
                        disabled={railwayLoading}
                        onClick={async () => {
                          setRailwayLoading(true)
                          setRailwayStatus("")
                          try {
                            const response = await fetch("/api/integrations/railway", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: railwayToken, tokenType: railwayTokenType }) })
                            const data = await response.json()
                            if (!response.ok) throw new Error(data.error || "Railway connection failed.")
                            setRailwayConnected(true)
                            setRailwayToken("")
                            setRailwayStatus("Railway connection verified and stored securely.")
                          } catch (error) {
                            setRailwayStatus(error instanceof Error ? error.message : "Railway connection failed.")
                          } finally {
                            setRailwayLoading(false)
                          }
                        }}
                        className="rounded-lg bg-[#171717] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#262626] disabled:opacity-50"
                      >
                        {railwayLoading ? "Verifying..." : "Connect Railway"}
                      </button>
                    </div>
                  )}
                  {railwayConnected && (
                    <button type="button" onClick={async () => { await fetch("/api/integrations/railway", { method: "DELETE" }); setRailwayConnected(false); setRailwayStatus("Railway disconnected.") }} className="mt-3 self-start text-[12px] text-red-600 hover:underline">
                      Disconnect Railway
                    </button>
                  )}
                  {railwayStatus && <p className="mt-3 text-[12px] text-[#525252]">{railwayStatus}</p>}
                  <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-[12px] leading-5 text-amber-800">
                    Official Railway API: <code>backboard.railway.com/graphql/v2</code>. Use a scoped workspace or project token for production.
                  </div>
                </div>

                {/* Developer Tools & Productivity Integrations */}
                <div className="mt-8">
                  <h3 className="text-[16px] font-semibold text-[#171717] mb-1">Developer Tools & Productivity</h3>
                  <p className="text-[13px] text-[#737373] mb-4">Connect workplace tools for context indexing, task delegation and automations.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {/* Gmail */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Gmail</div>
                          <div className="text-[11px] text-[#737373]">Read & summarize emails</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Google Calendar */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><rect x="2" y="3" width="20" height="19" rx="3" fill="#4285F4"/><rect x="4" y="8" width="16" height="12" rx="1" fill="#fff"/><rect x="6" y="10" width="3" height="2.5" rx="0.5" fill="#4285F4"/><rect x="10.5" y="10" width="3" height="2.5" rx="0.5" fill="#4285F4"/><rect x="15" y="10" width="3" height="2.5" rx="0.5" fill="#4285F4"/><rect x="6" y="14.5" width="3" height="2.5" rx="0.5" fill="#4285F4"/><rect x="10.5" y="14.5" width="3" height="2.5" rx="0.5" fill="#4285F4"/><rect x="7" y="2" width="2" height="3" rx="1" fill="#4285F4"/><rect x="15" y="2" width="2" height="3" rx="1" fill="#4285F4"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Google Calendar</div>
                          <div className="text-[11px] text-[#737373]">Schedule meetings & tasks</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Google Drive */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M8.267 14.68l-1.6 2.76H22.4l1.6-2.76z" fill="#4285F4"/><path d="M8 3L1.6 14.68l1.6 2.76L15.2 3z" fill="#0F9D58"/><path d="M15.2 3H8l6.4 11.68h7.2z" fill="#FFCD40"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Google Drive</div>
                          <div className="text-[11px] text-[#737373]">Sync documents & assets</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Slack */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/><path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/><path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/><path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Slack</div>
                          <div className="text-[11px] text-[#737373]">Post updates & listen to DMs</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Notion */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#171717]"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.37 2.29c-.467-.374-.7-.187-1.587-.28L3.84 3.293c-.467.047-.56.28-.374.467l.993.748zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.886l-15.177.84c-.56.047-.747.327-.747.98zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.187c-.094-.187 0-.653.327-.747l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933l3.222-.187zM3.098 1.87L16.913.936c1.681-.14 2.102.28 2.803.793L23.15 4.16c.467.374.607.84.607 1.354v17.437c0 1.167-.42 1.821-1.915 1.914l-15.457.934c-1.12.047-1.681-.14-2.289-.84L1.107 21.2c-.7-.934-.84-1.634-.84-2.707V4.348c0-1.4.42-2.427 1.831-2.477z"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Notion</div>
                          <div className="text-[11px] text-[#737373]">Docs, knowledge & roadmap</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Figma */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83"/><path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF"/><path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E"/><path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262"/><path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Figma</div>
                          <div className="text-[11px] text-[#737373]">Inspect UI specs & components</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Supabase */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M13.7 21.8c-.4.5-1.3.2-1.3-.5V13h8.2c.9 0 1.4 1.1.8 1.8L13.7 21.8z" fill="#3ECF8E"/><path d="M10.3 2.2c.4-.5 1.3-.2 1.3.5V11H3.4c-.9 0-1.4-1.1-.8-1.8L10.3 2.2z" fill="#3ECF8E"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Supabase</div>
                          <div className="text-[11px] text-[#737373]">Postgres DB & Edge Functions</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Firebase */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e5e5e5] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M4.53 20.27L6.18 3.72a.42.42 0 0 1 .78-.18l1.74 3.28L4.53 20.27z" fill="#FFA000"/><path d="M12.69 10.37L10.83 6.7 8.7 6.82l2.3 4.38 1.69-.83z" fill="#F57C00"/><path d="M19.47 20.27L17.6 5.21a.42.42 0 0 0-.72-.22l-12.35 15.28L11.78 23.9a1.26 1.26 0 0 0 1.22 0l6.47-3.63z" fill="#FFCA28"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Firebase</div>
                          <div className="text-[11px] text-[#737373]">Auth, Firestore & Rules</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>

                    {/* Vercel */}
                    <div className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl flex items-center justify-between hover:border-[#d4d4d4] transition-all col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center p-1.5">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white"><path d="M12 1L24 22H0L12 1Z"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#171717]">Vercel</div>
                          <div className="text-[11px] text-[#737373]">Live build logs, preview deployments & environment sync</div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-[#e5e5e5] bg-[#f8f8f8] hover:bg-[#eaeaea] text-[#171717] transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMIZATIONS TAB */}
            {activeTab === "customizations" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Customizations</h2>
                <p className="text-[14px] text-[#737373] mb-8">Set system prompts and activate specialized skills.</p>
                
                <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Global System Prompt</h3>
                <textarea 
                  className="w-full h-32 p-3 bg-[#f4f4f4] border border-[#e5e5e5] rounded-lg text-[13px] text-[#171717] focus:outline-none focus:border-[#171717] mb-8 resize-none"
                  value={systemPrompt}
                  onChange={(event) => { setSystemPrompt(event.target.value); localStorage.setItem("ideaai_global_system_prompt", event.target.value) }}
                  placeholder="Add optional instructions for IdeaAI..."
                />

                <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Active Skills</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg">
                    <div className="text-[13px] font-medium text-[#171717]">Code Generation</div>
                    <button type="button" aria-pressed={codeGeneration} onClick={() => { const next = !codeGeneration; setCodeGeneration(next); localStorage.setItem("ideaai_skill_code_generation", next ? "enabled" : "disabled") }} className={`w-10 h-6 rounded-full relative ${codeGeneration ? "bg-[#4f46e5]" : "bg-[#d4d4d4]"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${codeGeneration ? "right-1" : "left-1"}`}></div></button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg">
                    <div className="text-[13px] font-medium text-[#171717]">Web Research</div>
                    <button type="button" aria-pressed={webResearch} onClick={() => { const next = !webResearch; setWebResearch(next); localStorage.setItem("ideaai_skill_web_research", next ? "enabled" : "disabled") }} className={`w-10 h-6 rounded-full relative ${webResearch ? "bg-[#4f46e5]" : "bg-[#d4d4d4]"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${webResearch ? "right-1" : "left-1"}`}></div></button>
                  </div>
                </div>
              </div>
            )}

            {/* BROWSER TAB */}
            {activeTab === "browser" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Browser Tool</h2>
                <p className="text-[14px] text-[#737373] mb-8">Manage how the AI interacts with the internet.</p>
                
                <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                  <div>
                    <div className="text-[14px] text-[#171717] font-medium">Search Engine Preference</div>
                    <div className="text-[13px] text-[#737373]">Which engine the agent uses to look up live facts.</div>
                  </div>
                  <select value={browserPreference} onChange={(event) => { const next = event.target.value as typeof browserPreference; setBrowserPreference(next); localStorage.setItem("ideaai_browser_preference", next === "Microsoft Edge" ? "edge" : "google") }} className="px-3 py-1.5 bg-[#ebebeb] rounded-md text-[13px] text-[#525252]">
                    <option>Google</option>
                    <option>Microsoft Edge</option>
                  </select>
                </div>
              </div>
            )}

            {/* APP TAB */}
            {activeTab === "app" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">App Settings</h2>
                <p className="text-[14px] text-[#737373] mb-8">Manage notifications and language preferences.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                    <div>
                      <div className="text-[14px] text-[#171717] font-medium">Language</div>
                    </div>
                    <span className="px-3 py-1.5 bg-[#ebebeb] rounded-md text-[13px] text-[#525252]">English (US)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                    <div>
                      <div className="text-[14px] text-[#171717] font-medium">Desktop Notifications</div>
                      <div className="text-[13px] text-[#737373]">Receive an alert when an agent finishes a long task.</div>
                    </div>
                    <button type="button" aria-pressed={desktopNotifications} onClick={() => { const next = !desktopNotifications; setDesktopNotifications(next); localStorage.setItem("ideaai_desktop_notifications", next ? "enabled" : "disabled"); if (next && "Notification" in window && Notification.permission === "default") void Notification.requestPermission() }} className={`w-10 h-6 rounded-full relative ${desktopNotifications ? "bg-[#4f46e5]" : "bg-[#e5e5e5]"}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${desktopNotifications ? "right-1" : "left-1"}`}></div></button>
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Projects</h2>
                <p className="text-[14px] text-[#737373] mb-8">Manage your recent and active local projects.</p>
                
                {localProjects.length > 0 ? (
                  <div className="space-y-3">
                    {localProjects.map((proj, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#171717] truncate max-w-[300px]" title={proj}>{proj}</span>
                          <span className="text-[12px] text-[#737373] mt-0.5">Last opened recently</span>
                        </div>
                        <button className="px-3 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] text-[#525252] transition-colors">
                          Open Project
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-[#f4f4f4] border border-[#e5e5e5] border-dashed rounded-xl">
                    <div className="w-12 h-12 bg-[#ebebeb] text-[#a3a3a3] rounded-full flex items-center justify-center mb-3">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-[15px] font-medium text-[#171717] mb-1">No recent projects</h3>
                    <p className="text-[13px] text-[#737373] mb-4">You haven't opened any projects in IdeaAI yet.</p>
                    <button className="px-4 py-2 bg-[#171717] text-white hover:bg-[#262626] rounded-md text-[13px] transition-colors font-medium">
                      Open Folder...
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CONVERSATIONS TAB */}
            {activeTab === "conversations" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Conversations</h2>
                <p className="text-[14px] text-[#737373] mb-8">View your chat history and previous interactions.</p>
                {conversations.length > 0 ? <div className="space-y-2">{conversations.map((conversation) => <div key={`${conversation.title}-${conversation.updatedAt}`} className="flex items-center justify-between rounded-lg border border-[#e5e5e5] bg-[#f4f4f4] px-4 py-3"><span className="truncate text-[13px] text-[#171717]">{conversation.title}</span><span className="ml-3 shrink-0 text-[11px] text-[#737373]">{conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleDateString("en-US") : ""}</span></div>)}</div> : <div className="flex flex-col items-center justify-center py-12 text-center bg-[#f4f4f4] border border-[#e5e5e5] border-dashed rounded-xl">
                  <div className="w-12 h-12 bg-[#ebebeb] text-[#a3a3a3] rounded-full flex items-center justify-center mb-3">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-[15px] font-medium text-[#171717] mb-1">No recent conversations</h3>
                  <p className="text-[13px] text-[#737373]">Your chat history will appear here once you start interacting.</p>
                </div>}
              </div>
            )}

            {/* SHORTCUTS TAB */}
            {activeTab === "shortcuts" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Keyboard Shortcuts</h2>
                <p className="text-[14px] text-[#737373] mb-8">Boost your productivity with these quick actions.</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border-b border-[#e5e5e5]">
                    <span className="text-[13px] text-[#525252]">Open AI Terminal</span>
                    <div className="flex gap-1"><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">Ctrl</kbd><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">K</kbd></div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-[#e5e5e5]">
                    <span className="text-[13px] text-[#525252]">Submit Message</span>
                    <div className="flex gap-1"><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">Enter</kbd></div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-[#e5e5e5]">
                    <span className="text-[13px] text-[#525252]">New Line</span>
                    <div className="flex gap-1"><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">Shift</kbd><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">Enter</kbd></div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-[#e5e5e5]">
                    <span className="text-[13px] text-[#525252]">Toggle Settings</span>
                    <div className="flex gap-1"><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">Ctrl</kbd><kbd className="px-2 py-1 bg-[#f4f4f4] border border-[#e5e5e5] rounded text-[11px] font-mono">,</kbd></div>
                  </div>
                </div>
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === "feedback" && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1">Provide Feedback</h2>
                <p className="text-[14px] text-[#737373] mb-8">Help us improve IdeaAI by sharing your thoughts or reporting issues.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#171717] mb-1.5">What would you like to tell us?</label>
                    <textarea 
                      className="w-full h-32 px-3 py-2 bg-white border border-[#e5e5e5] rounded-md text-[14px] outline-none focus:border-[#a3a3a3] transition-colors resize-none"
                      placeholder="I love the product! Or... I found a bug when trying to..."
                    ></textarea>
                  </div>
                  <button 
                    onClick={() => {
                      window.location.href = "mailto:support@togetlink.com?subject=IdeaAI Feedback";
                    }}
                    className="w-full bg-[#171717] hover:bg-[#262626] text-white px-4 py-2.5 rounded-md text-[14px] font-medium transition-colors"
                  >
                    Send via Email
                  </button>
                  <p className="text-center text-[12px] text-[#a3a3a3] mt-4">
                    Or directly email us at <a href="mailto:support@togetlink.com" className="text-[#525252] hover:underline">support@togetlink.com</a>
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  )
}
