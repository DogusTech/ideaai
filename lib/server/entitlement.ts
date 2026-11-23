import {
  HIGHEST_PLAN_TIER,
  isDevelopmentRuntime,
  isLocalhostHostname,
  isLoopbackAddress,
  isProductionRuntime,
  normalizeHostname,
  type PlanTier,
} from "@/lib/plan-entitlements"

export type EntitlementSource = "local-dev" | "session"

export type ResolvedEntitlement = {
  tier: PlanTier
  localDev: boolean
  unlimited: boolean
  source: EntitlementSource
  hostname: string | null
}

function firstHeaderValue(value: string | null): string | null {
  if (!value) return null
  const first = value.split(",")[0]?.trim()
  return first || null
}

function requestUrlHostname(request: Request): string | null {
  try { return new URL(request.url).hostname || null } catch { return null }
}

/** Normalized hostname of a request, preferring the parsed URL over the Host header. */
export function requestHostname(request: Request): string | null {
  const hostname = normalizeHostname(requestUrlHostname(request) || firstHeaderValue(request.headers.get("host")))
  return hostname || null
}

/**
 * A request belongs to local development when the app itself runs through
 * `next dev` (NODE_ENV=development) or when the request targets a loopback host.
 *
 * Production safety: a non-loopback request never inherits the local entitlement,
 * and a proxy-forwarded public domain can never be relabelled as localhost.
 */
export function isLocalDevRequest(request: Request): boolean {
  if (isDevelopmentRuntime()) return true

  const urlHost = requestUrlHostname(request)
  const headerHost = firstHeaderValue(request.headers.get("host"))
  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"))
  const forwardedFor = firstHeaderValue(request.headers.get("x-forwarded-for"))

  if (!isLocalhostHostname(urlHost) && !isLocalhostHostname(headerHost)) return false

  if (forwardedHost && !isLocalhostHostname(forwardedHost)) return false
  if (isProductionRuntime() && forwardedFor && !isLoopbackAddress(forwardedFor)) return false

  return true
}

/**
 * Resolves the request's entitlement. Local development receives the highest
 * tier with unlimited quotas; every other request starts from the free tier
 * and is upgraded only by a verified Stripe session cookie.
 */
export function resolveRequestEntitlement(request: Request): ResolvedEntitlement {
  const hostname = requestHostname(request)
  if (isLocalDevRequest(request)) {
    return { tier: HIGHEST_PLAN_TIER, localDev: true, unlimited: true, source: "local-dev", hostname }
  }
  return { tier: "free", localDev: false, unlimited: false, source: "session", hostname }
}

/** Tier stored by the verified Stripe confirmation route. */
export function resolveSessionTier(cookieValue: string | undefined): PlanTier {
  return cookieValue === HIGHEST_PLAN_TIER ? HIGHEST_PLAN_TIER : "free"
}
