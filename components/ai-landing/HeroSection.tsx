"use client"

import React, { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion"
import { Sparkles, Code, Cpu, LineChart, Globe } from "lucide-react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse Parallax Setup
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for mouse movement
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 })
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    // Normalize coordinates from -1 to 1 based on center of container
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  // Typewriter effect text
  const text = "IdeaAI ile büyüme stratejinizi baştan yaratın."
  const words = text.split(" ")

  const typewriterContainer: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] py-20 px-4"
    >
      {/* Parallax Background Elements */}
      <ParallaxIcon icon={<Sparkles size={32} />} xOffset={50} yOffset={30} color="text-amber-400" springX={smoothX} springY={smoothY} top="20%" left="15%" />
      <ParallaxIcon icon={<Code size={40} />} xOffset={-60} yOffset={40} color="text-blue-500" springX={smoothX} springY={smoothY} top="25%" right="15%" />
      <ParallaxIcon icon={<Cpu size={28} />} xOffset={40} yOffset={-50} color="text-purple-500" springX={smoothX} springY={smoothY} bottom="25%" left="20%" />
      <ParallaxIcon icon={<LineChart size={48} />} xOffset={-40} yOffset={-60} color="text-emerald-500" springX={smoothX} springY={smoothY} bottom="20%" right="20%" />
      <ParallaxIcon icon={<Globe size={36} />} xOffset={80} yOffset={20} color="text-indigo-400" springX={smoothX} springY={smoothY} top="50%" left="8%" />

      {/* Main Content */}
      <div className="z-10 text-center max-w-4xl mx-auto space-y-8 mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span>TogetLink IdeaAI 2.0</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#171717] leading-tight"
          variants={typewriterContainer}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-3"
              variants={child}
            >
              {word === "IdeaAI" ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xl md:text-2xl text-[#525252] max-w-2xl mx-auto mt-6"
        >
          Tek üyelik ile tüm şirketinize hizmet veren, dinamik ve akıllı yapay zeka asistanı.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-4 bg-[#171717] text-white rounded-[12px] font-medium text-[16px] hover:bg-[#262626] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            IdeaAI'yi Keşfet
          </button>
          <button className="px-8 py-4 bg-white text-[#171717] border border-[#e5e5e5] rounded-[12px] font-medium text-[16px] hover:bg-[#f5f5f5] transition-all shadow-sm">
            Nasıl Çalışır?
          </button>
        </motion.div>
      </div>
    </section>
  )
}

function ParallaxIcon({ 
  icon, 
  xOffset, 
  yOffset, 
  color, 
  springX, 
  springY,
  top,
  bottom,
  left,
  right
}: { 
  icon: React.ReactNode, 
  xOffset: number, 
  yOffset: number, 
  color: string,
  springX: any,
  springY: any,
  top?: string,
  bottom?: string,
  left?: string,
  right?: string
}) {
  const x = useTransform(springX, [-1, 1], [-xOffset, xOffset])
  const y = useTransform(springY, [-1, 1], [-yOffset, yOffset])

  return (
    <motion.div
      style={{
        x,
        y,
        position: 'absolute',
        top,
        bottom,
        left,
        right,
      }}
      className={`hidden md:flex opacity-50 ${color} blur-[1px] hover:blur-none transition-all duration-300`}
    >
      {icon}
    </motion.div>
  )
}
