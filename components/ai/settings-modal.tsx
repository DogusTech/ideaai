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

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      // fetch or load projects here if necessary
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
                  {/* Option 1: Hybrid Pro */}
                  <label 
                    onClick={() => setActiveEngine("hybrid")}
                    className={`flex flex-col p-4 bg-white border-2 rounded-xl cursor-pointer shadow-sm relative overflow-hidden transition-colors ${activeEngine === "hybrid" ? "border-[#171717]" : "border-[#e5e5e5] hover:border-[#d4d4d4]"}`}
                  >
                    {activeEngine === "hybrid" && (
                      <div className="absolute top-0 right-0 bg-[#171717] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                        Active
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          ★
                        </div>
                        <div className="text-[15px] font-semibold text-[#171717]">IdeaAI Hybrid Engine (Pro)</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full ${activeEngine === "hybrid" ? "border-[5px] border-[#171717]" : "border-2 border-[#d4d4d4]"}`}></div>
                    </div>
                    <p className="text-[13px] text-[#525252] leading-relaxed mb-3">
                      Powered by our custom fine-tuned Llama 3 on high-performance Modal Serverless GPUs. 
                      Seamlessly transitions from local IPC execution to cloud-based CI/CD bot when you sleep.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-semibold uppercase tracking-wide">
                        Zero-State Enabled
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold uppercase tracking-wide">
                        Modal Cluster Ready
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
                      <div className="w-10 h-10 rounded-lg bg-[#171717] flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
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

                {/* Railway / Vercel */}
                <div className="flex flex-col p-4 bg-white border border-[#e5e5e5] rounded-xl mb-4 opacity-70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#e5e5e5] flex items-center justify-center font-bold text-[#171717] text-xl">
                        R
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[#171717]">Railway / Vercel Deployments</div>
                        <div className="text-[13px] text-[#737373]">Autonomous rollback on build failure</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#f4f4f4] text-[#a3a3a3] rounded-lg text-[13px] font-medium cursor-not-allowed">
                      Connect
                    </button>
                  </div>
                  <div className="mt-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-[10px] font-semibold uppercase tracking-wide">Coming Soon</span>
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
                  defaultValue="You are an elite Silicon Valley software engineer. Always answer with the most minimalist, high-end technical approach possible."
                />

                <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Active Skills</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg">
                    <div className="text-[13px] font-medium text-[#171717]">Code Generation</div>
                    <div className="w-10 h-6 bg-[#4f46e5] rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg">
                    <div className="text-[13px] font-medium text-[#171717]">Web Research</div>
                    <div className="w-10 h-6 bg-[#4f46e5] rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
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
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] text-[#525252] transition-colors">
                    Google <ChevronDown className="w-3.5 h-3.5" />
                  </button>
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
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ebebeb] hover:bg-[#e5e5e5] rounded-md text-[13px] text-[#525252] transition-colors">
                      English (US) <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-lg border border-[#e5e5e5]">
                    <div>
                      <div className="text-[14px] text-[#171717] font-medium">Desktop Notifications</div>
                      <div className="text-[13px] text-[#737373]">Receive an alert when an agent finishes a long task.</div>
                    </div>
                    <div className="w-10 h-6 bg-[#e5e5e5] rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
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
                <div className="flex flex-col items-center justify-center py-12 text-center bg-[#f4f4f4] border border-[#e5e5e5] border-dashed rounded-xl">
                  <div className="w-12 h-12 bg-[#ebebeb] text-[#a3a3a3] rounded-full flex items-center justify-center mb-3">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-[15px] font-medium text-[#171717] mb-1">No recent conversations</h3>
                  <p className="text-[13px] text-[#737373]">Your chat history will appear here once you start interacting.</p>
                </div>
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


