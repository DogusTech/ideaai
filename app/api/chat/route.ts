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

    // OpenAI'ye veya Gemini'ye dogrudan istek at
    if (apiKey.startsWith('sk-') || apiKey.startsWith('AIza')) {
      // Sadece role ve content gonderilmeli (id gibi frontend'e ozel verileri temizliyoruz)
      const cleanMessages = messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }));

      const isGemini = apiKey.startsWith('AIza');
      const endpoint = isGemini 
        ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions' 
        : 'https://api.openai.com/v1/chat/completions';
      
      const modelName = isGemini ? 'gemini-1.5-flash' : 'gpt-4o';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: 'You are IdeaAI, an elite autonomous coding assistant. You help the user fix bugs, write code, and act as a senior developer.' },
            ...cleanMessages
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return NextResponse.json({ error: errData.error?.message || (isGemini ? 'Gemini API Error' : 'OpenAI API Error') }, { status: res.status });
      }

      const data = await res.json();
      const assistantMessage = data.choices[0]?.message?.content || '';
      
      return NextResponse.json({ response: assistantMessage });
    }

    // Fallback: Eger Anthropic vs gelirse diye eklenebilir veya Modal'a gonderilebilir
    // Modal endpoint'ini acil durumlar iin tutuyoruz ama varsayilan OpenAI olacak.
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
