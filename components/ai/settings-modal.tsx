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
  { id: "models", label: "Models" },
  { id: "customizations", label: "Customizations" },
  { id: "browser", label: "Browser" },
  { id: "app", label: "App" },
]

export function SettingsModal({ isOpen, onClose, initialTab = "general", userEmail }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedAvatar, setSelectedAvatar] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
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
            <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] truncate transition-colors">
              C:\Users\dogus\Downloa...
            </button>
            <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] truncate transition-colors">
              MyGame
            </button>
            <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] truncate transition-colors">
              unity-gate.com
            </button>
            <button className="w-full text-left px-3 py-1.5 text-[13px] text-[#737373] hover:text-[#171717] transition-colors">
              Show all
            </button>

            <div className="mt-4">
              <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] transition-colors">
                Not in Project
              </button>
              <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] transition-colors">
                Conversations
              </button>
            </div>
          </div>

          <div className="px-2 mt-auto pt-4 border-t border-[#e5e5e5]">
            <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] transition-colors">
              Shortcuts
            </button>
            <button className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-[#525252] hover:bg-[#ebebeb] transition-colors">
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
                <p className="text-[14px] text-[#737373] mb-8">Manage your profile, active plans, and model usage limits.</p>

                {/* Usage Bar (Prominent) */}
                <div className="mb-10 p-5 bg-[#f4f4f4] rounded-xl border border-[#e5e5e5] relative overflow-hidden">
                  <div className="flex justify-between items-end mb-3 relative z-10">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#171717]">Idea 1.0 Pro Usage</h3>
                      <p className="text-[13px] text-[#737373]">Current billing cycle (resets in 12 days)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[24px] font-bold text-[#171717]">78</span>
                      <span className="text-[14px] text-[#737373]"> / 100 queries</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-[#e5e5e5] rounded-full overflow-hidden relative z-10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] rounded-full"
                    />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex items-center justify-between relative z-10">
                    <span className="text-[13px] text-[#525252]">Need more power?</span>
                    <button className="px-4 py-1.5 bg-[#171717] text-white text-[13px] font-medium rounded-md hover:bg-[#262626] transition-colors">
                      Upgrade to Pro+
                    </button>
                  </div>
                </div>

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
            
            {/* OTHER TABS (Placeholders for UI completeness) */}
            {["appearance", "models", "customizations", "browser", "app"].includes(activeTab) && (
              <div className="max-w-[600px] animate-in fade-in duration-300">
                <h2 className="text-[22px] font-semibold text-[#171717] mb-1 capitalize">{activeTab}</h2>
                <p className="text-[14px] text-[#737373] mb-8">This section is currently under construction in the Elite Antigravity UI.</p>
                <div className="p-10 border-2 border-dashed border-[#e5e5e5] rounded-xl flex items-center justify-center text-[#a3a3a3] text-[14px]">
                  Future settings will appear here.
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  )
}
