import type { TogetlinkHub } from "./types"

/** Canonical public URL for a hub detail page: /hubs/{country}/{city}/{slug} */
export function hubHref(hub: Pick<TogetlinkHub, "country" | "city" | "slug">): string {
  const city = encodeURIComponent(hub.city.toLowerCase())
  return `/hubs/${hub.country.toLowerCase()}/${city}/${hub.slug}`
}
