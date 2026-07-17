import { fetchApi } from "./client";

export interface UserProfilePreview {
  uid: string;
  name: string;
  headline: string;
}

export interface Conversation {
  id: string;
  lastMessage: string;
  lastMessageAt: string;
  otherUser: UserProfilePreview;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const data = await fetchApi("/api/chat/conversations");
  return data.conversations || [];
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const data = await fetchApi(`/api/chat/${chatId}/messages`);
  return data.messages || [];
}

export async function sendMessage(chatId: string, text: string): Promise<void> {
  await fetchApi(`/api/chat/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function createOrGetChat(targetUserId: string): Promise<string> {
  const data = await fetchApi("/api/chat/create", {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
  });
  return data.chatId;
}
