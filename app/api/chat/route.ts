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
    
    // Extract actual key if user accidentally pasted "Bearer sk-..."
    const openaiMatch = cleanApiKey.match(/sk-[a-zA-Z0-9_-]+/);
    if (openaiMatch) cleanApiKey = openaiMatch[0];
    else {
      // Remove any 'Bearer ' or 'Key=' prefixes just in case
      cleanApiKey = cleanApiKey.replace(/^(Bearer\s+|Key=)/i, '').trim();
    }

    const isGemini = !cleanApiKey.startsWith('sk-');
      
    if (isGemini) {
      // Native Gemini REST API
      const geminiMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      let targetModel = 'gemini-1.5-flash';
        
      try {
        // Dinamik olarak bu API Key'e tanimli modelleri cek
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanApiKey}`);
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const availableModels = modelsData.models || [];
          const generateModels = availableModels.filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'));
          
          if (generateModels.length > 0) {
            const flashModel = generateModels.find((m: any) => m.name.includes('flash'));
            const proModel = generateModels.find((m: any) => m.name.includes('pro'));
            const bestModel = flashModel || proModel || generateModels[0];
            targetModel = bestModel.name.replace('models/', '');
          }
        }
      } catch (e) {
        console.error("Model fetch error", e);
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanApiKey}`, {
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

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
