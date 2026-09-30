const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

// The corrupted Model Menu starts with:
// {showModelMenu && (
// <div className="absolute bottom-full left-0 mb-2 w-[280px] max-h-[300px] overflow-y-auto custom-scrollbar bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50">
// ... and ends with the 3 model buttons and an extra </div>

const corruptedModelMenuRegex = /\{showModelMenu && \([\s\S]*?<button onClick=\{\(\) => \{ setSelectedModel\("IdeaAI Hybrid Engine \(Pro\)"\); setShowModelMenu\(false\) \}\} className="w-full flex items-center px-3 py-2 text-\[13px\] text-black\/80 hover:bg-black\/5 text-left font-medium">IdeaAI Hybrid Engine \(Pro\)<\/button>\s*<button onClick=\{\(\) => \{ setSelectedModel\("Bring Your Own Key \(BYOK\)"\); setShowModelMenu\(false\) \}\} className="w-full flex items-center px-3 py-2 text-\[13px\] text-black\/80 hover:bg-black\/5 text-left font-medium">Bring Your Own Key \(BYOK\)<\/button>\s*<button onClick=\{\(\) => \{ setSelectedModel\("Local Engine \(Ollama\)"\); setShowModelMenu\(false\) \}\} className="w-full flex items-center px-3 py-2 text-\[13px\] text-black\/80 hover:bg-black\/5 text-left font-medium">Local Engine \(Ollama\)<\/button>\s*<\/div>\s*\)\}/g;

const correctModelMenu = `{showModelMenu && (
                              <div className="absolute bottom-full left-0 mb-2 w-[220px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50 overflow-hidden">
                                <div className="px-3 py-1 text-[11px] font-bold text-black/40 uppercase tracking-wider">Models</div>
                                <button onClick={() => { setSelectedModel("IdeaAI Hybrid Engine (Pro)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">IdeaAI Hybrid Engine (Pro)</button>
                                <button onClick={() => { setSelectedModel("Bring Your Own Key (BYOK)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Bring Your Own Key (BYOK)</button>
                                <button onClick={() => { setSelectedModel("Local Engine (Ollama)"); setShowModelMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Local Engine (Ollama)</button>
                              </div>
                            )}`;

if (corruptedModelMenuRegex.test(code)) {
    code = code.replace(corruptedModelMenuRegex, correctModelMenu);
    fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
    console.log('Fixed model menu syntax error');
} else {
    console.log('Could not find corrupted model menu');
}
