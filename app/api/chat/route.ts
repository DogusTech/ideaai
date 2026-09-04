import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const body = await request.json();
    const { messages } = body;
    
    // BYOK (Bring Your Own Key) Kural: Kullanici API Key girmeden ilem yapamaz.
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { error: 'API Key not found. Please enter your OpenAI API Key in Settings (BYOK Model).' }, 
        { status: 401 }
      );
    }

    // OpenAI'ye doðrudan istek at (Eger baka provider istenecekse burasi gelitirilebilir)
    if (apiKey.startsWith('sk-')) {
      // Sadece role ve content gonderilmeli (id gibi frontend'e ozel verileri temizliyoruz)
      const cleanMessages = messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Veya gpt-4-turbo / gpt-3.5-turbo (Kullanicinin tercihine bagli ayarlanabilir)
          messages: [
            { role: 'system', content: 'You are IdeaAI, an elite autonomous coding assistant.' },
            ...cleanMessages
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        return NextResponse.json({ error: errData.error?.message || 'OpenAI API Error' }, { status: res.status });
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
