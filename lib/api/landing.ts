import { fetchApi } from "./client"
import { Hub } from "./types"

export async function getLandingVenues(): Promise<Hub[]> {
  const data = await fetchApi("/api/landing/venues")
  return data.venues || []
}
