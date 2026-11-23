import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { resolveRequestEntitlement, resolveSessionTier } from "@/lib/server/entitlement"

const NO_STORE = { "Cache-Control": "no-store" }

export async function GET(request: Request) {
  const entitlement = resolveRequestEntitlement(request)

  // Local development: highest tier, unlimited usage, no Stripe dependency.
  if (entitlement.localDev) {
    return NextResponse.json({
      tier: entitlement.tier,
      localDev: true,
      unlimited: entitlement.unlimited,
      source: entitlement.source,
    }, { headers: NO_STORE })
  }

  // Production: the tier is only ever upgraded by a verified Stripe session cookie.
  const tier = resolveSessionTier((await cookies()).get("turaen_plan")?.value)
  return NextResponse.json({ tier, localDev: false, unlimited: false, source: "session" }, { headers: NO_STORE })
}
