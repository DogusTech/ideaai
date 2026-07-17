import { fetchApi, setCsrfToken } from "./client";

export async function getCsrfToken() {
  const res = await fetchApi("/auth/csrf");
  if (res && res.token) {
    setCsrfToken(res.token);
  }
  return res;
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
