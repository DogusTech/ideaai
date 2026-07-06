"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Shield, X } from "lucide-react"

interface PrivacyConsentDialogProps {
  open: boolean
  onClose: () => void
  /** "checkin" | "intro" — changes the dialog copy slightly */
  intent?: "checkin" | "intro"
}

export function PrivacyConsentDialog({
  open,
  onClose,
  intent = "checkin",
}: PrivacyConsentDialogProps) {
  const [checked, setChecked] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Focus management
  useEffect(() => {
    if (open) {
      setChecked(false)
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    }
  }, [open])

  // Trap focus and close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const isCheckin = intent === "checkin"

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-dialog-title"
        aria-describedby="privacy-dialog-desc"
        className="fixed inset-x-4 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:pb-6"
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-surface">
            <Shield className="size-6 text-brand-blue" aria-hidden="true" />
          </span>
        </div>

        <h2
          id="privacy-dialog-title"
          className="mt-4 text-center text-lg font-bold tracking-tight text-foreground"
        >
          {isCheckin ? "Check in to this hub" : "Request a 1:1 introduction"}
        </h2>

        <p
          id="privacy-dialog-desc"
          className="mt-2 text-center text-sm text-muted-foreground"
        >
          {isCheckin
            ? "Share your professional intent with nearby professionals. Your exact location, seat, or contact details are never shown publicly."
            : "Connect with a professional in this hub. Contact details are only revealed after mutual acceptance."}
        </p>

        {/* Value bullets */}
        <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-muted/50 p-4">
          <li className="text-sm text-foreground/80">
            <span className="font-semibold">Privacy-first.</span> Only your broad venue area and professional summary are visible.
          </li>
          <li className="text-sm text-foreground/80">
            <span className="font-semibold">Consent-based.</span> You control what you share and when.
          </li>
          <li className="text-sm text-foreground/80">
            <span className="font-semibold">No spam.</span> Nobody can contact you without your acceptance.
          </li>
        </ul>

        {/* Consent checkbox */}
        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded border-border accent-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
            aria-describedby="consent-label"
          />
          <span
            id="consent-label"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            I understand that only my privacy-safe professional summary is shown publicly.
            My exact location is never shared.
          </span>
        </label>

        {/* CTAs */}
        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            href="/register?intent=checkin"
            onClick={onClose}
            aria-disabled={!checked}
            tabIndex={checked ? undefined : -1}
            className={`flex items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 ${
              checked
                ? "bg-brand-blue hover:bg-[#2569cc]"
                : "cursor-not-allowed bg-brand-blue/40"
            }`}
          >
            Create free account
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-center rounded-xl border border-border/70 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  )
}
