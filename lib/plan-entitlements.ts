export type PlanTier = "free" | "pro"

export type PlanEntitlementSource = "free" | "stripe" | "dev-preview" | "local-dev"

export type PlanState = {
  tier: PlanTier
  devPreview: boolean
  /**
   * True when the running app is a local development session (localhost).
   * Local entitlements always resolve to the highest tier with unlimited quotas.
   */
  localEntitlement?: boolean
  /** True when the current entitlement bypasses every usage quota. */
  unlimited?: boolean
  updatedAt?: string
}

export const STRIPE_PAYMENT_LINK_URL = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL || "https://buy.stripe.com/your-turaen-pro-link"
export const FREE_MODEL_MAX_BILLION = 3
export const FREE_FILE_LIMIT = 2
export const FREE_NIGHT_SHIFT_TASK_LIMIT = 1

/** Highest tier in PLAN_HIERARCHY. Local development always resolves to this tier. */
export const HIGHEST_PLAN_TIER: PlanTier = "pro"
/** Sentinel for an entitlement that never consumes a quota. */
export const UNLIMITED_QUOTA = Number.POSITIVE_INFINITY

const STORAGE_KEY = "turaen_plan_state"

export const DEFAULT_PLAN_STATE: PlanState = { tier: "free", devPreview: false, localEntitlement: false, unlimited: false }

export const PLAN_HIERARCHY: Array<{ tier: PlanTier; name: string }> = [
  { tier: "free", name: "Free" },
  { tier: "pro", name: "Pro" },
]

export function highestPlanName(): string {
  return PLAN_HIERARCHY.find((item) => item.tier === HIGHEST_PLAN_TIER)?.name || "Pro"
}

export function nextPlanName(plan: PlanState): string {
  const index = PLAN_HIERARCHY.findIndex((item) => item.tier === plan.tier)
  return PLAN_HIERARCHY[Math.min(index + 1, PLAN_HIERARCHY.length - 1)]?.name || "Pro"
}

const LOOPBACK_HOSTNAMES = new Set(["localhost", "::1", "0:0:0:0:0:0:0:1", "::ffff:127.0.0.1"])

/** Lowercases a host or authority and strips the port / IPv6 brackets. */
export function normalizeHostname(host: string | null | undefined): string {
  const value = (host || "").trim().toLowerCase()
  if (!value) return ""
  if (value.startsWith("[")) {
    const end = value.indexOf("]")
    return (end > 0 ? value.slice(1, end) : value.slice(1)).replace(/\.$/, "")
  }
  if (LOOPBACK_HOSTNAMES.has(value)) return value
  return value.replace(/:\d+$/, "").replace(/\.$/, "")
}

/** True for localhost, *.localhost and the IPv4/IPv6 loopback ranges. */
export function isLocalhostHostname(host: string | null | undefined): boolean {
  const hostname = normalizeHostname(host)
  if (!hostname) return false
  return hostname === "localhost"
    || hostname.endsWith(".localhost")
    || hostname.startsWith("127.")
    || LOOPBACK_HOSTNAMES.has(hostname)
}

/** True when a forwarding address points back at the local machine. */
export function isLoopbackAddress(address: string | null | undefined): boolean {
  const value = normalizeHostname(address)
  if (!value) return false
  return value === "localhost"
    || value.startsWith("127.")
    || value === "::1"
    || value === "0:0:0:0:0:0:0:1"
    || value === "::ffff:127.0.0.1"
}

function nodeEnvName(): string | undefined {
  try { return process.env.NODE_ENV } catch { return undefined }
}

export function isDevelopmentRuntime(): boolean {
  return nodeEnvName() === "development"
}

export function isProductionRuntime(): boolean {
  return nodeEnvName() === "production"
}

/** Hostname of the current browser session, if any. */
export function runtimeHostname(): string | null {
  if (typeof window === "undefined") return null
  return window.location?.hostname || null
}

/**
 * Local development entitlement detection used by the client:
 * `next dev` (NODE_ENV=development) or any loopback host.
 * Never activates on a non-local production host.
 */
export function isLocalDevEntitlementActive(hostname?: string | null): boolean {
  if (isDevelopmentRuntime()) return true
  const host = hostname === undefined ? runtimeHostname() : hostname
  return isLocalhostHostname(host)
}

/** The entitlement the app should use while running locally: highest tier, unlimited usage. */
export function localDevPlanState(): PlanState {
  return {
    tier: HIGHEST_PLAN_TIER,
    devPreview: false,
    localEntitlement: true,
    unlimited: true,
    updatedAt: new Date().toISOString(),
  }
}

