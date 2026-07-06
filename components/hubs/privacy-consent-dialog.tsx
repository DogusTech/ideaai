"use client"

import { useId, useState } from "react"
import { Checkbox } from "@base-ui/react/checkbox"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowRight, Check, Lock, ShieldCheck, X } from "lucide-react"

import { cn } from "@/lib/utils"

export type ConsentIntent = "check-in" | "intro"

const COPY: Record<
  ConsentIntent,
  { title: string; description: string; points: string[] }
> = {
  "check-in": {
    title: "Check in with professional intent",
    description:
      "Checking in shares a privacy-safe summary of what you are working on and how you would like to collaborate. Create a free account to continue.",
    points: [
      "Only your broad venue zone is shown — never your exact seat or table.",
      "Your private contact details are never revealed publicly.",
      "You can remove your check-in at any time.",
    ],
  },
  intro: {
    title: "Request a 1:1 professional introduction",
    description:
      "Consent-based introductions let you reach out with professional context. Create a free account to continue.",
    points: [
      "Contact details are shared only after mutual acceptance.",
      "No unexpected contact and no exact-location sharing.",
      "You choose availability windows that work for you.",
    ],
  },
}

export function PrivacyConsentDialog({
  open,
  onOpenChange,
  intent,
  hubName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  intent: ConsentIntent
  hubName?: string
}) {
  const [understood, setUnderstood] = useState(false)
  const checkboxId = useId()
  const copy = COPY[intent]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-border bg-card p-6 shadow-xl outline-none",
            "transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-surface text-brand-blue">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <Dialog.Close
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="Close dialog"
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <Dialog.Title className="mt-4 text-lg font-semibold text-foreground">
            {copy.title}
          </Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {hubName ? `At ${hubName}. ` : ""}
            {copy.description}
          </Dialog.Description>

          <ul className="mt-4 flex flex-col gap-2.5">
            {copy.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Lock
                  className="mt-0.5 size-4 shrink-0 text-brand-green"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <label
            htmlFor={checkboxId}
            className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary/60 p-3.5 text-sm text-foreground/90"
          >
            <Checkbox.Root
              id={checkboxId}
              checked={understood}
              onCheckedChange={(v) => setUnderstood(v === true)}
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-input bg-transparent transition-colors",
                "data-[checked]:border-brand-blue data-[checked]:bg-brand-blue",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              )}
            >
              <Checkbox.Indicator className="text-white">
                <Check className="size-3.5" aria-hidden="true" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span>
              I understand that only my privacy-safe professional summary is shown
              publicly.
            </span>
          </label>

          <div className="mt-5 flex flex-col gap-2.5">
            <a
              href="#"
              aria-disabled={!understood}
              onClick={(e) => {
                if (!understood) e.preventDefault()
              }}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                !understood && "pointer-events-none opacity-50",
              )}
            >
              Create free account
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Sign in
            </a>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
