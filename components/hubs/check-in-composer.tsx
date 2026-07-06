"use client"

import { useState } from "react"
import { PrivacyConsentDialog } from "./privacy-consent-dialog"
import { MapPin, Shield } from "lucide-react"
import type { TogetlinkHub } from "@/lib/places/types"

interface CheckInComposerProps {
  hub: TogetlinkHub
}

export function CheckInComposer({ hub }: CheckInComposerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <section
        aria-labelledby="checkin-heading"
        className="rounded-2xl border border-border/60 bg-white p-5"
      >
        <h2
          id="checkin-heading"
          className="text-sm font-semibold text-foreground"
        >
          Check in to {hub.name}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Let nearby professionals know you&apos;re here and what you&apos;re working on.
        </p>

        {/* Broad area preview */}
        <div className="mt-3 flex flex-wrap gap-2">
          {hub.broadAreas.map((area) => (
            <span
              key={area}
              className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
            >
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              {area}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
        >
          Check in
        </button>

        <p className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
          <Shield className="size-3 shrink-0 text-brand-green" aria-hidden="true" />
          Exact seat or table is never shared publicly.
        </p>
      </section>

      <PrivacyConsentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        intent="checkin"
      />
    </>
  )
}
