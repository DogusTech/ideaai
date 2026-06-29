"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export function SupportSection() {
  return (
    <section
      className="relative overflow-hidden py-16 lg:py-24"
      aria-labelledby="support-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-border/60 bg-muted/40 px-8 py-12 text-center sm:px-14 lg:flex-row lg:text-left"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-surface) 0%, #f8f9fb 50%, var(--brand-warm) 100%)",
          }}
        >
          <div>
            <h2
              id="support-heading"
              className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Let us help you start.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0">
              Have a question about TogetLink, early access, partnerships, or professional venue
              onboarding? Reach our team directly.
            </p>
          </div>

          <a
            href="mailto:info@aeternexus.com"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-[var(--brand-blue)] shadow-sm transition-all hover:border-[var(--brand-blue)] hover:shadow-md"
          >
            <Mail className="size-4" aria-hidden="true" />
            info@aeternexus.com
          </a>
        </motion.div>
      </div>
    </section>
  )
}
