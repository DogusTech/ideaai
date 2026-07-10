import { apiFetch } from "./client"
import { Hub } from "./types"

export async function getDashboardHubs(): Promise<Hub[]> {
  const data = await apiFetch<{ hubs: Hub[] }>("/api/dashboard/hubs?limit=12")
  return data.hubs || []
}
