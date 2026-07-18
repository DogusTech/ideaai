"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export type HeroCardProps = {
  children: ReactNode
  /** Absolute position relative to the circle wrapper, as percentages. */
  x: number
  y: number
  /** Floating animation tuning. */
  delay?: number
  duration?: number
  drift?: { x?: number; y?: number; rotate?: number }
  className?: string
}

export function HeroCard({
  children,
  x,
  y,
  delay = 0,
  duration = 6,
  drift = {},
  className = "",
}: HeroCardProps) {
  const reduceMotion = useReducedMotion()
  const { x: dx = 0, y: dy = -12, rotate = 0 } = drift

  return (
    <motion.div
      className="absolute z-20"
      style={{ left: `${x}%`, top: `${y}%`, translateX: "-50%", translateY: "-50%" }}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: delay * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { y: [0, dy, 0], x: [0, dx, 0], rotate: [0, rotate, 0] }
        }
        transition={{
          duration,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className={`flex items-center gap-2.5 rounded-[18px] border border-border/60 bg-card/80 px-3.5 py-2.5 shadow-[0_12px_32px_-16px_rgba(26,29,35,0.35)] backdrop-blur-md ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
