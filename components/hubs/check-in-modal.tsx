"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import { TextField, TextAreaField } from "@/components/ui/field"

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  hubId: string
  hubName: string
  onSuccess: () => void
}

export function CheckInModal({ isOpen, onClose, hubId, hubName, onSuccess }: CheckInModalProps) {
  const [locationStatus, setLocationStatus] = useState("")
  const [workingOn, setWorkingOn] = useState("")
  const [appearance, setAppearance] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Marketing Mode: Auto-type effect
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || !isOpen) return

    setLocationStatus("")
    setWorkingOn("")
    setAppearance("")
    
    const locText = "Main cafe area, by the big window"
    const workText = "Building my SaaS startup and open to brainstorm!"
    const appText = "Black hoodie, gray Macbook"
    
    let i = 0, j = 0, k = 0
    let typeLoc: any, typeWork: any, typeApp: any
    let autoSubmitTimer: any

    const startTyping = () => {
      typeLoc = setInterval(() => {
        if (i <= locText.length) { setLocationStatus(locText.slice(0, i)); i++ }
        else {
          clearInterval(typeLoc)
          typeWork = setInterval(() => {
            if (j <= workText.length) { setWorkingOn(workText.slice(0, j)); j++ }
            else {
              clearInterval(typeWork)
              typeApp = setInterval(() => {
                if (k <= appText.length) { setAppearance(appText.slice(0, k)); k++ }
                else {
                  clearInterval(typeApp)
                  // Auto submit after short pause
                  autoSubmitTimer = setTimeout(() => {
                    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
                    handleSubmit(fakeEvent)
                  }, 800)
                }
              }, 40) // fast typing
            }
          }, 30)
        }
      }, 40)
    }

    const initialDelay = setTimeout(startTyping, 500)

    return () => {
      clearTimeout(initialDelay)
      clearTimeout(autoSubmitTimer)
      clearInterval(typeLoc)
      clearInterval(typeWork)
      clearInterval(typeApp)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use current state OR the final string if in auto-type mode
    const finalLoc = process.env.NODE_ENV === "development" ? "Main cafe area, by the big window" : locationStatus
    const finalWork = process.env.NODE_ENV === "development" ? "Building my SaaS startup and open to brainstorm!" : workingOn
    const finalApp = process.env.NODE_ENV === "development" ? "Black hoodie, gray Macbook" : appearance

    if (!finalLoc.trim() || !finalWork.trim() || !finalApp.trim()) {
      setError("Please fill out all fields so others can find you.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    if (process.env.NODE_ENV === "development") {
      // Fake API request delay
      setTimeout(() => {
        onSuccess()
        onClose()
        setIsSubmitting(false)
      }, 1500)
      return
    }

    try {
      await apiFetch("/api/checkins", {
        method: "POST",
        body: JSON.stringify({
          hubId,
          locationStatus: finalLoc.trim(),
          workingOn: finalWork.trim(),
          appearance: finalApp.trim(),
        }),
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to check in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0e0e0] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Join Hub</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-brand-blue">
              <MapPin className="size-3.5" />
              {hubName}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            
            {/* Field 1 */}
            <TextField
              label="Where are you located in the hub?"
              name="locationStatus"
              value={locationStatus}
              onChange={(e) => setLocationStatus(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. 2nd floor, by the window, main cafe area"
              required
            />

            {/* Field 2 */}
            <TextAreaField
              label="What are you currently working on / doing?"
              name="workingOn"
              value={workingOn}
              onChange={(e) => setWorkingOn(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Building a SaaS startup, reading a book, open to chat..."
              required
            />

            {/* Field 3 */}
            <TextField
              label="How do you look?"
              name="appearance"
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Wearing a black t-shirt, using a Mac with headphones"
              required
            />

            {error && (
              <p className="rounded-lg bg-brand-red-soft/10 p-3 text-sm font-medium text-brand-red-soft">
                {error}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-md border border-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-blue hover:bg-muted transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
