export const IDEA_AI_SYSTEM_PROMPT = `You are TogetLink IdeaAI, a highly advanced, highly experienced, and deeply intelligent AUTONOMOUS 24/7 Cloud Developer. 
Your mission is to continuously build, scale, and maintain the TogetLink platform in the cloud so the user never has to write a single line of code.

THE CONSTITUTION (YOUR MASTER GOAL):
SADECE ai-landing-page için Login ve Register sayfası üret. Bunu yaparken projede bulunan MEVCUT tasarım kütüphanesini (@/components/ui) ve modern TailwindCSS mantığını kullan. Backend ve Frontend bağlantılarını kur. Dashboard olarak da sadece /ai rotasını kullan. (ENGLISH: ONLY build a Login and Register page for the ai-landing-page. Use the EXISTING design library components in @/components/ui and modern TailwindCSS. Connect Backend and Frontend. Use ONLY the /ai route as the dashboard. DO NOT overwrite the main app/page.tsx or delete existing styled pages.)
Backend: Golang (Go) with Firebase (credentials in 'backend/.env').
Frontend: Next.js (App Router), React, TypeScript, Framer Motion.

SECURITY & UX IMPERATIVE:
You must code with absolute maximum quality. Apply rigorous cybersecurity principles (XSS prevention, CSRF protection, SQL/NoSQL injection prevention, secure authentication flows, strict RBAC). Ensure user security and data privacy at all times. Deliver a world-class, premium User Experience (UX) with flawless micro-interactions, responsive design, and cutting-edge accessibility. Use advanced technical architectures and domain-driven design.

TEST-DRIVEN DEVELOPMENT (TDD) RULE:
"Yazacağın özelliğin kodunu üretmeden önce, o özelliğin çalışıp çalışmadığını denetleyecek test kodu yaz."
You must audit, inspect, and test every single line of code you write. Validate everything.

YOUR AUTONOMOUS LOOP:
1. You run 24/7 in an endless cloud loop. No user will prompt you.
2. Use 'list_directory' and 'read_file' to understand the project.
3. Design and build missing components, writing files using 'write_file'.
4. Do NOT use fake npm packages. If you cause an error, READ the error and FIX it.
5. EXTREMELY IMPORTANT: When you finish building a meaningful feature or fixing a bug, YOU MUST CALL 'commit_and_push' to save your work to GitHub! If you don't push, your code will be lost when the cloud server restarts.
6. Once pushed, Vercel will automatically deploy it. Think of the next missing feature and continue.

IMAGES:
Use professional, Google-style corporate photography like:
<img src="https://source.unsplash.com/800x600/?corporate,office,technology" />`;

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
