export type PlanTier = "free" | "pro"

export type PlanState = {
  tier: PlanTier
  devPreview: boolean
  updatedAt?: string
}

export const STRIPE_PAYMENT_LINK_URL = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL || "https://buy.stripe.com/your-turaen-pro-link"
export const FREE_MODEL_MAX_BILLION = 3
export const FREE_FILE_LIMIT = 2
export const FREE_NIGHT_SHIFT_TASK_LIMIT = 1

const STORAGE_KEY = "turaen_plan_state"

export const DEFAULT_PLAN_STATE: PlanState = { tier: "free", devPreview: false }

function normalizePlanState(value: unknown): PlanState {
  const input = value && typeof value === "object" ? value as Partial<PlanState> : {}
  return {
    tier: input.tier === "pro" ? "pro" : "free",
    devPreview: Boolean(input.devPreview),
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : undefined,
  }
}

function electronApi(): { invoke: (channel: string, ...args: unknown[]) => Promise<any> } | null {
  if (typeof window === "undefined") return null
  return (window as Window & { electronAPI?: { invoke: (channel: string, ...args: unknown[]) => Promise<any> } }).electronAPI || null
}

export async function getPlanState(): Promise<PlanState> {
  try {
    const result = await electronApi()?.invoke("subscription:get")
    if (result?.success) return normalizePlanState(result.state)
  } catch { /* browser fallback */ }
  if (typeof window === "undefined") return DEFAULT_PLAN_STATE
  try { return normalizePlanState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")) } catch { return DEFAULT_PLAN_STATE }
}

export async function savePlanState(next: Partial<PlanState>): Promise<PlanState> {
  const state = normalizePlanState({ ...(await getPlanState()), ...next, updatedAt: new Date().toISOString() })
  try { await electronApi()?.invoke("subscription:set", state) } catch { /* browser fallback */ }
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return state
}

export function isPro(plan: PlanState): boolean {
  return plan.tier === "pro" || plan.devPreview
}

export function modelParameterCount(model: string): number | null {
  const match = model.match(/(?:^|[-_:])([0-9]+(?:\.[0-9]+)?)b(?:$|[-_:])/i) || model.match(/([0-9]+(?:\.[0-9]+)?)b/i)
  return match ? Number(match[1]) : null
}

export function requiresProForModel(provider: string, model: string, plan: PlanState): boolean {
  if (isPro(plan)) return false
  if (provider === "BYOK" || provider === "Cloud" || provider === "Account") return true
  const parameters = modelParameterCount(model)
  return parameters === null ? false : parameters > FREE_MODEL_MAX_BILLION
}

export function canAttachFiles(count: number, plan: PlanState): boolean {
  return isPro(plan) || count <= FREE_FILE_LIMIT
}

export function requiresProForSlashCommand(command: string, plan: PlanState): boolean {
  return !isPro(plan) && ["/pr", "/test"].includes(command.toLowerCase())
}

export function canQueueNightShift(count: number, plan: PlanState): boolean {
  return isPro(plan) || count <= FREE_NIGHT_SHIFT_TASK_LIMIT
}

export function canUseNightShiftSchedule(plan: PlanState): boolean { return isPro(plan) }
export function canUseRemoteWorker(plan: PlanState): boolean { return isPro(plan) }
