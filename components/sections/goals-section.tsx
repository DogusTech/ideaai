import type { ReactNode } from "react"
import { MapPin, Share2, Users, Building2, ArrowRightLeft } from "lucide-react"
import Link from "next/link"

type Goal = {
  icon: ReactNode
  iconBg: string
  iconColor: string
  title: string
  description: string
}

const GOALS: Goal[] = [
  {
    icon: <MapPin className="size-7" aria-hidden="true" />,
    iconBg: "bg-[#eaf0fb]",
    iconColor: "text-[#2f7ae7]",
    title: "Discover nearby professional hubs",
    description:
      "Find curated co-working spaces, local tech meetups, and professional networking communities that are active near you right now. We map out the best physical locations in cities like San Francisco and Istanbul where real builders gather.",
  },
  {
    icon: <Share2 className="size-7" aria-hidden="true" />,
    iconBg: "bg-[#fef3d8]",
    iconColor: "text-[#f19c16]",
    title: "Share professional intent",
    description:
      "Signal exactly what you are working on and what kind of connections would move your startup forward. Whether you need a technical co-founder or a UX designer, your profile broadcasts your immediate needs to the right people.",
  },
  {
    icon: <Users className="size-7" aria-hidden="true" />,
    iconBg: "bg-[#fde8e7]",
    iconColor: "text-[#ea402d]",
    title: "Meet with complete consent",
    description:
      "Professional networking shouldn't be spammy. Connections happen only when both sides explicitly choose to engage — no cold outreach, no unexpected contact. We prioritize your privacy while maximizing serendipitous meetings.",
  },
  {
    icon: <Building2 className="size-7" aria-hidden="true" />,
    iconBg: "bg-[#e8f5ee]",
    iconColor: "text-[#55a170]",
    title: "Build together in real places",
    description:
      "Move beyond the digital screen and collaborate in the shared physical spaces that make long-term partnerships possible. We believe the best companies are built when founders and builders share the same room.",
  },
  {
    icon: <ArrowRightLeft className="size-7" aria-hidden="true" />,
    iconBg: "bg-[#edf3f9]",
    iconColor: "text-[#8dadd7]",
    title: "Turn solo work into trusted introductions",
    description:
      "Let your verified professional presence do the heavy lifting. By simply checking into a hub, our platform works to make the right people aware of your skills, turning isolated work sessions into valuable network expansions.",
  },
]

export function GoalsSection() {
  return (
    <section aria-labelledby="goals-heading" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2
            id="goals-heading"
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Reach all your professional goals in one place
          </h2>
          <div className="mt-6">
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Icon grid — first row of 3, second row of 2 centered */}
        <div className="mt-16 flex flex-col gap-12">
          {/* Row 1: 3 columns */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {GOALS.slice(0, 3).map((goal) => (
              <GoalCard key={goal.title} goal={goal} />
            ))}
          </div>
          {/* Row 2: 2 columns centered */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:px-[16.66%]">
            {GOALS.slice(3).map((goal) => (
              <GoalCard key={goal.title} goal={goal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  return (
    <article className="flex flex-col items-center text-center">
      <span
        className={`flex size-[72px] items-center justify-center rounded-2xl ${goal.iconBg} ${goal.iconColor}`}
      >
        {goal.icon}
      </span>
      <h3 className="mt-5 text-base font-semibold leading-snug text-foreground">
        {goal.title}
      </h3>
      <p className="mt-2 max-w-[260px] text-pretty text-sm leading-relaxed text-muted-foreground">
        {goal.description}
      </p>
    </article>
  )
}
