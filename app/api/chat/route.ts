import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const body = await request.json();
    const { messages } = body;
    
    // BYOK (Bring Your Own Key) Kural: Kullanici API Key girmeden islem yapamaz.
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { error: 'API Key not found. Please enter your OpenAI or Gemini API Key in Settings (BYOK Model).' }, 
        { status: 401 }
      );
    }

    let cleanApiKey = apiKey.trim();
    
    // Extract actual key if user accidentally pasted "Bearer sk-..." or "Key=AIza..."
    const geminiMatch = cleanApiKey.match(/AIza[a-zA-Z0-9_-]+/);
    const openaiMatch = cleanApiKey.match(/sk-[a-zA-Z0-9_-]+/);
    
    if (geminiMatch) cleanApiKey = geminiMatch[0];
    else if (openaiMatch) cleanApiKey = openaiMatch[0];

    // OpenAI'ye veya Gemini'ye dogrudan istek at
    if (cleanApiKey.startsWith('sk-') || cleanApiKey.startsWith('AIza')) {
      const isGemini = cleanApiKey.startsWith('AIza');
      
      if (isGemini) {
        // Native Gemini REST API
        const geminiMessages = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: 'You are IdeaAI, an elite autonomous coding assistant. You help the user fix bugs, write code, and act as a senior developer.' }]
            },
            contents: geminiMessages
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          return NextResponse.json({ error: errData.error?.message || 'Gemini API Error' }, { status: res.status });
        }

        const data = await res.json();
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ response: assistantMessage });

      } else {
        // Standard OpenAI REST API
        const cleanMessages = messages.map((m: any) => ({
          role: m.role,
          content: m.content
        }));

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are IdeaAI, an elite autonomous coding assistant. You help the user fix bugs, write code, and act as a senior developer.' },
              ...cleanMessages
            ],
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          return NextResponse.json({ error: errData.error?.message || 'OpenAI API Error' }, { status: res.status });
        }

        const data = await res.json();
        const assistantMessage = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ response: assistantMessage });
      }
    }

    // Fallback if key format is unknown
    return NextResponse.json(
      { error: 'Invalid API Key format. Key must start with "sk-" (OpenAI) or "AIza" (Gemini).' }, 
      { status: 400 }
    );

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
