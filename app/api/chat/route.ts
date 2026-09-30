export const maxDuration = 60;
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const body = await request.json();
    const { messages, model } = body;
    
    // ==========================================
    // 1. IDEAAI HYBRID ENGINE (PRO) - MODAL.COM
    // ==========================================
    if (model === "IdeaAI Hybrid Engine (Pro)") {
      const modalUrl = "https://dogustech--ideaai-llama3-endpoint-fastapi-app.modal.run/generate";
      
      try {
        // Format history for the custom Llama-3 endpoint
        let conversationHistory = "";
        for (let i = 0; i < messages.length - 1; i++) {
            const role = messages[i].role === 'user' ? 'User' : 'Assistant';
            conversationHistory += `${role}: ${messages[i].content}\n\n`;
        }
        
        const lastUserMessage = messages[messages.length - 1]?.content || "";
        const finalInput = conversationHistory ? `${conversationHistory}User: ${lastUserMessage}\n\nAssistant:` : lastUserMessage;

        const res = await fetch(modalUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instruction: "You are IdeaAI Hybrid Engine, a powerful custom-trained AI assistant with direct access to the user's local file system. If you need to create or modify a file, you MUST output exactly in this XML format:\n<write_file path=\"C:\\Users\\dogus\\Desktop\\project\\index.html\">\nyour code here\n</write_file>\nAlways specify an absolute path (e.g. C:\\Users\\dogus\\Desktop\\...). You can write multiple files by using the tag multiple times. Answer the user's input.",
            input: finalInput
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          return NextResponse.json({ error: `Hybrid Engine (Modal) yanit vermedi: ${errData} (Sunucu kapali olabilir veya URL guncellenmelidir)` }, { status: res.status });
        }

        const data = await res.json();
        // The endpoint likely returns {"response": "..."} or similar based on openapi.json.
        // We will try standard fields. If it just returns string, we handle it.
        let assistantMessage = data.response || data.output || data.text || data.result || "Hybrid Engine'den yanit alindi, ancak formati bilinmiyor.";
        
        if (typeof data === 'string') {
            assistantMessage = data;
        }

        return NextResponse.json({ response: assistantMessage });
      } catch (e: any) {
         return NextResponse.json({ error: `Hybrid Engine (Modal) sunucusuna ulasilamadi. Sunucu kapali (Inactive) durumda. Detay: ${e.message}` }, { status: 504 });
      }
    }

    // ==========================================
    // 2. BRING YOUR OWN KEY (BYOK) - OPENAI / GEMINI
    // ==========================================
    
    // BYOK (Bring Your Own Key) Kural: Kullanici API Key girmeden islem yapamaz.
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { error: `API Key not found. Received model in payload: '${model}'. Please enter your API Key.` }, 
        { status: 401 }
      );
    }

    let cleanApiKey = apiKey.trim();
    
    const openaiMatch = cleanApiKey.match(/sk-[a-zA-Z0-9_-]+/);
    if (openaiMatch) cleanApiKey = openaiMatch[0];
    else {
      cleanApiKey = cleanApiKey.replace(/^(Bearer\s+|Key=)/i, '').trim();
    }

    const isGemini = !cleanApiKey.startsWith('sk-');
      
    if (isGemini) {
      const geminiMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const targetModel = 'gemini-1.5-flash';

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: `You are IdeaAI, an elite autonomous coding agent.` }]
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


