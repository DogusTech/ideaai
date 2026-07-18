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
  const res = await fetchApi("/auth/session", {
    method: "POST",
    body: JSON.stringify({ idToken })
  });
  
  // Client-side fallback to guarantee the cookie is saved even if Set-Cookie header is dropped
  if (res && res.sessionValue && typeof document !== 'undefined') {
    const date = new Date();
    date.setTime(date.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 days
    document.cookie = `session=${res.sessionValue}; expires=${date.toUTCString()}; path=/; secure; samesite=lax`;
  }
  
  return res;
}

export async function logout() {
  if (typeof document !== 'undefined') {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  return fetchApi("/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  return fetchApi("/auth/me");
}
