"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CTAButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <motion.a
        href="/register"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-brand-blue px-7 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,122,231,0.6)] transition-colors hover:bg-[#2569cc]"
      >
        Start building free
        <ArrowRight className="size-4" aria-hidden="true" />
      </motion.a>

      <motion.a
        href="/explore"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#dfe5ef] bg-background px-7 text-base font-semibold text-[#2b2b2b] transition-colors hover:bg-[#f8f9fb]"
      >
        See how it works
      </motion.a>
    </div>
  )
}
