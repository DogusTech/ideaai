import { fetchApi, setCsrfToken } from "./client";

export async function getCsrfToken() {
  const res = await fetchApi("/auth/csrf");
  if (res && res.token) {
    setCsrfToken(res.token);
  }
  return res;
}

export async function createSession(idToken: string) {
  // Call Next.js API Route directly, bypassing proxy
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken })
  });
  
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse login response");
  }

  if (!res.ok) {
    throw new Error(`API Error (${res.status}): ${data.error || "Unknown error"}`);
  }
  
  // Client-side fallback to guarantee the cookie is saved even if Set-Cookie header is dropped
  if (data && data.sessionValue && typeof document !== 'undefined') {
    const date = new Date();
    date.setTime(date.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 days
    document.cookie = `session=${data.sessionValue}; expires=${date.toUTCString()}; path=/; secure; samesite=none`;
  }
  
  return data;
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
