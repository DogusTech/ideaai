import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { resolveRequestEntitlement } from "@/lib/server/entitlement"

export async function GET(request: Request) {
  // Local development never needs a Stripe round trip; the local entitlement is
  // already the highest tier. Production hosts still verify every session.
  const entitlement = resolveRequestEntitlement(request)
  if (entitlement.localDev) {
    return NextResponse.json({
      success: true,
      tier: entitlement.tier,
      localDev: true,
      unlimited: entitlement.unlimited,
    }, { headers: { "Cache-Control": "no-store" } })
  }

  const sessionId = new URL(request.url).searchParams.get("session_id")
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY
  if (!secretKey) {
    console.error("[billing/confirm] Missing Stripe secret key: STRIPE_SECRET_KEY or STRIPE_API_KEY")
    return NextResponse.json({ success: false, error: "Stripe is not configured. Set STRIPE_SECRET_KEY (or STRIPE_API_KEY) on the server." }, { status: 503 })
  }
  if (!sessionId) return NextResponse.json({ success: false, error: "Missing Stripe session_id." }, { status: 400 })

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=subscription`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: "no-store",
  })
  const session = await response.json().catch(() => ({}))
  const subscriptionStatus = typeof session.subscription === "object" ? session.subscription?.status : undefined
  const verified = response.ok && session.mode === "subscription" && session.status === "complete" && ["paid", "no_payment_required"].includes(session.payment_status) && ["active", "trialing"].includes(subscriptionStatus || "active")
  if (!verified) return NextResponse.json({ success: false, error: session.error?.message || "Stripe payment could not be verified." }, { status: 402 })

  const cookieStore = await cookies()
  cookieStore.set("turaen_plan", "pro", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" })
  return NextResponse.json({ success: true, tier: "pro" })
}
