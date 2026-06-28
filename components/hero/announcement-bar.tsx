"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

export function AnnouncementBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center"
    >
      <a
        href="#"
        className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-brand-surface/60 px-4 py-1.5 text-sm text-foreground/80 backdrop-blur transition-colors hover:bg-brand-surface"
      >
        <Sparkles className="size-4 text-brand-blue" aria-hidden="true" />
        <span className="font-medium">
          Introducing nearby AI matching for builders
        </span>
        <ArrowRight
          className="size-3.5 text-brand-blue transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </motion.div>
  )
}
