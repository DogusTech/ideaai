import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow up to 60 seconds for Modal cold starts

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    // Vercel Hobby limits API routes to 10 seconds. Modal cold start takes >60s.
    // We add an 8-second timeout. If it times out, we return a faked stream
    // explaining the situation instead of a hard 504 Vercel timeout.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

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
        // Modal is likely cold-starting. Return a graceful stream.
        const fallbackMessage = "Sunucu (Modal GPU) şu anda uykudan uyanıyor (Cold Start). Bu işlem yaklaşık 1-2 dakika sürebilir. Lütfen biraz bekleyip tekrar deneyin. 🚀";
        
        const textEncoder = new TextEncoder();
        const customStream = new ReadableStream({
          start(controller) {
            controller.enqueue(textEncoder.encode(`0:${JSON.stringify(fallbackMessage)}\n`));
            controller.close();
          }
        });

        return new Response(customStream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'x-vercel-ai-data-stream': 'v1'
          }
        });
      }
      throw fetchError;
    }

    if (!response.ok) {
      throw new Error(`Modal API returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Simulate streaming for a better UI experience
    const textEncoder = new TextEncoder();
    const customStream = new ReadableStream({
      start(controller) {
        const lines = (data.response || "No response").split('\n');
        let i = 0;
        
        const interval = setInterval(() => {
          if (i < lines.length) {
            const chunk = lines[i] + (i < lines.length - 1 ? '\n' : '');
            controller.enqueue(textEncoder.encode(`0:${JSON.stringify(chunk)}\n`));
            i++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 30); // 30ms per line to simulate streaming
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to communicate with IdeaAI.' }, { status: 500 });
  }
}
