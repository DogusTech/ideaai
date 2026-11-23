"use client"

import { isLocalDevEntitlementActive, runtimeHostname } from "@/lib/plan-entitlements"

export type CheckoutTier = "pro"

export type CheckoutResult = { localDev: boolean }

export async function startStripeCheckout(tier: CheckoutTier = "pro"): Promise<CheckoutResult> {
  // Local development already runs on the highest tier; never block on Stripe.
  if (isLocalDevEntitlementActive(runtimeHostname())) return { localDev: true }

  const response = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier }),
  })
  const payload = await response.json().catch(() => ({}))
  if (payload?.localDev === true) return { localDev: true }
  if (!response.ok || !payload.url) throw new Error(payload.error || "Could not start Stripe Checkout.")
  window.location.assign(payload.url)
  return { localDev: false }
}
