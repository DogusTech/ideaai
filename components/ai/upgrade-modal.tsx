"use client"

import React from "react"
import { Check, Sparkles, X } from "lucide-react"
import { hasUnlimitedQuota, nextPlanName, type PlanState } from "@/lib/plan-entitlements"
import { startStripeCheckout } from "@/lib/stripe-billing"

export function UpgradeModal({ isOpen, reason, plan = { tier: "free", devPreview: false }, onClose }: { isOpen: boolean; reason?: string; plan?: PlanState; onClose: () => void }) {
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  if (!isOpen || hasUnlimitedQuota(plan)) return null
  const targetName = nextPlanName(plan)
  const checkout = async () => {
    setBusy(true); setError("")
    try { await startStripeCheckout("pro") } catch (err) { setError(err instanceof Error ? err.message : "Could not start checkout."); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[140] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="upgrade-title" className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#e0e0e0] bg-white shadow-2xl dark:border-[#303030] dark:bg-[#151515]">
        <div className="flex items-start justify-between border-b border-[#ececec] p-5 dark:border-[#2a2a2a]">
          <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-black text-white dark:bg-white dark:text-black"><Sparkles size={18} /></div><div><h2 id="upgrade-title" className="text-base font-semibold tracking-tight">Upgrade to Turaen {targetName}</h2><p className="mt-1 text-xs text-[#777] dark:text-[#aaa]">{reason || "Unlock the full autonomous engineering workspace."}</p></div></div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-[#777] hover:bg-black/5 dark:hover:bg-white/10"><X size={16} /></button>
        </div>
        <div className="space-y-3 p-5 text-sm"><div className="rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-4 dark:border-[#2d2d2d] dark:bg-[#1b1b1b]"><p className="font-medium">{targetName} unlocks</p><p className="mt-2 text-xs leading-5 text-[#666] dark:text-[#aaa]">7B+ local models, BYOK cloud providers, unlimited file context, full Git workflows, and autonomous Night Shift scheduling.</p></div><button type="button" onClick={() => void checkout()} disabled={busy} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-black px-4 text-xs font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-50 dark:bg-white dark:text-black">{busy ? "Opening secure checkout…" : `Upgrade to Turaen ${targetName}`} <Check size={13} /></button>{error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}<button type="button" onClick={onClose} className="h-9 w-full rounded-full text-xs text-[#777] hover:bg-black/5 dark:hover:bg-white/10">Maybe later</button></div>
      </section>
    </div>
  )
}
