"use client"

import { useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { MapPin, Briefcase, Eye, MessageSquare } from "lucide-react"

type Profile = {
  name: string
  role: string
  venue: string
  area: string
  workingOn: string
  recognize: string
  invitation: string
  accent: string
  initials: string
}

const PROFILES: Profile[] = [
  {
    name: "Maya",
    role: "Product Designer",
    venue: "Northside Coworking",
    area: "Window desk area",
    workingOn: "Redesigning an onboarding flow for a health app.",
    recognize: "Blue notebook, white hoodie.",
    invitation: "Join me if you want to review the first user journey.",
    accent: "var(--brand-blue)",
    initials: "M",
  },
  {
    name: "Emir",
    role: "Frontend Engineer",
    venue: "Founders Café",
    area: "Quiet corner",
    workingOn: "Debugging Firebase security rules for a Next.js project.",
    recognize: "Black laptop stand, green cap.",
    invitation: "Come help me solve this edge case together.",
    accent: "var(--brand-green)",
    initials: "E",
  },
  {
    name: "Lina",
    role: "Startup Founder",
    venue: "City Library Innovation Room",
    area: "Shared table zone",
    workingOn: "Validating a community-led hiring concept.",
    recognize: "Beige jacket, tablet open.",
    invitation: "Open to meeting builders interested in real-world networking.",
    accent: "var(--brand-yellow)",
    initials: "L",
  },
  {
    name: "Jonas",
    role: "Growth Strategist",
    venue: "Campus Hub",
    area: "Collaboration wall",
    workingOn: "Mapping launch channels for an early SaaS product.",
    recognize: "Grey shirt, yellow sticky notes.",
    invitation: "Let's compare go-to-market ideas.",
    accent: "var(--brand-red)",
    initials: "J",
  },
  {
    name: "Priya",
    role: "UX Researcher",
    venue: "Bloom Café",
    area: "Back lounge",
    workingOn: "Synthesising interviews for a fintech onboarding study.",
    recognize: "Purple headphones, printed notes.",
    invitation: "Happy to share research methodology if you are working in fintech.",
    accent: "#7c5cbf",
    initials: "P",
  },
  {
    name: "Olu",
    role: "Data Engineer",
    venue: "Westside Coworking",
    area: "Standing desk row",
    workingOn: "Optimising a real-time analytics pipeline.",
    recognize: "Mechanical keyboard, dark hoodie.",
    invitation: "Open to pairing on data infra questions.",
    accent: "var(--brand-blue-soft)",
    initials: "O",
  },
  {
    name: "Selin",
    role: "Climate Tech Founder",
    venue: "Greenspace Studio",
    area: "Garden terrace",
    workingOn: "Prototyping a carbon-tracking dashboard for SMEs.",
    recognize: "Tote bag with plant patches.",
    invitation: "Reach out if you care about climate and product.",
    accent: "var(--brand-green)",
    initials: "S",
  },
  {
    name: "Kai",
    role: "Indie Developer",
    venue: "City Library",
    area: "Quiet study pods",
    workingOn: "Shipping v1 of a local event discovery app.",
    recognize: "Minimal desk setup, noise-cancelling headphones.",
    invitation: "Would love feedback on the onboarding screen.",
    accent: "var(--brand-yellow)",
    initials: "K",
  },
]

// Duplicate for seamless loop
const DUPLICATED = [...PROFILES, ...PROFILES]

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <article
      aria-label={`Demo profile: ${profile.name}, ${profile.role}`}
      className="relative flex w-[300px] shrink-0 flex-col rounded-2xl border border-border/60 bg-background p-5 shadow-[0_4px_16px_-8px_rgba(26,29,35,0.12)]"
    >
      {/* Demo label */}
      <span className="absolute right-4 top-4 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Demo profile
      </span>

      {/* Avatar + name */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: profile.accent }}
          aria-hidden="true"
        >
          {profile.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{profile.role}</p>
        </div>
      </div>

      {/* Venue + area */}
      <div className="mb-3 flex items-start gap-2 text-xs text-muted-foreground">
        <MapPin className="mt-0.5 size-3.5 shrink-0 text-[var(--brand-blue)]" aria-hidden="true" />
        <span>
          {profile.venue} · {profile.area}
        </span>
      </div>

      {/* Working on */}
      <div className="mb-3 flex items-start gap-2">
        <Briefcase className="mt-0.5 size-3.5 shrink-0 text-[var(--brand-blue)]" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-foreground/80">{profile.workingOn}</p>
      </div>

      {/* Recognize */}
      <div className="mb-3 flex items-start gap-2">
        <Eye className="mt-0.5 size-3.5 shrink-0 text-[var(--brand-green)]" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-foreground/70">{profile.recognize}</p>
      </div>

      {/* Invitation */}
      <div
        className="mt-auto flex items-start gap-2 rounded-xl px-3 py-2.5"
        style={{ background: `${profile.accent}14` }}
      >
        <MessageSquare
          className="mt-0.5 size-3.5 shrink-0"
          style={{ color: profile.accent }}
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed font-medium" style={{ color: profile.accent }}>
          {profile.invitation}
        </p>
      </div>
    </article>
  )
}

export function MarqueeSection() {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="marquee-heading"
    >
      {/* Soft blue bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--brand-surface) 12%, var(--brand-surface) 88%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* White heading container */}
        <div className="mx-auto mb-10 max-w-4xl rounded-3xl bg-background p-8 text-center shadow-[0_0_0_1px_var(--border),0_12px_32px_-8px_rgba(26,29,35,0.08)] sm:p-10">
          <h2
            id="marquee-heading"
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
          >
            See what people are building nearby
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Demo profiles show how TogetLink helps people signal intent, context, and availability
            before starting a conversation.
          </p>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            These are illustrative demo profiles only — not live user data.
          </p>
        </div>
      </div>

      {/* Marquee track */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        aria-label="Demo profiles carousel"
        role="region"
      >
        {/* Edge fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 sm:w-32"
          style={{
            background: "linear-gradient(to right, var(--brand-surface), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 sm:w-32"
          style={{
            background: "linear-gradient(to left, var(--brand-surface), transparent)",
          }}
        />

        <motion.div
          className="flex gap-4 py-4"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
          style={{ width: "max-content" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.animationPlayState = "paused"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.animationPlayState = "running"
          }}
        >
          {DUPLICATED.map((profile, i) => (
            <ProfileCard key={`${profile.name}-${i}`} profile={profile} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
