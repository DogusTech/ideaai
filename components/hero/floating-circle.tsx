"use client"

import { motion, useReducedMotion } from "framer-motion"
import { MapPin, Sparkles, Coffee, Rocket, Palette, Code2 } from "lucide-react"
import { HeroCard } from "./hero-card"

type Node = {
  id: string
  x: number
  y: number
  color: string
  initials: string
}

const NODES: Node[] = [
  { id: "a", x: 50, y: 50, color: "var(--brand-blue)", initials: "TL" },
  { id: "b", x: 30, y: 32, color: "var(--brand-green)", initials: "AY" },
  { id: "c", x: 72, y: 34, color: "var(--brand-yellow)", initials: "JM" },
  { id: "d", x: 28, y: 70, color: "var(--brand-red)", initials: "SK" },
  { id: "e", x: 70, y: 70, color: "var(--brand-blue-soft)", initials: "RC" },
]

const LINKS: [string, string][] = [
  ["a", "b"],
  ["a", "c"],
  ["a", "d"],
  ["a", "e"],
  ["b", "c"],
  ["d", "e"],
]

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!
}

export function FloatingCircle() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Soft radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, var(--brand-surface) 0%, rgba(234,240,251,0.4) 55%, transparent 75%)",
        }}
      />

      {/* Concentric rings */}
      <div className="absolute inset-0 rounded-full border border-border/50" />
      <div className="absolute inset-[10%] rounded-full border border-border/40" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-border/40" />

      {/* Central network illustration */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[18%] z-10 h-auto w-[64%]"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        {LINKS.map(([from, to], i) => {
          const a = nodeById(from)
          const b = nodeById(to)
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--brand-blue-soft)"
              strokeWidth={0.6}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1, delay: 0.4 + i * 0.12 }}
            />
          )
        })}
        {NODES.map((n, i) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.id === "a" ? 5 : 3.2}
            fill={n.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              reduceMotion
                ? { scale: 1, opacity: 1 }
                : { scale: [1, 1.12, 1], opacity: 1 }
            }
            transition={{
              scale: {
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.6 + i * 0.1,
              },
              opacity: { duration: 0.5, delay: 0.6 + i * 0.1 },
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>

      {/* Floating UI cards */}
      <HeroCard x={14} y={22} delay={0.2} duration={7} drift={{ y: -14, rotate: -1.5 }}>
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-surface text-brand-blue">
          <MapPin className="size-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-foreground">Nearby Hub</p>
          <p className="text-[11px] text-muted-foreground">2.3 km away</p>
        </div>
      </HeroCard>

      <HeroCard x={88} y={20} delay={0.6} duration={6.4} drift={{ y: -10, x: 6, rotate: 1.5 }}>
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-warm text-brand-yellow">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-foreground">AI Match</p>
          <p className="text-[11px] text-muted-foreground">98% fit</p>
        </div>
      </HeroCard>

      <HeroCard x={6} y={58} delay={1} duration={7.8} drift={{ y: -12, x: -5 }}>
        <span className="flex size-8 items-center justify-center rounded-full bg-[#e9f3ed] text-brand-green">
          <Code2 className="size-4" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold text-foreground">Developer</p>
      </HeroCard>

      <HeroCard x={92} y={56} delay={0.4} duration={6.8} drift={{ y: -13, rotate: 2 }}>
        <span className="flex size-8 items-center justify-center rounded-full bg-[#fbeae8] text-brand-red">
          <Palette className="size-4" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold text-foreground">Designer</p>
      </HeroCard>

      <HeroCard x={24} y={90} delay={1.4} duration={7.2} drift={{ y: -10, x: 4 }}>
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-surface text-brand-blue">
          <Rocket className="size-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-foreground">Startup</p>
          <p className="text-[11px] text-muted-foreground">Hiring now</p>
        </div>
      </HeroCard>

      <HeroCard x={80} y={90} delay={0.9} duration={6.6} drift={{ y: -12, rotate: -2 }}>
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-warm text-brand-yellow">
          <Coffee className="size-4" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold text-foreground">Coffee Chat</p>
      </HeroCard>

      <HeroCard x={62} y={8} delay={1.2} duration={7.5} drift={{ y: -8, x: -4 }}>
        <span className="size-2 rounded-full bg-brand-green" aria-hidden="true" />
        <p className="text-xs font-semibold text-foreground">Available Now</p>
      </HeroCard>
    </div>
  )
}
