import { fetchApi } from "./client";

export async function getCsrfToken() {
  return fetchApi("/auth/csrf");
}

export async function createSession(idToken: string) {
  // We need CSRF first
  await getCsrfToken();
  return fetchApi("/auth/session", {
    method: "POST",
    body: JSON.stringify({ idToken })
  });
}

export async function logout() {
  return fetchApi("/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  return fetchApi("/auth/me");
}
