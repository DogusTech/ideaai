let API_BASE_URL = ""

// For server-side rendering (SSR), we must use the direct backend URL
if (typeof window === "undefined") {
  API_BASE_URL = process.env.TOGETLINK_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://togetlink-ui-production.up.railway.app"
}
let globalCsrfToken: string | null = null;

export function setCsrfToken(token: string) {
  globalCsrfToken = token;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const csrfToken = globalCsrfToken || getCookie("togetlink_csrf");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  };
  
  if (csrfToken) {
    (headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
  }

  // Create an explicit timeout of 10 seconds to prevent indefinite UI hangs
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers,
      signal: controller.signal,
    });
  } catch (error: any) {
    // If the error was caused by our timeout, throw a specific message
    if (error.name === 'AbortError') {
      throw new Error(`Network timeout: The request to ${path} took too long to respond. Please check your connection or backend status.`);
    }
    // Otherwise it's a CORS, DNS, or TCP connection error
    throw new Error(`Network Error: ${error.message || "Failed to fetch"}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    let errorText = "Request failed";
    try {
      errorText = await res.text();
    } catch (e) {}
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  // Returns JSON if not 204 No Content
  if (res.status === 204) return null as any

  return res.json() as Promise<T>
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let path = endpoint;
  if (!path.startsWith('/api/')) {
    // Ensure it starts with exactly /api/
    path = `/api/${path.replace(/^\//, '')}`;
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
