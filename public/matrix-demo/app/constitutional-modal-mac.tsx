import React, { useState } from "react"
import { Check, Info, Save, Power, Settings2, Moon } from "lucide-react"

interface ConstitutionalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConstitutionalModalMac({ isOpen, onClose }: ConstitutionalModalProps) {
  const [hybridEnabled, setHybridEnabled] = useState(false)
  const [goal, setGoal] = useState("Sistemdeki kimlik dogrulama hatalarini gider, unit testleri yaz ve kod kalitesini artir.")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[500px] bg-[#f9f9f9] border border-black/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Mac Title Bar */}
        <div className="h-12 bg-white border-b border-black/10 flex items-center px-4 relative">
          <div className="flex gap-2 absolute left-4">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center cursor-pointer"></button>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="w-full text-center text-[13px] font-semibold text-black/70">
            Overnight Goals & Hybrid Execution
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black/90">Constitutional Prompt Engine</h2>
              <p className="text-[13px] text-black/60 leading-relaxed mt-1">
                Configure deterministic background tasks. IdeaAI will seamlessly switch to Cloud CI/CD mode when your computer sleeps.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white border border-black/10 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-black/50" />
                <div>
                  <div className="text-[14px] font-medium text-black/80">Hybrid Serverless Mode</div>
                  <div className="text-[12px] text-black/40">Switch from local IPC to Modal Cloud automatically</div>
                </div>
              </div>
              <button 
                onClick={() => setHybridEnabled(!hybridEnabled)}
                className={`w-11 h-6 rounded-full relative transition-colors ${hybridEnabled ? 'bg-green-500' : 'bg-black/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${hybridEnabled ? 'left-[22px]' : 'left-0.5'}`}></div>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-black/70 flex items-center gap-2">
                Primary Overnight Directive (Constitution)
                <Info className="w-3 h-3 text-black/40" />
              </label>
              <textarea 
                className="w-full h-24 p-3 bg-white border border-black/10 rounded-xl text-[13px] text-black/80 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none shadow-sm"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What should the AI build while you sleep?"
              />
            </div>
          </div>
        </div>

        <div className="h-14 bg-[#f0f0f0] border-t border-black/5 flex items-center justify-end px-4 gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] font-medium text-black/60 hover:text-black/80 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Power className="w-3.5 h-3.5" /> Activate Protocol
          </button>
        </div>
      </div>
    </div>
  )
}
