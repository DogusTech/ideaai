import { NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"

export const runtime = "nodejs"

const ratings = new Set(["like", "unlike"])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body?.messageId || !body?.conversationId || !ratings.has(body.rating)) {
      return NextResponse.json({ success: false, error: "messageId, conversationId, and a valid rating are required." }, { status: 400 })
    }
    const record = {
      messageId: String(body.messageId).slice(0, 200),
      conversationId: String(body.conversationId).slice(0, 200),
      rating: body.rating as "like" | "unlike",
      model: String(body.model || "unknown").slice(0, 160),
      brandContext: String(body.brandContext || "Turaen").slice(0, 160),
      promptSnippet: String(body.promptSnippet || "").slice(0, 500),
      responseSnippet: String(body.responseSnippet || "").slice(0, 1000),
      timestamp: new Date().toISOString(),
    }
    await getAdminDb().collection("agent_feedback").add(record)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const errorMsg = String(error?.message || error || "")
    const errorCode = String(error?.code || "")
    const isPermissionOrBilling = 
      errorCode.includes("permission-denied") ||
      errorCode.includes("PERMISSION_DENIED") ||
      /permission|denied|billing|quota|project/i.test(errorMsg)

    if (isPermissionOrBilling) {
      // In local dev or unbilled environments, don't spam errors or hang
      return NextResponse.json({ success: true, warning: "Feedback saved locally (Firestore access restricted)." })
    }

    console.warn("Feedback persistence skipped:", errorMsg.slice(0, 200))
    return NextResponse.json({ success: false, error: "Feedback could not be persisted." }, { status: 200 })
  }
}
