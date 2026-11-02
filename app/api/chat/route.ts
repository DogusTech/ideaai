export const maxDuration = 60;
import { NextResponse } from 'next/server';

const OLLAMA_REQUEST_TIMEOUT_MS = 60000;
const LOCAL_OLLAMA_URL = 'http://127.0.0.1:11434';

function normalizeEndpoint(value: string | undefined) {
  return value?.trim().replace(/\/+$/, '');
}

function deterministicProfile(prompt: string) {
  let hash = 2166136261;
  for (let index = 0; index < prompt.length; index += 1) {
    hash ^= prompt.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % 1024;
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const body = await request.json();
    const { messages, model } = body;
    
    // ==========================================
    // 1. IDEAAI CLOUD & LOCAL ENGINES (LOCAL OLLAMA TEST ROUTE)
    // ==========================================
    const isAzureCloud = model === "IdeaAI Hybrid Engine (Pro)" || model === "Azure Enterprise Cloud (Llama 3.2)";
    const isLocalOllama = model === "Local Engine (Ollama)";

    if (isLocalOllama) {
      // Local execution is the only mode that may connect to localhost.
      const candidateUrls = [
        normalizeEndpoint(process.env.LOCAL_OLLAMA_URL) || LOCAL_OLLAMA_URL,
      ];

      const uniqueUrls = Array.from(new Set(candidateUrls.filter((url): url is string => Boolean(url))));
      if (uniqueUrls.length === 0) {
        return NextResponse.json({
          error: 'Local Ollama endpoint is not configured. Set LOCAL_OLLAMA_URL or start Ollama on localhost:11434.'
        }, { status: 503 });
      }

      const systemPrompt = `You are IdeaAI, an elite Senior Developer and autonomous coding agent with direct access to the user's filesystem and tools.

If you need to create or modify a file, you MUST output the code inside this exact XML format:
<write_file path="C:\\Users\\dogus\\Desktop\\project\\index.html">
your code here
</write_file>
Always specify an absolute path.
Before each write_file block, add a one-line change marker in this format:
[MODIFY] path/to/file (+12 -4)
Use [NEW] for a new file and [DELETE] for a deleted file. Estimate the changed line counts when an exact diff is unavailable.

CRITICAL INSTRUCTION:
Your core philosophy is to PREVENT developer laziness. You do not just dump code. After you output the <write_file> tags, you MUST act as a Senior Developer mentoring a Junior. You must write a clear, educational summary explaining:
1. WHAT you did and WHICH files you modified.
2. HOW the architecture works and WHY you chose specific patterns or functions.
3. The theoretical software engineering principles behind your choices.
Do NOT output large code blocks outside of the <write_file> tags. Focus purely on mentorship, theory, and explaining the logic behind the code.`;

      const formattedMessages = [
        {
          role: 'system',
          content: `${systemPrompt}

DETERMINISTIC EXECUTION MATRIX:
Use a deterministic profile from the 1024 valid profiles defined by these four dimensions:
- operation: inspect, implement, refactor, repair
- scope: file, module, repository, deployment
- validation: syntax, unit, integration, production
- delivery: explain, patch, commit, pull-request
There are exactly 4 x 4 x 4 x 4 = 1024 profiles. The server-selected profile for this request is P-${String(deterministicProfile(String(messages.at(-1)?.content || ''))).padStart(4, '0')}.
Follow that profile consistently. Never invent tool results, file changes, tests, commits, or deployment status. If a required integration is unavailable, state it explicitly and stop at a verifiable plan.`,
        },
        ...messages.map((m: any) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.content
        }))
      ];

      let lastError = null;

      for (const targetUrl of uniqueUrls) {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        try {
          const controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), OLLAMA_REQUEST_TIMEOUT_MS);

          const res = await fetch(`${targetUrl}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama3.2',
              messages: formattedMessages,
              stream: false
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          timeoutId = undefined;

          if (!res.ok) {
            const errData = await res.text();
            lastError = new Error(`HTTP ${res.status}: ${errData}`);
            continue;
          }

          const data = await res.json();
          const assistantMessage = data.message?.content || data.response || "Motor yanıt verdi ancak format algılanamadı.";
          return NextResponse.json({ response: assistantMessage });

        } catch (err: any) {
          if (timeoutId) clearTimeout(timeoutId);
          lastError = err;
        }
      }

      const targetName = 'Local Ollama (localhost:11434)';
      return NextResponse.json({ 
        error: `${targetName} sunucusuna bağlanılamadı. Ollama'nın localhost:11434 üzerinde çalıştığından emin olun. Detay: ${lastError?.name === 'AbortError' ? 'Bağlantı zaman aşımına uğradı' : lastError?.message || 'Bilinmeyen bağlantı hatası'}` 
      }, { status: 504 });
    }

    // ==========================================
    // 2. CLOUD ENGINE - AZURE VM OLLAMA
    // ==========================================
    if (isAzureCloud) {
      const azureEndpoint = normalizeEndpoint(process.env.AZURE_OLLAMA_URL)
        || (process.env.AZURE_VM_PUBLIC_IP
          ? `http://${process.env.AZURE_VM_PUBLIC_IP.trim()}:11434`
          : undefined);
      const azureModel = (
        process.env.AZURE_OLLAMA_MODEL ||
        process.env.AZURE_LLM_MODEL ||
        'llama3.2'
      ).trim();

      if (!azureEndpoint) {
        return NextResponse.json(
          {
            error:
              'Azure cloud engine is not configured. Set AZURE_OLLAMA_URL or AZURE_VM_PUBLIC_IP in the deployment environment.'
          },
          { status: 503 }
        );
      }

      const azureMessages = [
        {
          role: 'system',
          content:
            'You are IdeaAI, the fine-tuned Llama 3.2 engineering agent running on the IdeaAI Azure VM. Explain reasoning clearly, never invent tool results, and describe file changes and validation precisely.'
        },
        ...messages.map((m: any) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.content
        }))
      ];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OLLAMA_REQUEST_TIMEOUT_MS);
      let azureResponse: Response;
      try {
        azureResponse = await fetch(`${azureEndpoint}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: azureModel,
            messages: azureMessages,
            stream: false
          }),
          signal: controller.signal
        });
      } catch (error) {
        const detail = error instanceof Error && error.name === 'AbortError'
          ? 'request timed out'
          : error instanceof Error ? error.message : 'unknown network error';
        return NextResponse.json(
          { error: `Azure fine-tuned Llama 3.2 endpoint is unreachable at ${azureEndpoint}. Detail: ${detail}` },
          { status: 504 }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      if (!azureResponse.ok) {
        const errorText = await azureResponse.text();
        return NextResponse.json(
          { error: `Azure fine-tuned Llama 3.2 request failed (HTTP ${azureResponse.status}): ${errorText.slice(0, 500)}` },
          { status: azureResponse.status }
        );
      }

      const azureData = await azureResponse.json();
      const response = azureData.message?.content || azureData.response;
      if (!response) {
        return NextResponse.json({ error: 'Azure fine-tuned Llama 3.2 returned an empty response.' }, { status: 502 });
      }
      return NextResponse.json({ response });
    }

    // ==========================================
    // 3. BRING YOUR OWN KEY (BYOK) - OPENAI / GEMINI
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
              parts: [{ text: `You are IdeaAI, an elite Senior Developer and autonomous coding agent with direct access to the user's local file system.

If you need to create or modify a file, you MUST output the code inside this exact XML format:
<write_file path="C:\Users\dogus\Desktop\project\index.html">
your code here
</write_file>
Always specify an absolute path. You can use the tag multiple times for different files.
Before each write_file block, add a one-line change marker in this format:
[MODIFY] path/to/file (+12 -4)
Use [NEW] for a new file and [DELETE] for a deleted file. Estimate the changed line counts when an exact diff is unavailable.

CRITICAL INSTRUCTION:
Your core philosophy is to PREVENT developer laziness. You do not just dump code. After you output the <write_file> tags, you MUST act as a Senior Developer mentoring a Junior. You must write a clear, educational summary explaining:
1. WHAT you did and WHICH files you modified.
2. HOW the architecture works and WHY you chose specific patterns or functions.
3. The theoretical software engineering principles behind your choices.
Do NOT output large code blocks outside of the <write_file> tags. Focus purely on mentorship, theory, and explaining the logic behind the code.` }]
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
