import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    // Send the prompt to the Modal Endpoint
    const response = await fetch('https://dogustech--ideaai-llama3-endpoint-fastapi-app.modal.run/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instruction: "You are an elite AI coding assistant. You think step-by-step in <think> tags, and then you format your code changes clearly using [MODIFY] filename.js syntax.",
        input: userPrompt
      }),
    });

    if (!response.ok) {
      throw new Error(`Modal API returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Simulate streaming for a better UI experience
    const textEncoder = new TextEncoder();
    const customStream = new ReadableStream({
      start(controller) {
        const lines = data.response.split('\n');
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
