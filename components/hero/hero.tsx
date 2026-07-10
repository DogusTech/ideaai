"use client"

import { motion } from "framer-motion"
import { AnnouncementBar } from "./announcement-bar"
import { AnimatedHeadline } from "./animated-headline"
import { CTAButtons } from "./cta-buttons"
import { FloatingCircle } from "./floating-circle"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Premium surface background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 75% 20%, var(--brand-surface) 0%, rgba(234,240,251,0.35) 40%, transparent 70%), radial-gradient(900px 500px at 10% 90%, rgba(248,239,215,0.5) 0%, transparent 65%)",
        }}
      />

      <div className="mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-center px-6 pb-16 pt-28 lg:px-10 lg:pt-32">
        <AnnouncementBar />

        <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          {/* Left: copy */}
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <AnimatedHeadline />

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-[560px] text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              togetlink connects you with builders, designers, and founders
              right around the corner — so your next great collaboration starts
              with a real conversation.
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8"
            >
              <CTAButtons />
            </motion.div>

            <motion.p
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-5 text-sm text-muted-foreground"
            >
              Free to join · No credit card · 12,000+ builders nearby
            </motion.p>
          </div>

          {/* Right: showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <FloatingCircle />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
