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
    credentials: "same-origin",
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
