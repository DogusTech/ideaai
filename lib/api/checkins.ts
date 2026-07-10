import { fetchApi } from "./client";

export async function getMyCheckins() {
  return fetchApi("/checkins/me");
}
