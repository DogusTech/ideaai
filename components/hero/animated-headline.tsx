"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Phrase = {
  text: string
  color: string
}

const PHRASES: Phrase[] = [
  { text: "Build together.", color: "var(--brand-blue)" },
  { text: "Meet nearby.", color: "var(--brand-yellow)" },
  { text: "Find collaborators.", color: "var(--brand-green)" },
  { text: "Ship faster.", color: "var(--brand-red)" },
]

export function AnimatedHeadline() {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const current = PHRASES[index]

  return (
    <h1 className="max-w-[650px] text-balance text-5xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
      <span className="block">Where local builders</span>
      <span className="relative block h-[1.05em] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={current.text}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: "0.4em", filter: "blur(8px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: "-0.4em", filter: "blur(8px)" }
            }
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="absolute inset-0 block"
            style={{ color: current.color }}
          >
            {current.text}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  )
}
