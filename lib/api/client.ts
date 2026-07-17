let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
if (typeof window === "undefined" && !API_BASE_URL) {
  API_BASE_URL = "http://127.0.0.1:8080"
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    throw new Error("Request failed")
  }

  // Returns JSON if not 204 No Content
  if (res.status === 204) return null as any

  return res.json() as Promise<T>
}

// Keep fetchApi as a wrapper around apiFetch for backwards compatibility
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Add /api prefix if API_BASE_URL is empty for backwards compatibility 
  // with older calls that didn't include it.
  let path = endpoint;
  if (!path.startsWith('/api')) {
    path = `/api${path.startsWith('/') ? '' : '/'}${path.replace(/^\//, '')}`;
  }
  return apiFetch<any>(path, options);
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