function normalizePlanState(value: unknown): PlanState {
  const input = value && typeof value === "object" ? value as Partial<PlanState> : {}
  const localEntitlement = Boolean(input.localEntitlement)
  const unlimited = localEntitlement || Boolean(input.unlimited)
  return {
    tier: localEntitlement || unlimited || input.tier === HIGHEST_PLAN_TIER ? HIGHEST_PLAN_TIER : "free",
    devPreview: Boolean(input.devPreview),
    localEntitlement,
    unlimited,
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : undefined,
  }
}

function electronApi(): { invoke: (channel: string, ...args: unknown[]) => Promise<any> } | null {
  if (typeof window === "undefined") return null
  return (window as Window & { electronAPI?: { invoke: (channel: string, ...args: unknown[]) => Promise<any> } }).electronAPI || null
}

export async function getPlanState(): Promise<PlanState> {
  // Local development always wins: the highest tier is granted by the runtime.
  if (isLocalDevEntitlementActive(runtimeHostname())) return localDevPlanState()

  try {
    const result = await electronApi()?.invoke("subscription:get")
    if (result?.success) return normalizePlanState(result.state)
  } catch { /* browser fallback */ }
  if (typeof window === "undefined") return DEFAULT_PLAN_STATE
  try {
    const response = await fetch("/api/billing/status", { cache: "no-store" })
    const remote = await response.json() as { tier?: string; localDev?: boolean; unlimited?: boolean }
    if (response.ok && remote?.localDev === true) return localDevPlanState()
    if (response.ok && remote?.tier === HIGHEST_PLAN_TIER) {
      return normalizePlanState({ tier: HIGHEST_PLAN_TIER, devPreview: false, unlimited: Boolean(remote.unlimited) })
    }
  } catch { /* Continue with browser-local dev preview state. */ }
  try { return normalizePlanState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")) } catch { return DEFAULT_PLAN_STATE }
}

export async function savePlanState(next: Partial<PlanState>): Promise<PlanState> {
  const current = await getPlanState()
  // The local development entitlement is supplied by the runtime, never by user state.
  if (current.localEntitlement) return current
  const state = normalizePlanState({ ...current, ...next, localEntitlement: false, unlimited: false, updatedAt: new Date().toISOString() })
  try { await electronApi()?.invoke("subscription:set", state) } catch { /* browser fallback */ }
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return state
}

export function isPro(plan: PlanState): boolean {
  return plan.tier === HIGHEST_PLAN_TIER || plan.devPreview || Boolean(plan.localEntitlement)
}

/** True when the entitlement never consumes a usage quota (local dev / unlimited plans). */
export function hasUnlimitedQuota(plan: PlanState): boolean {
  return Boolean(plan.localEntitlement) || Boolean(plan.unlimited)
}

/** Human-readable plan label, marking the local development entitlement. */
export function planDisplayName(plan: PlanState): string {
  if (!isPro(plan)) return "Free"
  return hasUnlimitedQuota(plan) ? `${highestPlanName()} · Local` : highestPlanName()
}

export function modelParameterCount(model: string): number | null {
  const match = model.match(/(?:^|[-_:])([0-9]+(?:\.[0-9]+)?)b(?:$|[-_:])/i) || model.match(/([0-9]+(?:\.[0-9]+)?)b/i)
  return match ? Number(match[1]) : null
}

export function requiresProForModel(provider: string, model: string, plan: PlanState): boolean {
  if (hasUnlimitedQuota(plan) || isPro(plan)) return false
  if (provider === "BYOK" || provider === "Cloud" || provider === "Account") return true
  const parameters = modelParameterCount(model)
  return parameters === null ? false : parameters > FREE_MODEL_MAX_BILLION
}

export function canAttachFiles(count: number, plan: PlanState): boolean {
  return hasUnlimitedQuota(plan) || isPro(plan) || count <= FREE_FILE_LIMIT
}

export function requiresProForSlashCommand(command: string, plan: PlanState): boolean {
  return !hasUnlimitedQuota(plan) && !isPro(plan) && ["/pr", "/test"].includes(command.toLowerCase())
}

export function canQueueNightShift(count: number, plan: PlanState): boolean {
  return hasUnlimitedQuota(plan) || isPro(plan) || count <= FREE_NIGHT_SHIFT_TASK_LIMIT
}

export function canUseNightShiftSchedule(plan: PlanState): boolean { return hasUnlimitedQuota(plan) || isPro(plan) }
export function canUseRemoteWorker(plan: PlanState): boolean { return hasUnlimitedQuota(plan) || isPro(plan) }
