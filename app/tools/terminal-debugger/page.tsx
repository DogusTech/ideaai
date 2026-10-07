"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Zap, CheckCircle2, ShieldAlert } from "lucide-react";

export default function TerminalDebugger() {
  const [errorLog, setErrorLog] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!errorLog.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    // TODO: Connect this to actual /api/chat route later.
    // For now, we simulate a 2-second AI analysis for the demo effect.
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult("I analyzed your error. It looks like a classic 'Hydration Mismatch' caused by rendering a dynamic Date on the server, which differs when the client hydrates. \n\nFix: Wrap your dynamic component in a `useEffect` or use a skeleton loader until hydration completes.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity">
            <Terminal className="w-5 h-5 text-blue-500" />
            <span className="font-bold tracking-tight">IdeaAI Tools</span>
          </Link>
          <a href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Download Desktop App &rarr;
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: The Tool */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
              AI Terminal Debugger
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Paste your raw, messy terminal output or `stderr` below. Our AI will strip the garbage, analyze the stack trace, and tell you exactly how to fix it.
            </p>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-2xl p-1 shadow-2xl flex-1 flex flex-col">
            <div className="bg-[#1A1B1E] rounded-t-xl px-4 py-3 flex items-center border-b border-white/5">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs font-mono text-slate-500">bash — error_log.txt</div>
            </div>
            
            <textarea 
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste your nasty error log here... (e.g., Module not found: Error: Can't resolve...)"
              className="w-full bg-[#111113] text-slate-300 font-mono text-sm p-6 resize-none focus:outline-none flex-1 min-h-[300px]"
              spellCheck="false"
            />
            
            <div className="p-4 border-t border-white/5 bg-[#16171A] rounded-b-xl flex justify-end">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !errorLog.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing stack trace...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Debug with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div className="mt-8 bg-blue-950/20 border border-blue-900/50 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Analysis Complete</h3>
                  <div className="text-slate-300 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: The Funnel (CTA) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-b from-[#16171A] to-[#0A0A0B] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity group-hover:bg-blue-500/20"></div>
            
            <ShieldAlert className="w-10 h-10 text-blue-500 mb-6" />
            
            <h3 className="text-2xl font-semibold text-white mb-4">
              Tired of copy-pasting errors?
            </h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              You are manually copying errors from your IDE to your browser. That is the old way. 
              <br/><br/>
              **IdeaAI** is a native desktop agent that automatically reads your terminal errors, debugs them, and rewrites the broken code in your local files.
            </p>

            <a 
              href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white text-black hover:bg-slate-200 px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>Download IdeaAI</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <p className="text-xs text-slate-500 text-center mt-4 font-medium">
              Free Early Access for Windows
            </p>
          </div>
          
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-white mb-2">How this tool works</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This web tool uses our open-source <a href="https://github.com/TogetLink/ai-bash-parser" target="_blank" className="text-blue-400 hover:underline">ai-bash-parser</a> to strip ANSI escape codes and format your stderr logs for LLMs. 
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
