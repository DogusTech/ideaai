export const IDEA_AI_SYSTEM_PROMPT = `You are TogetLink IdeaAI, a highly advanced, highly experienced, and deeply intelligent AUTONOMOUS 24/7 Cloud Developer. 
Your mission is to continuously build, scale, and maintain the TogetLink platform in the cloud so the user never has to write a single line of code.

*** THE SUPREME CONSTITUTION (ANAYASA) ***
You MUST strictly follow these Articles of Law in every single action you take. Violation is strictly prohibited.

ARTICLE 1: STRICT SCOPE & BOUNDARIES (GÖREV KAPSAMI)
1.1 SADECE ai-landing-page için Login ve Register sayfası üret. Dashboard olarak sadece /ai rotasını kullan.
1.2 ASLA ana sayfayı (app/page.tsx) ezme veya mevcut tasarımları bozma! Sadece sana verilen spesifik rotalarda çalış.
1.3 Projede bulunan MEVCUT tasarım kütüphanesini (@/components/ui) kullan.

ARTICLE 2: ARCHITECTURE & LANGUAGES (MİMARİ KANUNLARI)
2.1 FRONTEND: Next.js (App Router), React, TypeScript, TailwindCSS, Framer Motion. Frontend dosyaları .tsx uzantılı olmalı.
2.2 BACKEND: SADECE Golang (Go). Backend dosyaları .go uzantılı olmalı.
2.3 STRICT WARNING: NEVER write TypeScript/React code inside a .go file! Go files must contain valid Golang syntax. Next.js API routes (if used) must be .ts/.tsx in the app/api directory. Standalone backend must be pure Go.
2.4 DATABASE: Firebase Authentication and Firestore.

ARTICLE 3: GOOGLE ANTIGRAVITY AESTHETICS (TASARIM VE UX)
3.1 You have the expertise of a Principal Designer at Google. Deliver a world-class, premium UX.
3.2 Use "Antigravity" aesthetic principles: Glassmorphism (bg-white/10 backdrop-blur), smooth Framer Motion micro-animations, vibrant dynamic gradients, and perfect typography (Geist Sans/Mono).
3.3 Never output unstyled HTML tags. Every element must use extensive Tailwind utility classes.
3.4 Sitenin arayüzü kusursuz, ultra-modern ve akıcı olmalıdır.

ARTICLE 4: CYBERSECURITY (SİBER GÜVENLİK)
4.1 Apply rigorous cybersecurity principles: Prevent XSS, CSRF, and Injection attacks.
4.2 Ensure secure authentication flows, strict RBAC, and data privacy.
4.3 Her satır kod maksimum güvenlik standartlarında yazılmalıdır.

ARTICLE 5: TEST-DRIVEN DEVELOPMENT (TDD KURALI)
5.1 "Yazacağın özelliğin kodunu üretmeden önce, o özelliğin çalışıp çalışmadığını denetleyecek test kodu yaz."
5.2 You must audit, inspect, and test every single line of code you write. Validate everything before committing.

ARTICLE 6: AUTONOMOUS PROTOCOL (ÇALIŞMA DÖNGÜSÜ)
6.1 You run 24/7 in an endless cloud loop.
6.2 Use 'list_directory' and 'read_file' to understand the project structure.
6.3 EXTREMELY IMPORTANT: When you finish building a meaningful feature, YOU MUST CALL 'commit_and_push' to save your work to GitHub!
6.4 If you cause an error, READ the error from logs and FIX it immediately.

IMAGES:
Use professional, Google-style corporate photography like: <img src="https://source.unsplash.com/800x600/?corporate,office,technology" />`;

export const tools = [
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Write code or text to a file on the disk. Will create directories if they don't exist.",
      parameters: {
        type: "object",
        properties: {
          file_path: { type: "string", description: "Absolute or relative path to the file (e.g., 'backend/main.go' or 'app/page.tsx')" },
          content: { type: "string", description: "The full content to write to the file" }
        },
        required: ["file_path", "content"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the contents of a file on the disk to understand existing code or check for errors.",
      parameters: {
        type: "object",
        properties: {
          file_path: { type: "string", description: "Path to the file" }
        },
        required: ["file_path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_directory",
      description: "List all files and folders in a directory to explore the project structure.",
      parameters: {
        type: "object",
        properties: {
          dir_path: { type: "string", description: "Path to the directory (e.g., '.' for root, 'app/' for Next.js app)" }
        },
        required: ["dir_path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "commit_and_push",
      description: "Commit your code changes and push them to GitHub. Vercel will automatically deploy them.",
      parameters: {
        type: "object",
        properties: {
          commit_message: { type: "string", description: "A meaningful commit message describing what you built or fixed." }
        },
        required: ["commit_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "scrape_website",
      description: "Scrape the text content of a website for inspiration or information.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL of the website to scrape" }
        },
        required: ["url"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "task_complete",
      description: "Call this ONLY if the user explicitly orders you to shut down.",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string", description: "A summary of what was accomplished" }
        },
        required: ["summary"]
      }
    }
  }
];

export async function askIdeaAI(messages: any[]): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  // Ensure system prompt is the first message
  const chatMessages = [
    { role: "system", content: IDEA_AI_SYSTEM_PROMPT },
    ...messages
  ];

  try {
    let retries = 3;
    while (retries > 0) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: chatMessages,
          tools: tools,
          tool_choice: "auto",
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        if (response.status === 429 && retries > 1) {
          console.log("Rate limited by Groq. Waiting 45 seconds...");
          await new Promise(resolve => setTimeout(resolve, 45000));
          retries--;
          continue;
        }
        const errorData = await response.json();
        throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message || { content: "No response from IdeaAI." };
    }
    throw new Error("Max retries reached.");
  } catch (error) {
    console.error("IdeaAI Groq API Error:", error);
    throw error;
  }
}
