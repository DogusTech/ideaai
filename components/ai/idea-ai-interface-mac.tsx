"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Home, 
  LayoutGrid, 
  MessageSquare, 
  PenTool, 
  FileText, 
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal, 
  Plus, 
  Mic, 
  Sidebar,
  Image as ImageIcon,
  ArrowUp,
  StopCircle,
  Globe,
  Info,
  Users,
  Settings,
  ArrowRight,
  ChevronRight,
  Code2,
  Terminal
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { AntigravityMarkdown } from "./antigravity-markdown"
import { AgentBridge } from "@/app/utils/agent-bridge"

import { onAuthStateChanged, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { SettingsModal } from "./settings-modal"
import { TeamModal } from "./team-modal"
import { ConstitutionalModalMac } from "./constitutional-modal-mac"
import { Moon } from "lucide-react"

type Project = {
  id: string
  name: string
  files: string[]
  time: string
}

export function IdeaAIInterfaceMac() {
  const [selectedDept, setSelectedDept] = useState("Software")
  const [projects, setProjects] = useState<Project[]>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ideaai_projects') || '[]') : [])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [selectedModel, setSelectedModel] = useState("IdeaAI Hybrid Engine (Pro)")
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("general")
  const [isConstitutionalModalOpen, setIsConstitutionalModalOpen] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState("Connect GitHub")
    const [githubRepos, setGithubRepos] = useState<any[]>([])
    const [isConnectingGithub, setIsConnectingGithub] = useState(false)
    const [githubConnected, setGithubConnected] = useState(false)
  const [showRepoMenu, setShowRepoMenu] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  
  const folderInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)
  const addBtnRef = useRef<HTMLButtonElement>(null)
  const modelMenuRef = useRef<HTMLDivElement>(null)
  const modelBtnRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const body = React.useMemo(() => ({ department: selectedDept, project: selectedProject, model: selectedModel }), [selectedDept, selectedProject, selectedModel])

  const [messages, setMessages] = useState<any[]>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ideaai_current_chat') || '[]') : []);
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
    useEffect(() => {
      if (typeof window !== 'undefined') localStorage.setItem('ideaai_projects', JSON.stringify(projects));
    }, [projects]);
    useEffect(() => {
      if (typeof window !== 'undefined') localStorage.setItem('ideaai_current_chat', JSON.stringify(messages));
    }, [messages]);


  const stop = () => {
    abortControllerRef.current?.abort();
    setStatus('ready');
  };

  const sendMessage = async (message: any) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setStatus('submitted');
    setError(null);
    
    abortControllerRef.current = new AbortController();
    
    try {
      const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('ideaai_api_key') || '' : '';
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': storedApiKey
        },
        body: JSON.stringify({ messages: newMessages, model: selectedModel }),
        signal: abortControllerRef.current.signal,
      });
        
        if (!res.ok) {
          let errText = "Bilinmeyen hata oluştu.";
          if (res.status === 504) {
            errText = "Sunucu (Modal GPU) şu anda uykudan uyanıyor (Cold Start). Lütfen 1 dakika bekleyip tekrar deneyin.";
          } else {
            try { 
              const j = await res.json(); 
              errText = j.error || errText; 
            } catch(e) { 
              errText = await res.text(); 
            }
          }
          throw new Error(errText);
        }
        
        const resData = await res.json();
        const fullText = resData.response || resData.text || "No response";
      const assistantId = Date.now().toString();
      
      setMessages([...newMessages, { id: assistantId, role: 'assistant', content: "" }]);
      setStatus('streaming');
      
      let i = 0;
      const chunkSize = 6;
      
      const interval = setInterval(() => {
        if (i < fullText.length) {
          const currentChunk = fullText.substring(0, i + chunkSize);
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: currentChunk } : m));
          i += chunkSize;
        } else {
          clearInterval(interval);
          setStatus('ready');

          // --- AUTONOMOUS AGENT PARSER ---
          try {
            const writeRegex = /<write_file\s+path=["\']([^"\']+)["\']>([\s\S]*?)<\/write_file>/g;
            let match;
            let filesWritten = [];
            while ((match = writeRegex.exec(fullText)) !== null) {
               const filePath = match[1];
               const fileContent = match[2].trim();
               AgentBridge.writeFile(filePath, fileContent).then(res => {
                  if (res.success) {
                     console.log("File written:", filePath);
                  }
               });
               filesWritten.push(filePath);
            }
            if (filesWritten.length > 0) {
               setTimeout(() => {
                 setMessages(prev => [...prev, {
                    id: Date.now().toString() + "-sys",
                    role: 'assistant',
                    content: '**[Otonom Islem Basarili]**\nSu dosyalar bilgisayariniza kaydedildi:\n' + filesWritten.map(f => '- `' + f + '`').join('\n')
                 }]);
               }, 500);
            }
          } catch (e) {
            console.error("Agent Parser Error:", e);
          }
          // -------------------------------
        }
      }, 15);
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMsg = { id: Date.now().toString(), role: 'assistant', content: `**[System Error]**\n` + (err.message || "An unknown error occurred.") };
        setMessages(prev => [...prev, errorMsg]);
        setStatus('ready');
      } else {
        setStatus('ready');
      }
    }
  };
  

  const [localInput, setLocalInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleCustomSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!localInput.trim() || isLoading) return;
    
    const userInput = localInput.trim();
    setLocalInput("");
    textareaRef.current?.focus();

    if (userInput.startsWith('/test-hybrid')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userInput }]);
        setStatus('submitted');
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: 'Gece protokolü başarıyla aktif edildi. Hibrit sistem Modal Cloud üzerinden çalışıyor. Hedef: "Sistemdeki kimlik doğrulama hatalarını gider."\n\nLütfen nasıl ilerleyeceğimi deterministik olarak seçin:',
            options: [
              "1. Sadece Auth.tsx dosyasını analiz et",
              "2. Tüm projedeki Firebase bağlantılarını kontrol et",
              "3. Gece modunu iptal et ve local IPC'ye dön"
            ]
          }]);
          setStatus('ready');
        }, 1000);
        return;
      }
      
      // -- LOCAL AGENT BRIDGE INTERCEPTION --
    if (userInput.startsWith('/terminal ')) {
      const cmd = userInput.replace('/terminal ', '');
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userInput }]);
      
      setStatus('submitted');
      const res = await AgentBridge.runCommand(cmd, selectedProject || "C:\\");
      
      const output = res.success 
        ? `**[Terminal Success]**\n\`\`\`bash\n${res.stdout || 'Command executed with no output.'}\n\`\`\``
        : `**[Terminal Error]**\n\`\`\`bash\n${res.stderr || res.error}\n\`\`\``;
        
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: output }]);
      setStatus('ready');
      return;
    }

    if (userInput.startsWith('/read ')) {
      const filePath = userInput.replace('/read ', '');
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userInput }]);
      
      setStatus('submitted');
      const res = await AgentBridge.readFile(filePath);
      
      const output = res.success 
        ? `**[File Content: ${filePath}]**\n\`\`\`text\n${res.content}\n\`\`\``
        : `**[Error reading file]**\n\`\`\`text\n${res.error}\n\`\`\``;
        
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: output }]);
      setStatus('ready');
      return;
    }
    // -------------------------------------

    sendMessage({ id: Date.now().toString(), role: 'user', content: userInput });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  }

  // Handle outside clicks to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (showAddMenu && addMenuRef.current && !addMenuRef.current.contains(target) && !addBtnRef.current?.contains(target)) {
        setShowAddMenu(false)
      }
      if (showModelMenu && modelMenuRef.current && !modelMenuRef.current.contains(target) && !modelBtnRef.current?.contains(target)) {
        setShowModelMenu(false)
      }
      // Extremely simple check for workspace menu using class matching to keep it minimalist
      if (showWorkspaceMenu && !(target as Element).closest('.workspace-dropdown-container')) {
        setShowWorkspaceMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showAddMenu, showModelMenu])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  
    const fetchGithubRepos = async (token: string) => {
      try {
        const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setGithubRepos(data);
          setGithubConnected(true);
        }
      } catch (e) {
        console.error("Failed to fetch repos", e);
      }
    };

    const handleConnectGithub = async () => {
      setIsConnectingGithub(true);
      try {
        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        const result = await signInWithPopup(auth, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        if (token) {
          localStorage.setItem('github_token', token);
          fetchGithubRepos(token);
        }
      } catch (error) {
        console.error("Github login failed", error);
      } finally {
        setIsConnectingGithub(false);
      }
    };

    useEffect(() => {
      const token = localStorage.getItem('github_token');
      if (token) {
        fetchGithubRepos(token);
      }
    }, []);

    // Fetch current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
          setUserEmail(user.email || null)
          setUserName(user.displayName || (user.email ? user.email.split('@')[0] : 'User'))
        } else {
          setUserEmail(null)
          setUserName(null)
        }
    })
    return () => unsubscribe()
  }, [])



  const handleFolderSelect = async () => {
    try {
      // Use File System Access API to avoid "Upload X files" browser prompt
      const directoryHandle = await (window as any).showDirectoryPicker({ mode: 'read' })
      const folderName = directoryHandle.name
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: folderName,
        files: [], // Skip counting to ensure instant loading
        time: "Just now"
      }
      
      setProjects(prev => [...prev, newProject])
      setSelectedProject(folderName)
      setShowAddMenu(false)
    } catch (err) {
      console.log('Folder selection cancelled or failed', err)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Just a mock handler for media for now
    if (e.target.files && e.target.files.length > 0) {
      setShowAddMenu(false)
      // Would process file here
    }
  }

  const insertAction = (char: string) => {
    setLocalInput(prev => prev + char)
    setShowAddMenu(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-gradient-to-br from-[#FF9A9E] via-[#FECFEF] to-[#A18CD1]">
      {/* Hidden file inputs for system dialogs */}
      <input type="file" ref={folderInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      
      {/* MAC-LIKE GLASSMORPHISM WINDOW */}
      <div className="w-full h-full bg-[#F9F9F9]/80 backdrop-blur-3xl flex flex-col overflow-hidden relative">
        
        {/* Top Mac Traffic Lights and Menu */}
        <div className="h-10 flex items-center px-4 gap-4 border-b border-black/5 bg-white/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
            <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-[11px] h-[11px] rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          </div>
          <div className="flex gap-4 text-[13px] text-black/50 font-medium ml-2">
            <span className="hover:text-black cursor-pointer transition-colors">File</span>
            <span className="hover:text-black cursor-pointer transition-colors">Edit</span>
            <span className="hover:text-black cursor-pointer transition-colors">View</span>
            <span className="hover:text-black cursor-pointer transition-colors">Help</span>
          </div>
          
          <div className="flex-1"></div>
          <div className="flex items-center gap-4 text-[12px] font-medium text-black/60 pr-2">
            <button 
              onClick={() => setIsConstitutionalModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              <Moon className="w-3.5 h-3.5" />
              Night Protocol
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDEBAR (Cursor style layout) */}
          <div className="w-[260px] bg-white/30 border-r border-black/5 flex flex-col shrink-0">
            {/* Top actions */}
            <div className="p-3">
              <div className="flex items-center justify-between text-black/40 mb-4 px-2">
                <Search className="w-[15px] h-[15px] cursor-pointer hover:text-black" />
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-[15px] h-[15px] rotate-180 cursor-pointer hover:text-black" />
                  <ArrowRight className="w-[15px] h-[15px] cursor-pointer hover:text-black" />
                </div>
              </div>
              
              <div className="space-y-0.5">
                <button 
                  onClick={() => { setMessages([]); setLocalInput(""); }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-black/5 text-black/80 font-medium text-[13px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-[15px] h-[15px]" />
                    New Agent
                  </div>
                  <span className="text-[10px] text-black/40">Ctrl+N</span>
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/5 text-black/70 text-[13px] transition-colors">
                  <Terminal className="w-[15px] h-[15px]" />
                  Automations
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/5 text-black/70 text-[13px] transition-colors"
                >
                  <Settings className="w-[15px] h-[15px]" />
                  Customize
                </button>
              </div>
            </div>

            {/* Repositories */}
            <div className="mt-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-5 mb-2 text-[11px] font-semibold text-black/40 uppercase tracking-wider">
                Repositories
                <div className="flex items-center gap-1.5">
                  <Settings className="w-3 h-3 cursor-pointer hover:text-black/70" />
                  <Plus className="w-3 h-3 cursor-pointer hover:text-black/70" onClick={handleFolderSelect} />
                </div>
              </div>
              
              <div className="px-3">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-black/5 text-black/80 text-[13px] cursor-pointer">
                  <Home className="w-4 h-4 text-black/60" strokeWidth={1.25} />
                  Home
                </div>
                <div className="pl-6 space-y-0.5 mt-1">
                  {projects.map(proj => (
                    <div 
                      key={proj.id} 
                      onClick={() => setSelectedProject(proj.name)}
                      className={`px-2 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors ${selectedProject === proj.name ? "bg-black/10 text-black font-medium" : "text-black/50 hover:text-black hover:bg-black/5"}`}
                    >
                      {proj.name}
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="px-2 py-1.5 text-[12px] text-black/40 italic">
                      No agents yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Profile Footer */}
            <div className="p-3 mt-auto border-t border-black/5 bg-[#F9F9F9]/50">
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-[12px] font-medium text-black shrink-0">
                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-[13px] font-medium text-black/70 truncate">
                    {userName || 'User'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white text-[11px] font-medium px-3 py-1 rounded-full transition-colors">
                    Update
                  </button>
                  <button onClick={() => setIsSettingsOpen(true)} className="text-black/40 hover:text-black transition-colors p-1 hover:bg-black/5 rounded-md">
                    <Settings className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 relative flex flex-col bg-white/40">
            {/* Header Actions */}
            <div className="absolute top-3 right-4 flex items-center gap-4 text-black/40">
              <span className="text-[12px] cursor-pointer hover:text-black">Editor Window ?</span>
              <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-black" />
              <div className="flex items-center gap-[2px] cursor-pointer hover:text-black">
                <div className="w-[11px] h-[11px] border-[1.5px] border-current rounded-[3px]"></div>
                <div className="w-[11px] h-[11px] border-[1.5px] border-current rounded-[3px]"></div>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-2xl flex flex-col items-center">
                  
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-[12px] text-black/50 mb-3 w-full pl-2 font-medium">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors">
                      Home <ChevronDown className="w-3 h-3" />
                    </span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors">
                      <Terminal className="w-3 h-3" /> Local
                    </span>
                  </div>

                  {/* Input Box */}
                  <div className="w-full bg-white rounded-[14px] shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-black/5 p-4 flex flex-col focus-within:ring-2 focus-within:ring-black/5 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={localInput}
                      onChange={(e) => setLocalInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Plan, Build, / for skills, @ for context"
                      className="w-full min-h-[90px] bg-transparent resize-none outline-none text-[15px] text-black placeholder:text-black/30 mb-3 leading-relaxed"
                    />
                    
                      
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
                          
                          <div className="relative">
                            <button onClick={() => setShowRepoMenu(!showRepoMenu)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black/5 text-black/70 rounded-[8px] text-[12px] font-medium transition-colors border border-black/10">
                              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                              {selectedRepo}
                              <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
                            </button>
                            {showRepoMenu && (
                              
                              <div className="absolute bottom-full left-0 mb-2 w-[280px] max-h-[300px] overflow-y-auto custom-scrollbar bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50">
                                <div className="px-3 py-1.5 text-[11px] font-bold text-black/40 uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-black/5">Repositories</div>
                                
                                {!githubConnected ? (
                                  <div className="p-3">
                                    <p className="text-[12px] text-black/60 mb-2 leading-relaxed">Connect your GitHub account to access your private and public repositories.</p>
                                    <button 
                                      onClick={handleConnectGithub}
                                      disabled={isConnectingGithub}
                                      className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-[13px] font-medium hover:bg-black/80 transition-colors"
                                    >
                                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                                      {isConnectingGithub ? "Connecting..." : "Connect GitHub"}
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {githubRepos.length === 0 ? (
                                      <div className="px-3 py-2 text-[12px] text-black/50">Loading repos...</div>
                                    ) : (
                                      githubRepos.map((repo) => (
                                        <button 
                                          key={repo.id}
                                          onClick={() => { setSelectedRepo(repo.full_name); setShowRepoMenu(false) }} 
                                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium transition-colors"
                                        >
                                          {repo.private ? (
                                            <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                          ) : (
                                            <svg className="w-3.5 h-3.5 text-black/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                          )}
                                          <span className="truncate">{repo.full_name}</span>
                                        </button>
                                      ))
                                    )}
                                  </>
                                )}
                              </div>

                                
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={handleCustomSubmit}
                          disabled={!localInput.trim() || isLoading}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                            localInput.trim() ? "bg-black text-white shadow-md hover:scale-105" : "bg-black/80 text-white"
                          }`}
                        >
                          {isLoading ? <StopCircle className="w-[15px] h-[15px] animate-pulse" /> : <Mic className="w-[15px] h-[15px]" />}
                        </button>
                      </div>
                  </div>

                  {/* Small Action Buttons */}
                  <div className="w-full flex mt-4 pl-2">
                    <button className="flex items-center gap-2 text-[12px] text-black/50 hover:text-black px-4 py-1.5 rounded-full border border-black/5 bg-white hover:bg-white/70 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all font-medium">
                      Plan New Idea <span className="flex items-center text-[10px] text-black/30 ml-1"><ArrowUp className="w-3 h-3 mr-0.5" />Tab</span>
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col w-full h-full pt-12 pb-6 px-4 md:px-8 max-w-4xl mx-auto">
                {/* Chat Interface */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-24 pr-4">
                  {messages.map((message, i) => (
                    <motion.div 
                      key={message.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      
                      <div className={`max-w-[85%] rounded-[20px] px-5 py-4 ${
                          message.role === 'user' 
                            ? 'bg-[#F9FAFB] border border-[#E5E7EB] text-black' 
                            : 'bg-white shadow-sm border border-[#E5E7EB] text-black'
                        }`}>
                        <AntigravityMarkdown content={message.content} />
                          {message.options && message.options.length > 0 && (
                            <div className="mt-4 flex flex-col gap-2">
                              <div className="text-[11px] font-semibold text-black/40 uppercase tracking-wider mb-1">Deterministic Options</div>
                              {message.options.map((opt, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => {
                                    setLocalInput(opt);
                                    // Trigger send logic
                                    setTimeout(() => handleCustomSubmit(), 50);
                                  }}
                                  className="text-left px-4 py-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[13px] text-indigo-700 font-medium transition-colors"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                    </motion.div>
                  ))}
                  
                    {status === 'submitted' && (
                      <div className="flex gap-4 flex-row opacity-80 transition-opacity">
                        <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                          AI
                        </div>
                        <div className="flex items-center justify-center py-2 px-2">
                          <img 
                            src="/ideaai-logo.png" 
                            alt="Thinking..." 
                            className="w-5 h-5 ideaai-thinking-anim" 
                          />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Fixed Input at bottom */}
                <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center">
                  <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-[14px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/10 p-3 flex flex-col focus-within:ring-2 focus-within:ring-black/10 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={localInput}
                      onChange={(e) => setLocalInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Reply to AI..."
                      className="w-full max-h-[150px] min-h-[40px] bg-transparent resize-none outline-none text-[14px] text-black placeholder:text-black/40 mb-2"
                    />
                    
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
                          
                          <div className="relative">
                            <button onClick={() => setShowRepoMenu(!showRepoMenu)} className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-black/5 text-black/70 rounded-md text-[11px] font-medium transition-colors border border-black/10">
                              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                              {selectedRepo}
                              <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-50" />
                            </button>
                            {showRepoMenu && (
                              
                              <div className="absolute bottom-full left-0 mb-2 w-[280px] max-h-[300px] overflow-y-auto custom-scrollbar bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-black/5 py-1.5 z-50">
                                <div className="px-3 py-1.5 text-[11px] font-bold text-black/40 uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-black/5">Repositories</div>
                                
                                {!githubConnected ? (
                                  <div className="p-3">
                                    <p className="text-[12px] text-black/60 mb-2 leading-relaxed">Connect your GitHub account to access your private and public repositories.</p>
                                    <button 
                                      onClick={handleConnectGithub}
                                      disabled={isConnectingGithub}
                                      className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-[13px] font-medium hover:bg-black/80 transition-colors"
                                    >
                                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
                                      {isConnectingGithub ? "Connecting..." : "Connect GitHub"}
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {githubRepos.length === 0 ? (
                                      <div className="px-3 py-2 text-[12px] text-black/50">Loading repos...</div>
                                    ) : (
                                      githubRepos.map((repo) => (
                                        <button 
                                          key={repo.id}
                                          onClick={() => { setSelectedRepo(repo.full_name); setShowRepoMenu(false) }} 
                                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-black/80 hover:bg-black/5 text-left font-medium transition-colors"
                                        >
                                          {repo.private ? (
                                            <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                          ) : (
                                            <svg className="w-3.5 h-3.5 text-black/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                          )}
                                          <span className="truncate">{repo.full_name}</span>
                                        </button>
                                      ))
                                    )}
                                  </>
                                )}
                              </div>

                                
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] text-black/40 font-medium hidden md:block">
                            Use <span className="bg-black/5 px-1 py-0.5 rounded">@</span> to reference files
                          </div>
                          <button 
                            onClick={handleCustomSubmit}
                            disabled={!localInput.trim() || isLoading}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                              localInput.trim() ? "bg-black text-white shadow-md" : "bg-black/5 text-black/30"
                            }`}
                          >
                            {isLoading ? <StopCircle className="w-4 h-4 animate-pulse" /> : <ArrowUp className="w-4 h-4" />}
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
      
      {/* Settings Modal (Unchanged) */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialTab={settingsTab} userEmail={userEmail} 
      />

      {/* Constitutional Modal */}
        <ConstitutionalModalMac isOpen={isConstitutionalModalOpen} onClose={() => setIsConstitutionalModalOpen(false)} />

        {/* Team Modal (Unchanged) */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        userEmail={userEmail}
      />
    </div>
  )
}




