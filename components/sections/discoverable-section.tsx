"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Coffee, Building2, Trees, GraduationCap, Rocket } from "lucide-react"

type Place = {
  id: string
  label: string
  icon: React.ReactNode
  title: string
  description: string
  imageLabel: string
  imageBg: string
  accent: string
}

const PLACES: Place[] = [
  {
    id: "cafes",
    label: "Cafés",
    icon: <Coffee className="size-4" aria-hidden="true" />,
    title: "Turn quiet work sessions into useful introductions.",
    description:
      "Share what you are building, stay discoverable nearby, and invite the right person to join your table.",
    imageLabel: "Café workspace",
    imageBg: "var(--brand-warm)",
    accent: "var(--brand-yellow)",
  },
  {
    id: "coworking",
    label: "Coworking",
    icon: <Building2 className="size-4" aria-hidden="true" />,
    title: "Build beside people with matching intent.",
    description:
      "Find founders, designers, operators, and engineers already working in the same professional space.",
    imageLabel: "Coworking space",
    imageBg: "var(--brand-surface)",
    accent: "var(--brand-blue)",
  },
  {
    id: "parks",
    label: "Parks",
    icon: <Trees className="size-4" aria-hidden="true" />,
    title: "Make open-air work more collaborative.",
    description:
      "Show your broad area, current focus, and collaboration signal without exposing exact personal details.",
    imageLabel: "Outdoor workspace",
    imageBg: "#e9f3ed",
    accent: "var(--brand-green)",
  },
  {
    id: "campus",
    label: "Campus spaces",
    icon: <GraduationCap className="size-4" aria-hidden="true" />,
    title: "Connect across disciplines in learning environments.",
    description:
      "Meet researchers, students, and faculty working on problems that align with what you are building.",
    imageLabel: "Campus hub",
    imageBg: "#f0eafa",
    accent: "#7c5cbf",
  },
  {
    id: "startup",
    label: "Startup hubs",
    icon: <Rocket className="size-4" aria-hidden="true" />,
    title: "Find co-founders and early collaborators.",
    description:
      "Signal your stage, domain, and openness so that the right ambitious people find you first.",
    imageLabel: "Startup hub",
    imageBg: "#fbeae8",
    accent: "var(--brand-red)",
  },
]

export function DiscoverableSection() {
  const [activeId, setActiveId] = useState("cafes")
  const active = PLACES.find((p) => p.id === activeId) ?? PLACES[0]

  return (
    <section
      id="places"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="discoverable-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2
            id="discoverable-heading"
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
          >
            Be discoverable where work actually happens
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Every venue type creates a different context for collaboration. TogetLink adapts
            your visibility to match the space you are in.
          </p>
        </div>

        {/* Three-column layout */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: pill selector */}
          <nav
            aria-label="Place types"
            className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-2 lg:w-[200px] lg:flex-col lg:overflow-x-visible lg:pb-0"
          >
            {PLACES.map((place) => {
              const isActive = place.id === activeId
              return (
                <button
                  key={place.id}
                  onClick={() => setActiveId(place.id)}
                  aria-pressed={isActive}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white shadow-[0_4px_14px_-4px_rgba(47,122,231,0.5)]"
                      : "border-border bg-background text-foreground/70 hover:border-border/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={isActive ? "text-white" : "text-foreground/60"}
                    style={!isActive ? { color: place.accent } : undefined}
                  >
                    {place.icon}
                  </span>
                  {place.label}
                </button>
              )
            })}
          </nav>

          {/* Center: visual mockup */}
          <div className="relative mx-auto flex w-full max-w-sm shrink-0 items-center justify-center lg:max-w-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-visual"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full overflow-hidden rounded-3xl border border-border/60 shadow-[0_24px_64px_-16px_rgba(26,29,35,0.16)]"
                style={{ background: active.imageBg }}
              >
                {/* Venue card mockup */}
                <div className="p-6">
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: active.accent }}
                  >
                    {active.icon}
                  </div>
                  <div className="mb-2 h-3 rounded-full bg-foreground/10" style={{ width: "70%" }} />
                  <div className="mb-1.5 h-2.5 rounded-full bg-foreground/8" style={{ width: "90%" }} />
                  <div className="mb-6 h-2.5 rounded-full bg-foreground/8" style={{ width: "60%" }} />

                  {/* Profile chips */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      { name: "Open to introductions", dot: "var(--brand-green)" },
                      { name: "Sharing work in progress", dot: "var(--brand-blue)" },
                      { name: "Window area • {active.label}", dot: "var(--brand-yellow)" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 backdrop-blur-sm"
                      >
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: item.dot }}
                        />
                        <span className="text-xs font-medium text-foreground/80">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom label bar */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ background: `${active.accent}22` }}
                >
                  <span className="text-sm font-semibold" style={{ color: active.accent }}>
                    {active.imageLabel}
                  </span>
                  <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground/70 backdrop-blur-sm">
                    Demo
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: explanation panel */}
          <div className="flex-1 lg:pt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-copy"}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl text-white"
                  style={{ background: active.accent }}
                >
                  {active.icon}
                </div>
                <h3 className="mt-4 text-balance text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {active.description}
                </p>
                <a
                  href="#plans"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: active.accent }}
                >
                  Start discovering nearby
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
