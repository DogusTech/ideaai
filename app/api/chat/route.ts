import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;
    const lastMessageContent = messages[messages.length - 1].content;

    const res = await fetch('https://dogustech--ideaai-llama3-endpoint-fastapi-app.modal.run/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        instruction: 'You are an elite AI coding assistant.',
        input: lastMessageContent
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from AI' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
