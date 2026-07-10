/**
 * Haversine distance utility — frontend only.
 * Never stores or transmits exact user coordinates.
 */

const EARTH_RADIUS_KM = 6371

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Returns distance in kilometres between two lat/lng points,
 * or null if either point is missing / invalid.
 */
export function haversineKm(
  a: { lat: number; lng: number } | null | undefined,
  b: { lat: number; lng: number } | null | undefined,
): number | null {
  if (!a || !b) return null
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const x =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  return EARTH_RADIUS_KM * c
}

/**
 * Format a distance value (km) into a human-readable string.
 *
 * Examples:
 *   1.2  → "1.2 km away"
 *   8.0  → "8.0 km away"
 *   12.4 → "12 km away"
 *   null → "Distance unavailable"
 */
export function formatDistanceKm(distanceKm: number | null): string {
  if (distanceKm == null || Number.isNaN(distanceKm)) return "Distance unavailable"
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km away`
  return `${Math.round(distanceKm)} km away`
}
