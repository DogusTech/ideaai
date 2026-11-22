"use client"

import { ExternalLink, Sparkles, X } from "lucide-react"
import { STRIPE_PAYMENT_LINK_URL } from "@/lib/plan-entitlements"

export function UpgradeModal({ isOpen, reason, onClose }: { isOpen: boolean; reason?: string; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[140] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="upgrade-title" className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#e0e0e0] bg-white shadow-2xl dark:border-[#303030] dark:bg-[#151515]">
        <div className="flex items-start justify-between border-b border-[#ececec] p-5 dark:border-[#2a2a2a]">
          <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-black text-white dark:bg-white dark:text-black"><Sparkles size={18} /></div><div><h2 id="upgrade-title" className="text-base font-semibold tracking-tight">Upgrade to Turaen Pro</h2><p className="mt-1 text-xs text-[#777] dark:text-[#aaa]">{reason || "Unlock the full autonomous engineering workspace."}</p></div></div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-[#777] hover:bg-black/5 dark:hover:bg-white/10"><X size={16} /></button>
        </div>
        <div className="space-y-3 p-5 text-sm"><div className="rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-4 dark:border-[#2d2d2d] dark:bg-[#1b1b1b]"><p className="font-medium">Pro unlocks</p><p className="mt-2 text-xs leading-5 text-[#666] dark:text-[#aaa]">7B+ local models, BYOK cloud providers, unlimited file context, full Git workflows, and autonomous Night Shift scheduling.</p></div><a href={STRIPE_PAYMENT_LINK_URL} target="_blank" rel="noreferrer" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-black px-4 text-xs font-medium text-white transition-transform hover:scale-[1.01] dark:bg-white dark:text-black">Continue to secure checkout <ExternalLink size={13} /></a><button type="button" onClick={onClose} className="h-9 w-full rounded-full text-xs text-[#777] hover:bg-black/5 dark:hover:bg-white/10">Maybe later</button></div>
      </section>
    </div>
  )
}
