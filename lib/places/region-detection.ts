import type { RegionDetectionResult, RegionId } from "./types"

/**
 * Detect the user's preferred region from browser signals.
 * Region is used as a ranking bias, NOT as a hard content filter.
 * Cross-country search is always allowed.
 *
 * Run client-side only (uses Intl APIs and navigator.language).
 */
export function detectRegion(): RegionDetectionResult {
  // 1. Timezone-based detection (most reliable)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz.startsWith("Europe/Istanbul") || tz === "Asia/Istanbul") {
      return { region: "turkey", confidence: "high", source: "timezone" }
    }
    if (tz.startsWith("America/")) {
      return { region: "united_states", confidence: "high", source: "timezone" }
    }
  } catch {
    // Intl not available
  }

  // 2. Language-based detection (fallback)
  try {
    const lang =
      (typeof navigator !== "undefined" ? navigator.language : "") ?? ""
    if (lang.startsWith("tr")) {
      return { region: "turkey", confidence: "medium", source: "language" }
    }
    if (lang.startsWith("en-US")) {
      return { region: "united_states", confidence: "medium", source: "language" }
    }
  } catch {
    // navigator not available (SSR)
  }

  return { region: "global", confidence: "low", source: "fallback" }
}

/**
 * Given a detected region, return the ordered country codes to bias results.
 * Always returns both so cross-country search is never blocked.
 */
export function regionToCountryOrder(region: RegionId): ("TR" | "US")[] {
  if (region === "turkey") return ["TR", "US"]
  if (region === "united_states") return ["US", "TR"]
  return ["TR", "US"]
}

export const REGION_LABELS: Record<RegionId, string> = {
  turkey: "Turkey",
  united_states: "United States",
  global: "Global",
}
