import { fetchApi } from "./client";

export async function submitContact(data: { name: string, email: string, subject: string, message: string }) {
  return fetchApi("/contact", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
