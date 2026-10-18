"use client";

import { useState, useEffect } from "react";

export default function IdeaAILocalChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Sadece Electron ortaminda calistigimizdan emin olalim
    if (typeof window !== "undefined" && window.require) {
      setIsElectron(true);
    }
  }, []);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    setResponse("");

    try {
      if (!isElectron) {
        throw new Error("Bu bilesen sadece Electron.js masaustu uygulamasinda calisabilir (Tarayicida degil).");
      }

      // window.require kullanarak Electron'un ipcRenderer'ini cekiyoruz
      const { ipcRenderer } = window.require("electron");
      
      // main.js'de olusturdugumuz 'ask-local-ai' kanalina gonderiyoruz
      const result = await ipcRenderer.invoke("ask-local-ai", prompt);
      
      if (result.success) {
        setResponse(result.text);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Bilinmeyen bir hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", border: "1px solid #333", borderRadius: "10px", backgroundColor: "#1e1e1e", color: "white", fontFamily: "sans-serif" }}>
      <h2>🟢 IdeaAI Yerel Motor Testi (Llama 3)</h2>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="IdeaAI'ye kod sorusu sor... (Orn: React'te state nasil yonetilir?)"
        style={{ width: "100%", height: "100px", padding: "10px", marginBottom: "10px", backgroundColor: "#2d2d2d", color: "white", border: "1px solid #444" }}
      />
      
      <button 
        onClick={handleAsk} 
        disabled={loading || !prompt}
        style={{ padding: "10px 20px", backgroundColor: loading ? "#555" : "#0984e3", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer", borderRadius: "5px", fontWeight: "bold" }}
      >
        {loading ? "Dusünüyor..." : "Sor (Local AI)"}
      </button>

      {error && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "rgba(214, 48, 49, 0.2)", color: "#ff7675", border: "1px solid #d63031", borderRadius: "5px" }}>
          <strong>Hata:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#2d3436", borderLeft: "4px solid #00b894", borderRadius: "4px", whiteSpace: "pre-wrap" }}>
          <strong>Cevap:</strong>
          <br /><br />
          {response}
        </div>
      )}
    </div>
  );
}
