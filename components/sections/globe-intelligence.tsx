"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Users, Handshake, Briefcase, Lock } from "lucide-react"
import { Reveal } from "./reveal"

const COUNTRY_CODES = ["US", "TR", "GB", "BR", "SG", "ZA", "AU", "DE", "JP", "AE"]

const FLOATING_CARDS = [
  { label: "12 builders nearby", icon: Users, color: "text-brand-blue", x: "-6%", y: "8%" },
  { label: "3 open to collaborate", icon: Handshake, color: "text-brand-green", x: "78%", y: "18%" },
  { label: "2 hiring signals", icon: Briefcase, color: "text-brand-yellow", x: "82%", y: "68%" },
  { label: "Privacy-safe preview", icon: Lock, color: "text-brand-red-soft", x: "-8%", y: "74%" },
]

function Globe() {
  const reduceMotion = useReducedMotion()

  // Latitude/longitude grid lines for a stylized, abstract globe.
  const longitudes = [0, 30, 60]
  const latitudes = [20, 40, 60]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* Orbiting country code chips */}
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {COUNTRY_CODES.map((code, i) => {
          const angle = (i / COUNTRY_CODES.length) * Math.PI * 2
          const radius = 47 // percent
          // Round to a fixed precision so server and client render identical
          // strings (avoids float hydration mismatches).
          const left = (50 + radius * Math.cos(angle)).toFixed(3)
          const top = (50 + radius * Math.sin(angle)).toFixed(3)
          return (
            <motion.span
              key={code}
              className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-card text-xs font-bold text-foreground shadow-[0_8px_20px_-12px_rgba(26,29,35,0.4)]"
              style={{ left: `${left}%`, top: `${top}%` }}
              // Counter-rotate so chips stay upright.
              animate={reduceMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 48, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              {code}
            </motion.span>
          )
        })}
      </motion.div>

      {/* Globe body */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[68%] -translate-x-1/2 -translate-y-1/2">
        <div
          className="size-full overflow-hidden rounded-full border border-brand-blue-soft/40"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #ffffff 0%, var(--brand-surface) 55%, #dde7f7 100%)",
            boxShadow: "0 30px 60px -30px rgba(47,122,231,0.45), inset 0 0 40px rgba(141,173,215,0.25)",
          }}
        >
          <motion.svg
            viewBox="0 0 200 200"
            className="size-full"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <circle cx="100" cy="100" r="98" fill="none" stroke="var(--brand-blue-soft)" strokeOpacity="0.35" />
            {/* Longitudes */}
            {longitudes.map((rx) => (
              <ellipse
                key={`lon-${rx}`}
                cx="100"
                cy="100"
                rx={98 - rx * 1.4}
                ry="98"
                fill="none"
                stroke="var(--brand-blue-soft)"
                strokeOpacity="0.4"
              />
            ))}
            {/* Latitudes */}
            {latitudes.map((off) => (
              <line
                key={`lat-${off}`}
                x1="4"
                y1={100 - off}
                x2="196"
                y2={100 - off}
                stroke="var(--brand-blue-soft)"
                strokeOpacity="0.3"
              />
            ))}
            {latitudes.map((off) => (
              <line
                key={`lat2-${off}`}
                x1="4"
                y1={100 + off}
                x2="196"
                y2={100 + off}
                stroke="var(--brand-blue-soft)"
                strokeOpacity="0.3"
              />
            ))}
            <line x1="4" y1="100" x2="196" y2="100" stroke="var(--brand-blue-soft)" strokeOpacity="0.45" />
          </motion.svg>
        </div>

        {/* Pulsing presence dots */}
        {[
          { left: "30%", top: "38%", color: "var(--brand-blue)", d: 0 },
          { left: "62%", top: "30%", color: "var(--brand-green)", d: 0.8 },
          { left: "54%", top: "62%", color: "var(--brand-yellow)", d: 1.6 },
          { left: "38%", top: "70%", color: "var(--brand-blue)", d: 2.2 },
        ].map((dot, i) => (
          <motion.span
            key={i}
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: dot.left, top: dot.top, background: dot.color }}
            animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2.6,
              delay: dot.d,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating context cards */}
      {FLOATING_CARDS.map((card, i) => (
        <motion.div
          key={card.label}
          className="absolute z-10 flex items-center gap-2 rounded-2xl border border-border/70 bg-card/90 px-3 py-2 text-xs font-semibold text-foreground shadow-[0_12px_30px_-16px_rgba(26,29,35,0.4)] backdrop-blur-md"
          style={{ left: card.x, top: card.y }}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <card.icon className={`size-3.5 ${card.color}`} aria-hidden="true" />
          {card.label}
        </motion.div>
      ))}
    </div>
  )
}

export function GlobeIntelligence() {
  return (
    <section
      aria-labelledby="globe-heading"
      className="relative overflow-hidden border-y border-border/60 bg-brand-surface/40"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-28">
        <Reveal className="order-2 text-center lg:order-1 lg:text-left">
          <h2
            id="globe-heading"
            className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
          >
            Know who is there before you walk in.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            TogetLink gives you a privacy-safe view of the professional context inside nearby hubs,
            cafés, coworking spaces, libraries, and startup venues.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#popular-places-heading"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-brand-blue px-7 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,122,231,0.6)] transition-colors hover:bg-[#2569cc]"
            >
              Explore nearby hubs
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#privacy-heading"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-border/70 bg-background px-7 text-base font-semibold text-foreground transition-colors hover:bg-card"
            >
              See how privacy works
            </a>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Globe />
        </div>
      </div>
    </section>
  )
}
