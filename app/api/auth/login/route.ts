import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const backendUrl = process.env.TOGETLINK_BACKEND_URL || "https://togetlink-ui-production.up.railway.app";
    
    // We need to fetch CSRF first to satisfy the Go backend
    const csrfRes = await fetch(`${backendUrl}/api/auth/csrf`);
    if (!csrfRes.ok) {
      return NextResponse.json({ error: "Failed to fetch CSRF from backend" }, { status: 500 });
    }
    
    const csrfData = await csrfRes.json();
    // fetch sometimes returns multiple cookies joined by comma, but we just need togetlink_csrf
    const rawCsrfCookies = csrfRes.headers.get("set-cookie") || "";
    let csrfCookieHeader = "";
    if (rawCsrfCookies.includes("togetlink_csrf=")) {
      const match = rawCsrfCookies.match(/togetlink_csrf=([^;]+)/);
      if (match) {
        csrfCookieHeader = `togetlink_csrf=${match[1]}`;
      }
    }

    // Now send the actual session creation request to Go backend
    const sessionRes = await fetch(`${backendUrl}/api/auth/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfData.token,
        "Cookie": csrfCookieHeader,
      },
      body: JSON.stringify({ idToken }),
    });

    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Failed to create session in backend" }, { status: sessionRes.status });
    }

    // Parse the session cookie returned by Go
    const rawSessionCookies = sessionRes.headers.get("set-cookie");
    if (!rawSessionCookies) {
      return NextResponse.json({ error: "Backend did not return a session cookie" }, { status: 500 });
    }

    const match = rawSessionCookies.match(/session=([^;]+)/);
    const sessionValue = match ? match[1] : null;

    if (!sessionValue) {
      return NextResponse.json({ error: "Failed to parse session cookie" }, { status: 500 });
    }

    const response = NextResponse.json({ status: "success", sessionValue: sessionValue });
    response.cookies.set("session", sessionValue, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    return response;

  } catch (error: any) {
    console.error("Session route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
