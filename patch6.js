const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

if (!code.includes('showRepoMenu')) {
    code = code.replace(
        'const [selectedRepo, setSelectedRepo] = useState("DogusTech/togetlink")',
        'const [selectedRepo, setSelectedRepo] = useState("DogusTech/togetlink")\n  const [showRepoMenu, setShowRepoMenu] = useState(false)'
    );

    // Replace the GitHub buttons with active dropdowns
    // 1. In empty state controls
    const ghButtonEmptyState = /<button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black\/5 text-black\/70 rounded-\[8px\] text-\[12px\] font-medium transition-colors border border-black\/10">[\s\S]*?<\/button>/;
    const ghDropdownEmptyState = `
                          <div className="relative">
                            <button onClick={() => setShowRepoMenu(!showRepoMenu)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black/5 text-black/70 rounded-[8px] text-[12px] font-medium transition-colors border border-black/10">
                              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                              {selectedRepo}
                              <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
                            </button>
                            {showRepoMenu && (
                              <div className="absolute bottom-full left-0 mb-2 w-[220px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50 overflow-hidden">
                                <div className="px-3 py-1 text-[11px] font-bold text-black/40 uppercase tracking-wider">Repositories</div>
                                <button onClick={() => { setSelectedRepo("DogusTech/togetlink"); setShowRepoMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">DogusTech/togetlink</button>
                                <button onClick={() => { setSelectedRepo("DogusTech/outrank"); setShowRepoMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">DogusTech/outrank</button>
                                <button onClick={() => { setSelectedRepo("Aeternexus/core"); setShowRepoMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Aeternexus/core</button>
                              </div>
                            )}
                          </div>`;
    code = code.replace(ghButtonEmptyState, ghDropdownEmptyState);
    
    // 2. In bottom controls
    const ghButtonBottom = /<button className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-black\/5 text-black\/70 rounded-md text-\[11px\] font-medium transition-colors border border-black\/10">[\s\S]*?<\/button>/;
    const ghDropdownBottom = `
                          <div className="relative">
                            <button onClick={() => setShowRepoMenu(!showRepoMenu)} className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-black/5 text-black/70 rounded-md text-[11px] font-medium transition-colors border border-black/10">
                              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                              {selectedRepo}
                              <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-50" />
                            </button>
                            {showRepoMenu && (
                              <div className="absolute bottom-full left-0 mb-2 w-[220px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50 overflow-hidden">
                                <div className="px-3 py-1 text-[11px] font-bold text-black/40 uppercase tracking-wider">Repositories</div>
                                <button onClick={() => { setSelectedRepo("DogusTech/togetlink"); setShowRepoMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">DogusTech/togetlink</button>
                                <button onClick={() => { setSelectedRepo("DogusTech/outrank"); setShowRepoMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">DogusTech/outrank</button>
                                <button onClick={() => { setSelectedRepo("Aeternexus/core"); setShowRepoMenu(false) }} className="w-full flex items-center px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium">Aeternexus/core</button>
                              </div>
                            )}
                          </div>`;
    code = code.replace(ghButtonBottom, ghDropdownBottom);
}

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Done patch6');
