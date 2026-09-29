"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Monitor, Sparkles } from "lucide-react"
import { AntigravityCanvas } from "./AntigravityCanvas"

export function AntigravityHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll logic for the Video Card scaling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  })

  // Scale the video card from 0.85 to 1 as we scroll down
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.7], [100, 0])

  const titleLine1 = "Experience liftoff with the next-gen".split(" ");
  const titleLine2 = "agent platform".split(" ");

  const [typingState, setTypingState] = React.useState<"flash" | "hidden" | "typing">("flash");

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setTypingState("hidden"), 150);
    const t2 = setTimeout(() => setTypingState("typing"), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, []);

  const renderLine = (words: string[], startIndex: number) => {
    return words.map((word, idx) => (
      <React.Fragment key={idx}>
        <motion.span 
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: typingState === "flash" ? 1 : (typingState === "hidden" ? 0 : 1),
            y: typingState === "typing" ? 0 : (typingState === "hidden" ? 10 : 0)
          }}
          transition={
            typingState === "typing" 
              ? { duration: 0.15, ease: "easeOut", delay: (startIndex + idx) * 0.04 } 
              : { duration: 0 }
          }
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      </React.Fragment>
    ))
  }

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Premium, majestic physics for mouse parallax (Not too heavy, not too fast)
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 0.8 })
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 0.8 })
  
  // Subtle parallax for content (not the canvas — canvas handles its own mouse)
  const contentX = useTransform(springX, [-1, 1], [8, -8])
  const contentY = useTransform(springY, [-1, 1], [8, -8])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    // Normalize -1 to 1
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white flex flex-col items-center pt-32 pb-48 overflow-hidden min-h-[140vh]"
    >
      {/* ═══════════════════════════════════════════════
          HTML5 Canvas Particle System (Antigravity Engine)
          Replaces the old DOM-based particle rendering.
          Canvas handles its own mouse tracking for particle repulsion.
          ═══════════════════════════════════════════════ */}
      <AntigravityCanvas />

      <div className="z-10 flex flex-col items-center text-center px-4 w-full max-w-[1400px] mx-auto">
        
        {/* Logo area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={mounted ? { x: contentX, y: contentY } : {}}
          className="flex items-center gap-2 mb-10 text-[26px] tracking-tight text-gray-800"
        >
          {/* TogetLink IdeaAI 'A' Logo SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L4 28H10L16 16L22 28H28L16 4Z" fill="url(#paint1_linear)"/>
            <defs>
              <linearGradient id="paint1_linear" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1a73e8"/>
                <stop offset="1" stopColor="#34a853"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="font-[Google Sans]">
            TogetLink <span className="font-[Google Sans Flex] font-normal">IdeaAI</span>
          </span>
        </motion.div>

        {/* Huge Title */}
        <motion.h1 
          style={mounted ? { x: contentX, y: contentY } : {}}
          className="landing-main mb-14 text-center"
        >
          Experience liftoff with the next-gen
          <br />
          agent platform
        </motion.h1>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24"
        >
          <a href="https://github.com/DogusTech/togetlink-ui/releases/download/v0.1.5/TogetLink.IdeaAI.Setup.0.1.5.exe" className="button button-primary gap-2">
            <Monitor className="w-5 h-5" strokeWidth={2.5} />
            Download for Windows
          </a>
          <button className="button button-secondary text-gray-900 border-gray-200 shadow-sm bg-white hover:bg-gray-50 font-normal">
            Explore use cases
          </button>
        </motion.div>
      </div>

      {/* Scroll-scaling Video Card */}
      <motion.div 
        style={{ scale, opacity, y }}
        className="w-full max-w-6xl mx-auto px-4 z-20 sticky top-32"
      >
        <div className="w-full aspect-[16/9] bg-black rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5 relative flex items-center justify-center">
          {/* Mock Video UI / Inner Content */}
          <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col">
            {/* Fake macOS Window Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Mock Editor Area */}
            <div className="flex-1 p-8 text-white/50 font-mono text-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 text-blue-500 mx-auto opacity-50" />
                <p>Interactive Video / Demo Area</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  )
}
