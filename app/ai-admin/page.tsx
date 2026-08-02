"use client";

import { useState } from "react";

export default function AiAdminPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Idle");

  const runAutonomousLoop = async (initialMessages: any[]) => {
    let currentMessages = [...initialMessages];
    let isComplete = false;

    while (!isComplete) {
      try {
        setStatus("Thinking...");
        
        // Prevent context length errors (Groq 413 Token Limit) by keeping only the last 6 messages
        // Always keep the very first message (the constitution command) and the last 5
        let contextToSend = currentMessages;
        if (currentMessages.length > 7) {
          contextToSend = [
            currentMessages[0], // The original prompt/constitution
            ...currentMessages.slice(-6) // The last 6 interactions
          ];
        }

        // 1. Send conversation to AI
        const res = await fetch("/api/ai-coder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "continue", conversation: contextToSend }),
        });
        
        const data = await res.json();
        
        if (!data.success) {
          // Instead of breaking, feed the error back to the AI so it learns and retries!
          currentMessages.push({ 
            role: 'user', 
            content: `SYSTEM ERROR: ${data.error}. You made a syntax error or a bad API call. Please fix your formatting and try again.` 
          });
          setMessages([...currentMessages]);
          setStatus("Error occurred. Resting for 5 seconds before retry...");
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue; // Do not break the loop!
        }

        const aiResponse = data.response; 
        currentMessages.push(aiResponse);
        setMessages([...currentMessages]);

        // 2. Check for tool calls
        if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
          for (const toolCall of aiResponse.tool_calls) {
            const funcName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            
            setStatus(`Executing ${funcName}...`);
            
            // Execute tool
            const execRes = await fetch("/api/ai-execute", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ function_name: funcName, parameters: args }),
            });
            const execData = await execRes.json();
            
            // Add tool result to conversation
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: funcName,
              content: execData.success ? execData.result : `Error: ${execData.error}`
            });
            setMessages([...currentMessages]);

            if (funcName === "task_complete") {
              isComplete = true; // Only stop if explicitly told to stop
            }
          }
          
          // Add a mandatory sleep to prevent overwhelming the browser or API
          setStatus("Resting for 3 seconds...");
          await new Promise(resolve => setTimeout(resolve, 3000));

        } else {
          // If no tools are called in 24/7 mode, prompt it to continue working
          currentMessages.push({
            role: "user",
            content: "You did not call any tools. Please review the Constitution and continue building or fixing the project."
          });
          setMessages([...currentMessages]);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err: any) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Failed to connect: ${err.message}` }]);
        break; // Stop loop on critical network failure
      }
    }
    
    setLoading(false);
    setStatus("Idle");
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    runAutonomousLoop(newMessages);
  };

  const startConstitutionMode = () => {
    const userMsg = { role: 'user', content: "SYSTEM COMMAND: Begin 24/7 autonomous execution based on the Constitution. Do not stop. Check the directory, find missing pieces, and build them." };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    runAutonomousLoop(newMessages);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto", color: "#1E293B" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>IdeaAI Autonomous Console</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ color: "#64748B", margin: 0 }}>
          Status: <strong style={{ color: loading ? "#3B82F6" : "#10B981" }}>{status}</strong>
        </p>
        <button 
          onClick={startConstitutionMode} 
          disabled={loading}
          style={{
            padding: "10px 20px", backgroundColor: loading ? "#94A3B8" : "#EF4444", color: "white", 
            border: "none", borderRadius: "6px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold"
          }}
        >
          🚀 Start 24/7 Constitution Mode
        </button>
      </div>
      
      <div style={{ 
        border: "1px solid #E2E8F0", borderRadius: "8px", padding: "20px", 
        height: "600px", overflowY: "auto", marginBottom: "20px", backgroundColor: "#F8FAFC"
      }}>
        {messages.length === 0 && <p style={{ color: "#94A3B8" }}>Start the autonomous loop by entering a goal, or click the red button.</p>}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "15px", textAlign: msg.role === 'user' ? "right" : "left" }}>
            <div style={{
              display: "inline-block", padding: "10px 15px", borderRadius: "8px",
              backgroundColor: msg.role === 'user' ? "#3B82F6" : (msg.role === 'tool' ? "#F1F5F9" : "#E2E8F0"),
              color: msg.role === 'user' ? "white" : (msg.role === 'tool' ? "#64748B" : "#1E293B"),
              maxWidth: "85%", whiteSpace: "pre-wrap", fontSize: msg.role === 'tool' ? "0.85em" : "1em",
              border: msg.role === 'tool' ? "1px dashed #CBD5E1" : "none"
            }}>
              <strong>{msg.role.toUpperCase()}: </strong>
              {msg.content || (msg.tool_calls && `[Calling Tool: ${msg.tool_calls[0].function.name}]`)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Or give a specific command..."
          style={{ flex: 1, padding: "14px", borderRadius: "6px", border: "1px solid #CBD5E1", outline: "none" }}
        />
        <button 
          onClick={handleSend} disabled={loading}
          style={{ 
            padding: "14px 28px", backgroundColor: loading ? "#94A3B8" : "#8B5CF6", 
            color: "white", border: "none", borderRadius: "6px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold"
          }}
        >
          Execute
        </button>
      </div>
    </div>
  );
}
