"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState<"bug" | "feature" | "general">("feature")
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackText.trim()) return

    try {
      const stored = JSON.parse(localStorage.getItem("ideaai_local_feedback") || "[]")
      stored.push({
        id: Date.now(),
        category,
        content: feedbackText.trim(),
        timestamp: new Date().toISOString()
      })
      localStorage.setItem("ideaai_local_feedback", JSON.stringify(stored))
    } catch {
      // ignore
    }

    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFeedbackText("")
      onClose()
    }, 1200)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.16 }}
          role="dialog"
          aria-modal="true"
          className="w-full max-w-lg overflow-hidden rounded-[24px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#111111] text-[#000000] dark:text-[#ffffff] shadow-[0px_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0px_4px_32px_rgba(0,0,0,0.4)] p-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0] dark:border-[#222222]">
            <div>
              <h2 className="headline-md tracking-tight font-medium">Give Feedback</h2>
              <p className="mt-1 body-md text-[#666666] dark:text-[#999999]">
                Help us refine IdeaAI developer workspace standard.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-[#666666] hover:bg-[#f1f1f1] dark:text-[#999999] dark:hover:bg-[#1f1f1f] transition-colors"
            >
              ✕
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check size={24} />
              </div>
              <h3 className="headline-md text-lg font-medium">Thank you for your feedback!</h3>
              <p className="body-md text-[#666666] dark:text-[#999999]">Saved locally to your workspace environment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="flex gap-2">
                {(["feature", "bug", "general"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`h-[32px] px-3.5 rounded-full text-xs font-medium capitalize border transition-colors ${
                      category === cat
                        ? "bg-[#000000] text-[#ffffff] border-[#000000] dark:bg-[#ffffff] dark:text-[#111111] dark:border-[#ffffff]"
                        : "bg-transparent text-[#666666] dark:text-[#999999] border-[#e0e0e0] dark:border-[#333333] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {cat === "feature" ? "Idea / Feature" : cat === "bug" ? "Issue / Bug" : "General"}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What would make your IdeaAI workflow faster or more intuitive?"
                  rows={4}
                  className="w-full resize-none rounded-[16px] border border-[#e0e0e0] dark:border-[#333333] bg-[#fcfcfc] dark:bg-[#161616] p-4 text-sm text-[#000000] dark:text-[#ffffff] placeholder:text-[#999999] outline-none focus:border-[#000000] dark:focus:border-[#ffffff]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-[36px] px-5 rounded-[40px] text-xs font-medium text-[#666666] dark:text-[#999999] hover:bg-[#f1f1f1] dark:hover:bg-[#1f1f1f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!feedbackText.trim()}
                  className="h-[36px] px-6 rounded-[40px] bg-[#000000] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#111111] text-button-token font-medium transition-transform active:scale-95 disabled:opacity-30"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
