"use client"

import React, { useRef } from "react"
import { motion, Variants, useScroll, useTransform } from "framer-motion"
import { 
  Command, 
  Wand2, 
  AppWindow, 
  Folder, 
  CornerDownLeft, 
  Braces, 
  Code, 
  GitBranch, 
  Sparkles, 
  RefreshCcw, 
  PenLine, 
  LayoutGrid, 
  ArrowUp, 
  Terminal 
} from "lucide-react"

export function FloatingWavyIcons() {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Track scroll progress for this specific section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Translate the icons horizontally based on scroll
  // The icons will move from right (150px) to left (-150px) as we scroll past them
  const xTransform = useTransform(scrollYProgress, [0, 1], [150, -150])

  // Icon configuration with specific base Y offsets to create the "wave" shape
  const icons = [
    { id: 1, Icon: Command, baseOffsetY: 0 },
    { id: 2, Icon: Wand2, baseOffsetY: 10 },
    { id: 3, Icon: AppWindow, baseOffsetY: 25 },
    { id: 4, Icon: Folder, baseOffsetY: 40 },
    { id: 5, Icon: CornerDownLeft, baseOffsetY: 50 },
    { id: 6, Icon: Braces, baseOffsetY: 55 },
    { id: 7, Icon: Code, baseOffsetY: 50 },
    { id: 8, Icon: GitBranch, baseOffsetY: 40 },
    { id: 9, Icon: Sparkles, baseOffsetY: 25 },
    { id: 10, Icon: RefreshCcw, baseOffsetY: 10 },
    { id: 11, Icon: PenLine, baseOffsetY: 0 },
    { id: 12, Icon: LayoutGrid, baseOffsetY: -10 },
    { id: 13, Icon: ArrowUp, baseOffsetY: -25 },
    { id: 14, Icon: Terminal, baseOffsetY: -40 },
  ]

  return (
    <section ref={sectionRef} className="w-full bg-white py-32 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 w-full flex items-center justify-center min-h-[200px]">
        <motion.div 
          style={{ x: xTransform }}
          className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-full overflow-visible pb-10 px-10"
        >
          {icons.map((item, index) => {
            // Floating animation up and down around the baseOffsetY
            const floatVariants: Variants = {
              animate: {
                y: [item.baseOffsetY - 15, item.baseOffsetY + 15, item.baseOffsetY - 15],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  // Delay based on index to create a wave propagation effect
                  delay: index * 0.15,
                }
              }
            }

            return (
              <motion.div
                key={item.id}
                variants={floatVariants}
                animate="animate"
                whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
                className="shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f9fafb] border border-[#f0f0f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#e5e5e5] transition-shadow bg-white/50 backdrop-blur-sm"
              >
                <item.Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#171717] stroke-[1.5]" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
