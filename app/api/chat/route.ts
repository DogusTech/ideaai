import { NextResponse } from 'next/server';
import { createTextStreamResponse } from 'ai';

export const maxDuration = 60; // Allow up to 60 seconds for Modal cold starts

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    // We add a 55-second timeout to allow Modal enough time to wake up,
    // while still returning a friendly error just before Vercel's 60s maxDuration limit.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    let response;
    try {
      response = await fetch('https://dogustech--ideaai-llama3-endpoint-fastapi-app.modal.run/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction: "You are an elite AI coding assistant.",
          input: userPrompt
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        const fallbackMessage = "Sunucu (Modal GPU) şu anda uykudan uyanıyor (Cold Start). Lütfen 1 dakika bekleyip tekrar deneyin. 🚀";
        return new Response(fallbackMessage, { status: 504 });
      }
      throw fetchError;
    }

    if (!response.ok) {
      throw new Error(`Modal API returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Simulate streaming for a better UI experience
    const customStream = new ReadableStream<string>({
      start(controller) {
        const text = data.response || "No response";
        const chunkSize = 20;
        let i = 0;
        
        const interval = setInterval(() => {
          if (i < text.length) {
            controller.enqueue(text.substring(i, i + chunkSize));
            i += chunkSize;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 20); // 20ms per chunk
      }
    });

    return createTextStreamResponse({ stream: customStream });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('IdeaAI ile iletişim kurulamadı. Sunucuya bağlanılamıyor.', { status: 500 });
  }
}
