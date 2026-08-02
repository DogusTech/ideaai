const http = require('http');

const API_BASE = "http://127.0.0.1:3000";

// Simple fetch wrapper since Node 16 doesn't have native fetch without experimental flags,
// but Node 18+ does. Assuming Railway uses Node 18+.
async function runAutonomousLoop() {
  console.log("🚀 Starting IdeaAI 24/7 Cloud Daemon...");
  
  let currentMessages = [
    { 
      role: 'user', 
      content: "SYSTEM COMMAND: Begin 24/7 autonomous execution based on the Constitution. Do not stop. Check the directory, find missing pieces, build them, and push to GitHub." 
    }
  ];

  while (true) {
    try {
      console.log("Thinking...");
      
      // Truncate context to avoid 413
      let contextToSend = currentMessages;
      if (currentMessages.length > 7) {
        contextToSend = [
          currentMessages[0],
          ...currentMessages.slice(-6)
        ];
      }

      const res = await fetch(`${API_BASE}/api/ai-coder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "continue", conversation: contextToSend }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        console.error(`SYSTEM ERROR: ${data.error}`);
        currentMessages.push({ 
          role: 'user', 
          content: `SYSTEM ERROR: ${data.error}. You made a syntax error or a bad API call. Please fix your formatting and try again.` 
        });
        console.log("Resting for 5 seconds before retry...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }

      const aiResponse = data.response; 
      currentMessages.push(aiResponse);

      if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
        for (const toolCall of aiResponse.tool_calls) {
          const funcName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          
          console.log(`Executing ${funcName}...`);
          
          const execRes = await fetch(`${API_BASE}/api/ai-execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ function_name: funcName, parameters: args }),
          });
          const execData = await execRes.json();
          
          currentMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: funcName,
            content: execData.success ? execData.result : `Error: ${execData.error}`
          });
          
          if (execData.success) {
            console.log(`Tool success: ${funcName}`);
          } else {
            console.error(`Tool error: ${execData.error}`);
          }
        }
        
        console.log("Resting for 3 seconds...");
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        currentMessages.push({
          role: "user",
          content: "You did not call any tools. Please review the Constitution and continue building or fixing the project."
        });
        console.log("No tools called. Prompting to continue...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (err) {
      console.error(`Daemon Loop Error: ${err.message}. Retrying in 10 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

// Wait a bit for Next.js to fully boot on Railway before starting the loop
console.log("Waiting 10 seconds for Next.js server to start...");
setTimeout(() => {
  runAutonomousLoop();
}, 10000);
