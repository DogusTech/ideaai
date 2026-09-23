import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie) {
      try {
        const decodedClaims = await getAdminAuth().verifySessionCookie(sessionCookie.value);
        await getAdminAuth().revokeRefreshTokens(decodedClaims.sub);
      } catch (e) {
        console.warn("Could not revoke session, might already be expired or invalid", e);
      }
    }

    const response = NextResponse.json({ status: "success" });
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;

  } catch (error: any) {
    console.error("Logout route error:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.cookies.delete("session");
    return response;
  }
}
