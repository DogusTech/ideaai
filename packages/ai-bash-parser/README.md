# ai-bash-parser 🤖💻

A lightweight Node.js utility designed specifically for Autonomous AI Agents (like Claude, GPT-4, or local models) to securely execute bash commands and parse the output into a clean, LLM-optimized JSON context.

## 🚀 The Story Behind This
**ai-bash-parser** is the open-source extraction engine that powers [**IdeaAI**](https://ideaai.togetlink.com) — the autonomous desktop coding agent that lives on your machine. 

If you want a full desktop agent that uses this module to autonomously run builds, read error logs, and fix your code without copy-pasting, **[Download IdeaAI for free on the Microsoft Store](https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US)**.

---

## 📦 Installation

```bash
npm install ai-bash-parser
```

## 🛠️ Why do LLMs need this?

When you give an LLM raw bash terminal output (`stderr`), it often gets confused by ANSI escape codes (colors) or gets overwhelmed by unstructured text. 

`ai-bash-parser` runs the command, strips the garbage characters, and formats the response into a structured JSON object. If an error occurs, it even injects a system prompt (`llm_suggestion`) telling the AI exactly how to analyze the error and what function to call next.

## 💻 Usage Example

```javascript
const { executeAndParseForLLM } = require('ai-bash-parser');

async function runAILoop() {
  // Let's pretend the AI decided to run a build command
  const result = await executeAndParseForLLM('npm run build', '/my-project-dir');
  
  console.log(JSON.stringify(result, null, 2));
  
  // You would then append this JSON directly into your LLM's context array!
}

runAILoop();
```

### Example JSON Output for the LLM:
```json
{
  "command_executed": "npm run build",
  "working_directory": "/my-project-dir",
  "execution_time_ms": 1250,
  "success": false,
  "stdout": "Building Next.js app...",
  "stderr": "Error: Cannot find module 'react-dom/client' in /my-project-dir/app/page.tsx",
  "llm_suggestion": "Analyze the 'stderr' block. Identify the missing module, syntax error, or failing test. Return a function call to edit the file causing the issue.",
  "error_code": 1
}
```

## 🤝 Contributing & Support
Feel free to open issues or PRs! 

If you are building autonomous agents, stop reinventing the wheel. Download the complete native desktop experience: **[IdeaAI - The Autonomous Engineer](https://ideaai.togetlink.com)**.
