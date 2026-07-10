import { fetchApi } from "./client";
import { Hub } from "./types";

export async function getHubs(isDashboard: boolean = false): Promise<Hub[]> {
  const data = await fetchApi(isDashboard ? "/api/dashboard/hubs" : "/api/hubs");
  return data.hubs || [];
}

export async function getHubBySlug(slug: string): Promise<Hub | null> {
  try {
    const data = await fetchApi(`/api/hubs/by-slug?slug=${slug}`);
    return data.hub || null;
  } catch (error) {
    return null;
  }
}

export async function getHubDetail(hubId: string): Promise<Hub> {
  return fetchApi(`/hubs/${hubId}`);
}
