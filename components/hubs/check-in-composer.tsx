"use client"

import { useId, useState } from "react"
import { UserCheck } from "lucide-react"

import type { TogetlinkHub } from "@/lib/places/types"
import { InfoLabel } from "@/components/ui/info-label"
import { MessageBar } from "@/components/ui/message-bar"

/**
 * Public check-in composer.
 *
 * Public visitors can compose but not submit — attempting to check in opens the
 * consent/signup dialog. All inputs are treated as untrusted content: values
 * stay in React state and are never injected via dangerouslySetInnerHTML.
 */
export function CheckInComposer({
  hub,
  onRequestCheckIn,
}: {
  hub: TogetlinkHub
  onRequestCheckIn: () => void
}) {
  const [area, setArea] = useState(hub.broadAreas[0] ?? "")
  const [intent, setIntent] = useState("")
  const areaId = useId()
  const intentId = useId()

  const fieldClass =
    "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:outline-none"

  return (
    <section
      aria-labelledby="checkin-heading"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-surface text-brand-blue">
          <UserCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="checkin-heading" className="text-lg font-semibold text-foreground">
            Check in here
          </h2>
          <p className="text-sm text-muted-foreground">Share what you are working on.</p>
        </div>
      </div>

      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          onRequestCheckIn()
        }}
      >
        <div className="flex flex-col gap-1.5">
          <InfoLabel
            label="Broad area"
            hint="A general zone only — your exact seat or table is never shared."
            htmlFor={areaId}
          />
          <select
            id={areaId}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={fieldClass}
          >
            {hub.broadAreas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <InfoLabel
            label="Professional intent"
            hint="Shown publicly as your privacy-safe summary. Keep it professional."
            htmlFor={intentId}
          />
          <textarea
            id={intentId}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="e.g. Reviewing onboarding flows — open to UX feedback"
            className={fieldClass}
          />
          <span className="text-xs text-muted-foreground">{intent.length}/280</span>
        </div>

        <MessageBar kind="privacy">
          Only your broad area and this summary are shown publicly. Contact details
          stay private until you both agree to connect.
        </MessageBar>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <UserCheck className="size-4" aria-hidden="true" />
          Check in with professional intent
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Free account required. Takes less than a minute.
        </p>
      </form>
    </section>
  )
}
