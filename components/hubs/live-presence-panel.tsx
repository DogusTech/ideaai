import { Shield, MapPin } from "lucide-react"
import type { HubCheckIn } from "@/lib/places/types"
import { cn } from "@/lib/utils"

const DEFAULT_DEMO: HubCheckIn[] = [
  {
    displayName: "Emre K.",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80",
    role: "Founder",
    broadArea: "Main coworking floor",
    workIntent: "Working on Firebase schema design",
    collaborationInterest: "Open to discussing backend architecture",
    visualClue: "Navy hoodie, silver laptop",
    availability: "Available until 18:00",
    isLive: false,
  },
  {
    displayName: "Selin A.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    role: "Product Designer",
    broadArea: "Quiet desk zone",
    workIntent: "Reviewing onboarding flows for a SaaS product",
    collaborationInterest: "Happy to chat about UX research methods",
    availability: "Available until 17:30",
    isLive: false,
  },
  {
    displayName: "Marcus L.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    role: "Software Engineer",
    broadArea: "Garden seating",
    workIntent: "Open to discussing Next.js architecture",
    collaborationInterest: "Interested in infrastructure conversations",
    availability: "Available until 18:00",
    isLive: false,
  },
  {
    displayName: "Lale B.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    role: "Student Founder",
    broadArea: "Main coworking floor",
    workIntent: "Preparing a pitch deck",
    collaborationInterest: "Looking for feedback on startup ideas",
    availability: "Available until 15:00",
    isLive: false,
  },
]

interface LivePresencePanelProps {
  presence?: HubCheckIn[]
}

export function LivePresencePanel({ presence }: LivePresencePanelProps) {
  const items = presence && presence.length > 0 ? presence : DEFAULT_DEMO

  return (
    <section aria-labelledby="presence-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="presence-heading"
          className="text-base font-semibold text-foreground"
        >
          Who&apos;s here now
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          Demo samples — not a live feed
        </span>
      </div>

      {/* Privacy notice */}
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-border/50 bg-brand-surface/50 p-3">
        <Shield
          className="mt-0.5 size-4 shrink-0 text-brand-blue"
          aria-hidden="true"
        />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Privacy-safe.</span>{" "}
          Exact personal location, seat, or table is never shown publicly. Only broad
          venue areas and professional intent are shared, with user consent.
        </p>
      </div>

      <ul
        aria-label="Professional presence samples"
        className="flex flex-col gap-3"
      >
        {items.map((person, i) => (
          <li
            key={i}
            className="rounded-xl border border-border/50 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.displayName}
                    className="size-9 shrink-0 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-surface text-sm font-semibold text-brand-blue shadow-sm"
                  >
                    {person.displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {person.displayName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {person.role}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  person.isLive
                    ? "bg-brand-green/15 text-[#2d7050]"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {person.isLive ? "Live check-in" : "Demo sample"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {person.broadArea}
              </span>
              <span className="text-[11px] text-muted-foreground/50">·</span>
              <span className="text-[11px] text-muted-foreground">
                {person.availability}
              </span>
            </div>

            <p className="mt-2 text-xs text-foreground/80">{person.workIntent}</p>
            <p className="mt-1 text-xs text-brand-blue">
              {person.collaborationInterest}
            </p>

            {person.visualClue && (
              <p className="mt-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5 text-[11px] text-muted-foreground">
                Optional visual clue (user-approved):{" "}
                <span className="font-medium">{person.visualClue}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
