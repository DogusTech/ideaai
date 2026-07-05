import type { Region } from "./types"

/**
 * Frontend region detection for Turkey and the United States.
 *
 * Region is used only as a *default* and a ranking bias — it never blocks or
 * censors cross-country search. A manual switcher and any search query always
 * take precedence over the detected default.
 */

/**
 * Best-effort region guess from the browser's timezone and locale.
 * Safe to call on the client only (guards for SSR by returning "GLOBAL").
 */
export function detectRegion(): Region {
  if (typeof window === "undefined") return "GLOBAL"

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
    if (tz === "Europe/Istanbul" || tz === "Asia/Istanbul") return "TR"
    if (tz.startsWith("America/")) return "US"

    const locales = navigator.languages ?? [navigator.language]
    for (const locale of locales) {
      const lower = locale.toLowerCase()
      if (lower === "tr" || lower.startsWith("tr-")) return "TR"
      if (lower.endsWith("-us") || lower === "en-us") return "US"
    }
  } catch {
    // Ignore detection failures and fall back to a neutral default.
  }

  return "GLOBAL"
}

export const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: "TR", label: "Turkey" },
  { value: "US", label: "United States" },
  { value: "GLOBAL", label: "Global" },
]
