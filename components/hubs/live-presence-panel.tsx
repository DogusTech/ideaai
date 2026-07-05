import { Clock, Crown, MapPin, Sparkles } from "lucide-react"

import type { PresenceSample } from "@/lib/places/types"
import { Badge } from "@/components/ui/badge"
import { MessageBar } from "@/components/ui/message-bar"

function PresenceCard({ person }: { person: PresenceSample }) {
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 items-center justify-center rounded-full bg-brand-surface text-sm font-semibold text-brand-blue"
            aria-hidden="true"
          >
            {person.displayName.slice(0, 2)}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{person.displayName}</p>
            <p className="text-xs text-muted-foreground">{person.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {person.state === "live" ? (
            <Badge variant="live">
              <Sparkles className="size-3" aria-hidden="true" />
              Live check-in
            </Badge>
          ) : (
            <Badge variant="demo">Demo sample</Badge>
          )}
          {person.isPro && (
            <Badge variant="pro">
              <Crown className="size-3" aria-hidden="true" />
              Pro
            </Badge>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground/85">{person.workIntent}</p>
      <p className="mt-1 text-sm text-muted-foreground">{person.collaborationInterest}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          {person.broadArea}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {person.availabilityWindow}
        </span>
      </div>

      {person.recognitionHint && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Recognize me:</span>{" "}
          {person.recognitionHint}
        </p>
      )}
    </li>
  )
}

export function LivePresencePanel({ presence }: { presence: PresenceSample[] }) {
  const hasLive = presence.some((p) => p.state === "live")

  return (
    <section aria-labelledby="presence-heading" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 id="presence-heading" className="text-lg font-semibold text-foreground">
          Who is here now
        </h2>
        <Badge variant={hasLive ? "live" : "demo"}>
          {hasLive ? "Live check-ins" : "Demo samples"}
        </Badge>
      </div>

      <div className="mt-3">
        <MessageBar kind="privacy">
          Broad venue areas only — exact seats, tables, and private contact details
          are never shown. These are demo samples, not a live user feed.
        </MessageBar>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {presence.map((person) => (
          <PresenceCard key={person.id} person={person} />
        ))}
      </ul>
    </section>
  )
}
