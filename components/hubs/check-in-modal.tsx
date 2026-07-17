"use client"

import { useState } from "react"
import { X, MapPin, Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api/client"
import { cn } from "@/lib/utils"

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

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!locationStatus.trim() || !workingOn.trim() || !appearance.trim()) {
      setError("Please fill out all fields so others can find you.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await apiFetch("/api/checkins", {
        method: "POST",
        body: JSON.stringify({
          hubId,
          locationStatus: locationStatus.trim(),
          workingOn: workingOn.trim(),
          appearance: appearance.trim(),
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
          <div className="space-y-5">
            
            {/* Field 1 */}
            <div className="space-y-1.5">
              <label htmlFor="locationStatus" className="text-sm font-semibold text-foreground">
                Where are you located in the hub?
              </label>
              <input
                id="locationStatus"
                type="text"
                placeholder="e.g. 2nd floor, by the window, main cafe area"
                value={locationStatus}
                onChange={(e) => setLocationStatus(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#e0e0e0] bg-[#fdfdfd] px-4 py-2.5 text-sm transition-colors focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
              />
            </div>

            {/* Field 2 */}
            <div className="space-y-1.5">
              <label htmlFor="workingOn" className="text-sm font-semibold text-foreground">
                What are you currently working on / doing?
              </label>
              <textarea
                id="workingOn"
                rows={3}
                placeholder="e.g. Building a SaaS startup, reading a book, open to chat..."
                value={workingOn}
                onChange={(e) => setWorkingOn(e.target.value)}
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-[#e0e0e0] bg-[#fdfdfd] px-4 py-2.5 text-sm transition-colors focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
              />
            </div>

            {/* Field 3 */}
            <div className="space-y-1.5">
              <label htmlFor="appearance" className="text-sm font-semibold text-foreground">
                How do you look?
              </label>
              <input
                id="appearance"
                type="text"
                placeholder="e.g. Wearing a black t-shirt, using a Mac with headphones"
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#e0e0e0] bg-[#fdfdfd] px-4 py-2.5 text-sm transition-colors focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-brand-red-soft/10 p-3 text-sm font-medium text-brand-red-soft">
                {error}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Check In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
