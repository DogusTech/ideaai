"use client"

import React from "react"
import { motion, Variants } from "framer-motion"
import { Sparkles, Terminal, ChevronDown, Folder, Network } from "lucide-react"

export function FeatureSplitSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <section className="w-full bg-white py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24">
        
        {/* Section 1: IdeaAI 2.0 */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-40"
        >
          {/* Left Text */}
          <div className="flex-1 space-y-6">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#171717] tracking-tight">
              IdeaAI 2.0
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-[#525252] leading-relaxed max-w-lg">
              Your command center to manage multiple local agents in parallel. Group conversations into Projects, operate across multiple workspaces, and automate routine tasks with scheduled messages.
            </motion.p>
          </div>

          {/* Right UI Image/Card */}
          <motion.div variants={itemVariants} className="flex-1 w-full relative">
            <div className="w-full aspect-square md:aspect-[4/3] rounded-[40px] bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8 shadow-2xl ring-1 ring-black/5 relative overflow-hidden flex flex-col pt-16">
              {/* Colorful gradient blurs behind the mock UI */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"></div>
              
              {/* Mock UI Card */}
              <div className="relative z-10 w-full flex-1 bg-[#fafafa] rounded-t-3xl shadow-xl border border-[#e5e5e5] p-6 flex flex-col gap-6">
                
                {/* Mock Workspace selector */}
                <div className="flex items-center gap-2 text-[#525252] font-medium text-sm">
                  <Folder className="w-4 h-4" />
                  <span>new-project</span>
                  <ChevronDown className="w-3 h-3 text-[#a3a3a3]" />
                </div>

                {/* Mock Prompt Box */}
                <div className="w-full bg-white rounded-2xl border border-[#e5e5e5] p-3 shadow-sm flex flex-col gap-3">
                  <div className="text-[#a3a3a3] text-sm px-1">Ask anything, @ to mention, / for actions</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium bg-[#f5f5f5] text-[#525252] px-2 py-1 rounded-md">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      Gemini 3.5 Flash
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#171717] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Mock Sub-menu */}
                <div className="w-48 bg-white rounded-xl shadow-lg border border-[#e5e5e5] p-1 flex flex-col -mt-2 ml-4">
                  <div className="px-3 py-2 text-sm text-[#171717] hover:bg-[#f5f5f5] rounded-lg cursor-pointer flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#737373]" /> Local
                  </div>
                  <div className="px-3 py-2 text-sm text-[#171717] hover:bg-[#f5f5f5] rounded-lg cursor-pointer flex items-center gap-2">
                    <Network className="w-4 h-4 text-[#737373]" /> New Worktree
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section 2: Antigravity CLI (Reversed) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24"
        >
           {/* Left UI Image/Card */}
           <motion.div variants={itemVariants} className="flex-1 w-full relative">
            <div className="w-full aspect-square md:aspect-[4/3] rounded-[40px] bg-[#0a0a0a] p-1 shadow-2xl relative overflow-hidden flex items-center justify-center">
              {/* Background Stars/Space */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-black to-black"></div>
              
              {/* Mock Terminal Window */}
              <div className="relative z-10 w-[85%] bg-[#1a1b26] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
                <div className="h-8 bg-[#1a1b26] border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed text-[#a9b1d6]">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 font-bold text-xl mb-4">
                    IdeaAI CLI
                  </div>
                  <div>Welcome to IdeaAI CLI!</div>
                  <br/>
                  <div className="text-[#9ece6a]">&gt; you: add a greeting function</div>
                  <br/>
                  <div className="text-[#7aa2f7]">IdeaAI: Here's the change:</div>
                  <div className="mt-2 bg-black/30 p-3 rounded-md">
                    <div><span className="text-[#bb9af7]">import</span> "fmt"</div>
                    <div className="mt-2 text-[#f7768e] bg-[#f7768e]/10 px-1">- func main() {'{'}</div>
                    <div className="text-[#9ece6a] bg-[#9ece6a]/10 px-1">+ func greet(name string) {'{'}</div>
                    <div className="text-[#9ece6a] bg-[#9ece6a]/10 px-1">+     fmt.Printf("Hello, %s!\n", name)</div>
                    <div className="text-[#9ece6a] bg-[#9ece6a]/10 px-1">  {'}'}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Text */}
          <div className="flex-1 space-y-6">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#171717] tracking-tight">
              IdeaAI CLI
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-[#525252] leading-relaxed max-w-lg">
              The lightweight, fast, terminal-first surface to work with IdeaAI agents. Run autonomous coding agents, execute shell commands directly, and manage background subagents all from your keyboard.
            </motion.p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
