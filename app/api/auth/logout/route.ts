import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const backendUrl = process.env.TOGETLINK_BACKEND_URL || "https://togetlink-ui-production.up.railway.app";
    
    // Fetch CSRF for logout
    const csrfRes = await fetch(`${backendUrl}/api/auth/csrf`);
    if (!csrfRes.ok) {
      return NextResponse.json({ error: "Failed to fetch CSRF from backend" }, { status: 500 });
    }
    
    const csrfData = await csrfRes.json();
    const rawCsrfCookies = csrfRes.headers.get("set-cookie") || "";
    let csrfCookieHeader = "";
    if (rawCsrfCookies.includes("togetlink_csrf=")) {
      const match = rawCsrfCookies.match(/togetlink_csrf=([^;]+)/);
      if (match) {
        csrfCookieHeader = `togetlink_csrf=${match[1]}`;
      }
    }

    // Pass the user's session cookie to the backend so it can revoke it
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    let reqCookies = csrfCookieHeader;
    if (sessionCookie) {
      reqCookies += `; session=${sessionCookie.value}`;
    }

    // Call Railway
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfData.token,
        "Cookie": reqCookies,
      },
    });

    // Regardless of backend success, we MUST clear the cookie locally
    const response = NextResponse.json({ status: "success" });
    response.cookies.delete("session");

    return response;

  } catch (error: any) {
    console.error("Logout route error:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.cookies.delete("session");
    return response;
  }
}
