"use client"

import { motion } from "framer-motion"
import { MapPin, Lightbulb, Shield, Users, ArrowUpRight, ArrowRight } from "lucide-react"

type Goal = {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  description: string
}

const GOALS: Goal[] = [
  {
    icon: <MapPin className="size-5" aria-hidden="true" />,
    iconBg: "var(--brand-surface)",
    iconColor: "var(--brand-blue)",
    title: "Discover nearby hubs",
    description:
      "Find cafés, coworking spaces, libraries, and community venues where professionals already gather.",
  },
  {
    icon: <Lightbulb className="size-5" aria-hidden="true" />,
    iconBg: "var(--brand-warm)",
    iconColor: "var(--brand-yellow)",
    title: "Share professional intent",
    description:
      "Tell others what you are working on without exposing private personal details.",
  },
  {
    icon: <Shield className="size-5" aria-hidden="true" />,
    iconBg: "#e9f3ed",
    iconColor: "var(--brand-green)",
    title: "Start safer introductions",
    description:
      "Use broad location, profile context, and consent-first signals before meeting.",
  },
  {
    icon: <Users className="size-5" aria-hidden="true" />,
    iconBg: "var(--brand-surface)",
    iconColor: "var(--brand-blue)",
    title: "Learn by working together",
    description:
      "Find people solving similar problems and turn solo work into shared progress.",
  },
  {
    icon: <ArrowUpRight className="size-5" aria-hidden="true" />,
    iconBg: "#fbeae8",
    iconColor: "var(--brand-red)",
    title: "Move from online to real life",
    description:
      "Bridge digital identity with meaningful face-to-face professional moments.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function GoalsSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="goals-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Heading */}
        <div className="mx-auto mb-4 max-w-3xl text-center">
          <h2
            id="goals-heading"
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
          >
            Everything you need to build with nearby people
          </h2>
        </div>

        {/* Learn more button */}
        <div className="mb-16 flex justify-center">
          <a
            href="#plans"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-all hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
          >
            Learn more
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        {/* Goals grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((goal, i) => (
            <motion.article
              key={goal.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-6 transition-shadow hover:shadow-[0_12px_32px_-8px_rgba(26,29,35,0.12)]"
            >
              {/* Subtle hover bg */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                style={{ background: goal.iconBg }}
              />

              <div
                className="mb-4 flex size-11 items-center justify-center rounded-2xl"
                style={{ background: goal.iconBg }}
              >
                <span style={{ color: goal.iconColor }}>{goal.icon}</span>
              </div>

              <h3 className="mb-2 text-base font-semibold text-foreground">{goal.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{goal.description}</p>
            </motion.article>
          ))}

          {/* CTA card filling the 6th slot on lg */}
          <motion.div
            custom={GOALS.length}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col items-start justify-between rounded-2xl bg-[var(--brand-blue)] p-6 text-white"
          >
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-80">
                Ready to start?
              </p>
              <p className="text-lg font-bold leading-snug">
                Join professionals discovering nearby collaboration every day.
              </p>
            </div>
            <a
              href="#plans"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-blue)] transition-colors hover:bg-[var(--brand-surface)]"
            >
              Get started free
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
