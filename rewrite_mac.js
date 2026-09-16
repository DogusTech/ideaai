const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface-mac.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const returnIndex = content.indexOf('  return (\r\n    <div className="flex h-screen w-full');
let idx = returnIndex;
if (idx === -1) {
    idx = content.indexOf('  return (\n    <div className="flex h-screen w-full');
}

if (idx === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const beforeReturn = content.substring(0, idx);

const newReturn = `  return (
    <div 
      className="flex flex-col h-screen w-full overflow-hidden relative text-[#171717]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" }}
    >
      {/* Subtle Embedded Background Gradient (Hafif beyaz arka plana gömülü renk geçiþi) */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FF9A9E]/15 via-[#FECFEF]/10 to-[#A18CD1]/15 opacity-70 pointer-events-none mix-blend-multiply"></div>
      
      {/* Hidden file inputs for system dialogs */}
      <input type="file" ref={folderInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      
      {/* NATIVE MAC TOP TITLE BAR (Edge-to-edge) */}
      <div className="h-12 flex items-center px-4 w-full relative z-20 bg-white/40 backdrop-blur-xl border-b border-black/5" style={{ WebkitAppRegion: 'drag' } as any}>
        {/* Mac Traffic Lights */}
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm"></div>
        </div>
        
        {/* Mac Menu Options */}
        <div className="flex gap-4 text-[13px] font-medium text-black/60 ml-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <span className="hover:text-black cursor-pointer transition-colors">File</span>
          <span className="hover:text-black cursor-pointer transition-colors">Edit</span>
          <span className="hover:text-black cursor-pointer transition-colors">View</span>
          <span className="hover:text-black cursor-pointer transition-colors">Help</span>
        </div>

        {/* Center Title / Breadcrumb (Cursor Style) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[12px] font-medium text-black/50">
          <Terminal className="w-3.5 h-3.5" />
          <span>Local</span>
          <ChevronRight className="w-3.5 h-3.5 text-black/30" />
          <span className="text-black/80">IdeaAI Workspace</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* LEFT SIDEBAR (Dark Mode Esintili ama Light Mode'a uyarlanmýþ, Cursor benzeri minimalist) */}
        <div className="w-[260px] bg-black/[0.03] backdrop-blur-3xl border-r border-black/5 flex flex-col shrink-0">
          
          {/* Top actions */}
          <div className="p-3 mt-2">
            <div className="flex items-center justify-between text-black/40 mb-4 px-2">
              <Search className="w-[15px] h-[15px] cursor-pointer hover:text-black transition-colors" />
              <div className="flex items-center gap-3">
                <ArrowRight className="w-[15px] h-[15px] rotate-180 cursor-pointer hover:text-black transition-colors" />
                <ArrowRight className="w-[15px] h-[15px] cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>
            
            <div className="space-y-0.5">
              <button 
                onClick={() => { setMessages([]); setLocalInput(""); }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-black/5 text-black/80 font-medium text-[13px] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-black/50" />
                  New Chat
                </div>
                <span className="text-[10px] text-black/40 font-semibold tracking-widest">?N</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-black/5 text-black/70 text-[13px] transition-colors">
                <Zap className="w-4 h-4 text-black/50" />
                Automations
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-black/5 text-black/70 text-[13px] transition-colors"
              >
                <Settings className="w-4 h-4 text-black/50" />
                Customize
              </button>
            </div>
          </div>

          {/* Repositories */}
          <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between px-5 mb-2 text-[11px] font-semibold text-black/40 uppercase tracking-wider">
              Projects
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-black/80 transition-colors" onClick={handleFolderSelect} />
            </div>
            
            <div className="px-3">
              <div className="pl-2 space-y-0.5 mt-1">
                {projects.map(proj => (
                  <div 
                    key={proj.id} 
                    onClick={() => setSelectedProject(proj.name)}
                    className={\`flex items-center justify-between px-2 py-1.5 rounded-lg text-[13px] cursor-pointer transition-colors \${selectedProject === proj.name ? "bg-black/10 text-black font-medium" : "text-black/60 hover:text-black hover:bg-black/5"}\`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={\`w-2 h-2 rounded-full \${selectedProject === proj.name ? "bg-black" : "bg-transparent border border-black/20"}\`}></div>
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">1m</span>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="px-2 py-1.5 text-[12px] text-black/40 italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border border-black/20 border-dashed"></div>
                    No Repo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 relative flex flex-col bg-transparent">
          
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-3xl flex flex-col items-center">
                
                {/* Clean Initial Input Box (Cursor Style - Görsel 1) */}
                <div className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-4 flex flex-col focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.08)] focus-within:bg-white transition-all duration-300">
                  <textarea
                    ref={textareaRef}
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hello. How can I help you today?"
                    className="w-full min-h-[120px] bg-transparent resize-none outline-none text-[15px] text-black placeholder:text-black/40 mb-3 leading-relaxed"
                  />
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-black/5 text-black/60 hover:text-black rounded-lg text-[12px] font-medium transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        Attach Context
                      </button>
                      <span className="text-black/20">|</span>
                      <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-black/5 text-black/60 hover:text-black rounded-lg text-[12px] font-medium transition-colors">
                        Model: Cursor Grok 4.6
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleCustomSubmit}
                      disabled={!localInput.trim() || isLoading}
                      className={\`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 \${
                        localInput.trim() ? "bg-black text-white shadow-md hover:scale-105" : "bg-black/5 text-black/30"
                      }\`}
                    >
                      {isLoading ? <StopCircle className="w-[15px] h-[15px] animate-pulse" /> : <ArrowUp className="w-[15px] h-[15px]" />}
                    </button>
                  </div>
                </div>

                {/* Sub-actions */}
                <div className="w-full flex items-center justify-center mt-6 gap-4">
                  <button className="flex items-center gap-2 text-[12px] text-black/50 hover:text-black transition-colors">
                    <Terminal className="w-4 h-4" /> Open Terminal
                  </button>
                  <button className="flex items-center gap-2 text-[12px] text-black/50 hover:text-black transition-colors">
                    <Globe className="w-4 h-4" /> Browse Files
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col w-full h-full">
              {/* Top File Breadcrumb for Chat */}
              <div className="h-10 flex items-center px-6 border-b border-black/5 bg-white/20 backdrop-blur-sm text-[12px] text-black/50">
                General chat <span className="mx-2">/</span> IdeaAI Agent
              </div>

              {/* Chat Interface */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 py-8 space-y-8 pb-32">
                {messages.map((message, i) => (
                  <motion.div 
                    key={message.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={\`flex gap-4 max-w-4xl mx-auto \${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}\`}
                  >
                    <div className={\`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[12px] font-medium \${
                      message.role === 'user' ? 'bg-black text-white' : 'bg-transparent border border-black/10 text-black'
                    }\`}>
                      {message.role === 'user' ? (userEmail ? userEmail[0].toUpperCase() : 'U') : <Zap className="w-4 h-4" />}
                    </div>
                    <div className={\`flex-1 rounded-2xl px-6 py-4 \${
                      message.role === 'user' 
                        ? 'bg-black/5 text-black' 
                        : 'bg-white/60 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-black/5'
                    }\`}>
                      <AntigravityMarkdown content={message.content} />
                      {message.role === 'ai' && (
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-black/5 text-black/40">
                          <button className="hover:text-black transition-colors"><Globe className="w-3.5 h-3.5" /></button>
                          <button className="hover:text-black transition-colors"><PenTool className="w-3.5 h-3.5" /></button>
                          <span className="text-[10px]">Just now</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Bottom Sticky Input */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7]/90 to-transparent">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-black/10 p-3 flex flex-col focus-within:shadow-[0_5px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <textarea
                    ref={textareaRef}
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Send follow-up..."
                    className="w-full max-h-[150px] min-h-[40px] bg-transparent resize-none outline-none text-[14px] text-black placeholder:text-black/40 mb-2 px-2"
                  />
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center justify-center w-6 h-6 rounded hover:bg-black/5 text-black/40 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-black/40 font-medium">Cursor Grok 4.6 Medium</span>
                      <button 
                        onClick={handleCustomSubmit}
                        disabled={!localInput.trim() || isLoading}
                        className={\`w-7 h-7 flex items-center justify-center rounded-full transition-all \${
                          localInput.trim() ? "bg-black text-white shadow-md" : "bg-black/5 text-black/30"
                        }\`}
                      >
                        {isLoading ? <StopCircle className="w-3.5 h-3.5 animate-pulse" /> : <ArrowUp className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
`

const newContent = beforeReturn + newReturn;
fs.writeFileSync(filePath, newContent);
console.log('Successfully updated the mac interface design!');
