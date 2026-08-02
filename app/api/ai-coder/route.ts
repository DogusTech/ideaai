import { NextResponse } from "next/server";
import { askIdeaAI } from "@/lib/ai/agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversation } = body;

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json({ error: "Conversation array is required" }, { status: 400 });
    }

    // Call the Groq AI agent
    const aiResponse = await askIdeaAI(conversation);

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    console.error("AI Coder Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
