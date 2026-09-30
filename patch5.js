const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

// --- 1. Fix Header ---
const oldHeader = `<div className="flex-1"></div>
          
          <div className="flex items-center gap-4 text-[12px] font-medium text-black/60 pr-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/5 rounded-md border border-black/5 cursor-pointer hover:bg-black/10 transition-colors">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
              {selectedRepo}
              <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
            </div>
            
            <button 
              onClick={() => setIsConstitutionalModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              <Moon className="w-3.5 h-3.5" />
              Night Protocol
            </button>
          </div>`;

const newHeader = `<div className="flex-1"></div>
          <div className="flex items-center gap-4 text-[12px] font-medium text-black/60 pr-2">
            <button 
              onClick={() => setIsConstitutionalModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              <Moon className="w-3.5 h-3.5" />
              Night Protocol
            </button>
          </div>`;

code = code.replace(oldHeader, newHeader);

// --- 2. Add Reusable Controls UI Component ---
const reusableControls = `
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          {/* Plus Icon */}
                          <button className="text-black/40 hover:text-black transition-colors p-1">
                            <Plus className="w-5 h-5" />
                          </button>
                          
                          {/* Model Dropdown */}
                          <div className="relative">
                            <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-[8px] text-[12px] font-semibold transition-colors border border-indigo-100">
                              <span className="text-indigo-500">✨</span>
                              {selectedModel}
                              <ChevronDown className="w-3 h-3 ml-0.5 text-indigo-400" />
                            </button>
                            
                            {showModelMenu && (
                              <div className="absolute bottom-full left-0 mb-2 w-[220px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50 overflow-hidden">
                                <div className="px-3 py-1 text-[11px] font-bold text-black/40 uppercase tracking-wider">Models</div>
                                <button onClick={() => { setSelectedModel("IdeaAI Hybrid Engine (Pro)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">IdeaAI Hybrid Engine (Pro)</button>
                                <button onClick={() => { setSelectedModel("Bring Your Own Key (BYOK)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Bring Your Own Key (BYOK)</button>
                                <button onClick={() => { setSelectedModel("Local Engine (Ollama)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Local Engine (Ollama)</button>
                              </div>
                            )}
                          </div>

                          {/* GitHub Dropdown */}
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black/5 text-black/70 rounded-[8px] text-[12px] font-medium transition-colors border border-black/10">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                            {selectedRepo}
                            <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={handleCustomSubmit}
                          disabled={!localInput.trim() || isLoading}
                          className={\`w-8 h-8 flex items-center justify-center rounded-full transition-all \${
                            localInput.trim() ? "bg-black text-white shadow-md hover:scale-105" : "bg-black/80 text-white"
                          }\`}
                        >
                          {isLoading ? <StopCircle className="w-[15px] h-[15px] animate-pulse" /> : <Mic className="w-[15px] h-[15px]" />}
                        </button>
                      </div>`;

const emptyStateControlsRegex = /<div className="flex items-center justify-between mt-auto">[\s\S]*?<Mic className="w-\[15px\] h-\[15px\]" \/>}\s*<\/button>\s*<\/div>/;

if (emptyStateControlsRegex.test(code)) {
    code = code.replace(emptyStateControlsRegex, reusableControls);
} else {
    console.error("Could not find empty state controls");
}

// --- 3. Replace Bottom Input Controls ---
const bottomControls = `
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Plus Icon */}
                          <button className="text-black/40 hover:text-black transition-colors p-1">
                            <Plus className="w-4 h-4" />
                          </button>
                          
                          {/* Model Dropdown */}
                          <div className="relative">
                            <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-[11px] font-semibold transition-colors border border-indigo-100">
                              <span className="text-indigo-500">✨</span>
                              {selectedModel}
                              <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-indigo-400" />
                            </button>
                            
                            {showModelMenu && (
                              <div className="absolute bottom-full left-0 mb-2 w-[220px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50 overflow-hidden">
                                <div className="px-3 py-1 text-[11px] font-bold text-black/40 uppercase tracking-wider">Models</div>
                                <button onClick={() => { setSelectedModel("IdeaAI Hybrid Engine (Pro)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">IdeaAI Hybrid Engine (Pro)</button>
                                <button onClick={() => { setSelectedModel("Bring Your Own Key (BYOK)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Bring Your Own Key (BYOK)</button>
                                <button onClick={() => { setSelectedModel("Local Engine (Ollama)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Local Engine (Ollama)</button>
                              </div>
                            )}
                          </div>

                          {/* GitHub Dropdown */}
                          <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-black/5 text-black/70 rounded-md text-[11px] font-medium transition-colors border border-black/10">
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                            {selectedRepo}
                            <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-50" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] text-black/40 font-medium hidden md:block">
                            Use <span className="bg-black/5 px-1 py-0.5 rounded">@</span> to reference files
                          </div>
                          <button 
                            onClick={handleCustomSubmit}
                            disabled={!localInput.trim() || isLoading}
                            className={\`w-8 h-8 flex items-center justify-center rounded-full transition-all \${
                              localInput.trim() ? "bg-black text-white shadow-md" : "bg-black/5 text-black/30"
                            }\`}
                          >
                            {isLoading ? <StopCircle className="w-4 h-4 animate-pulse" /> : <ArrowUp className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>`;

const bottomControlsRegex = /<div className="flex items-center justify-between">\s*<div className="text-\[10px\] text-black\/40 font-medium px-1">[\s\S]*?<ArrowUp className="w-4 h-4" \/>}\s*<\/button>\s*<\/div>/;

if (bottomControlsRegex.test(code)) {
    code = code.replace(bottomControlsRegex, bottomControls);
} else {
    console.error("Could not find bottom input controls");
}


// --- 4. Change default selected model to match ---
code = code.replace('useState("Gemini 3.1 Pro High")', 'useState("IdeaAI Hybrid Engine (Pro)")');

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Done patch5');
