import { fetchApi } from "./client";

export interface Notification {
  id: string;
  type: string;
  content: string;
  unread: boolean;
  createdAt: string;
  actorId: string;
  actorName: string;
  actorImg: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const data = await fetchApi("/api/notifications");
  return data.notifications || [];
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetchApi("/api/notifications/read", {
    method: "PUT",
  });
}
