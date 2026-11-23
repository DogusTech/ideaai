import { NextResponse } from "next/server"
import { resolveRequestEntitlement } from "@/lib/server/entitlement"

const PRICE_BY_TIER = {
  pro: process.env.STRIPE_PRO_PRICE_ID || process.env.STRIPE_PRICE_ID || "",
} as const

const PRO_MONTHLY_UNIT_AMOUNT_CENTS = Number(process.env.STRIPE_PRO_MONTHLY_AMOUNT_CENTS || "2000")

export async function POST(request: Request) {
  // Local development already holds the highest tier: never open Stripe Checkout.
  const entitlement = resolveRequestEntitlement(request)
  if (entitlement.localDev) {
    return NextResponse.json({
      localDev: true,
      tier: entitlement.tier,
      unlimited: entitlement.unlimited,
      url: null,
      message: "Local development entitlement is active. Stripe checkout is not required on localhost.",
    }, { headers: { "Cache-Control": "no-store" } })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY
  if (!secretKey) {
    console.error("[billing/checkout] Missing Stripe secret key: STRIPE_SECRET_KEY or STRIPE_API_KEY")
    return NextResponse.json({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY (or STRIPE_API_KEY) on the server." }, { status: 503 })
  }

  const body = await request.json().catch(() => ({})) as { tier?: keyof typeof PRICE_BY_TIER }
  const tier = body.tier === "pro" ? "pro" : "pro"
  const price = PRICE_BY_TIER[tier]
  if (!Number.isInteger(PRO_MONTHLY_UNIT_AMOUNT_CENTS) || PRO_MONTHLY_UNIT_AMOUNT_CENTS <= 0) {
    return NextResponse.json({ error: "STRIPE_PRO_MONTHLY_AMOUNT_CENTS must be a positive integer." }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://turaen.com"
  const form = new URLSearchParams({
    mode: "subscription",
    "line_items[0][quantity]": "1",
    success_url: `${appUrl}/mac-test?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/mac-test?upgrade=cancelled`,
    allow_promotion_codes: "true",
  })
  if (price) {
    form.set("line_items[0][price]", price)
  } else {
    form.set("line_items[0][price_data][currency]", "usd")
    form.set("line_items[0][price_data][unit_amount]", String(PRO_MONTHLY_UNIT_AMOUNT_CENTS))
    form.set("line_items[0][price_data][recurring][interval]", "month")
    form.set("line_items[0][price_data][product_data][name]", "Turaen Pro")
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
    cache: "no-store",
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.url) return NextResponse.json({ error: payload.error?.message || "Stripe could not create a Checkout Session." }, { status: 502 })
  return NextResponse.json({ url: payload.url, sessionId: payload.id, tier })
}
