import Link from "next/link"
import { Check, Shield } from "lucide-react"

const FEATURES = [
  "Priority visibility in selected hubs",
  "Meeting request with professional context",
  "Availability windows",
  "Contact details shown only after mutual acceptance",
]

export function ProMeetingCard() {
  return (
    <aside
      aria-labelledby="pro-meeting-heading"
      className="rounded-2xl border border-brand-blue/20 bg-brand-surface/60 p-6"
    >
      <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
        Pro
      </span>
      <h2
        id="pro-meeting-heading"
        className="mt-3 text-base font-bold tracking-tight text-foreground"
      >
        Request a focused 1:1 introduction
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        For Pro members who want a consent-based professional conversation.
      </p>

      <ul
        aria-label="Pro features"
        className="mt-4 flex flex-col gap-2"
      >
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check
              className="mt-0.5 size-4 shrink-0 text-brand-green"
              aria-hidden="true"
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/register?intent=pro"
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
      >
        Explore Pro
      </Link>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="size-3.5 shrink-0 text-brand-green" aria-hidden="true" />
        No unexpected contact. No exact location sharing.
      </p>
    </aside>
  )
}
