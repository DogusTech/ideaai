const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

// 1. Add GithubAuthProvider and signInWithPopup to imports
if (!code.includes('GithubAuthProvider')) {
    code = code.replace(
        'import { onAuthStateChanged } from "firebase/auth"',
        'import { onAuthStateChanged, signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth"'
    );
}

// 2. Add states for GitHub repos
if (!code.includes('githubRepos')) {
    code = code.replace(
        'const [selectedRepo, setSelectedRepo] = useState("DogusTech/togetlink")',
        `const [selectedRepo, setSelectedRepo] = useState("DogusTech/togetlink")
    const [githubRepos, setGithubRepos] = useState<any[]>([])
    const [isConnectingGithub, setIsConnectingGithub] = useState(false)
    const [githubConnected, setGithubConnected] = useState(false)`
    );
}

// 3. Add GitHub fetch logic inside the component
const githubLogic = `
    const fetchGithubRepos = async (token: string) => {
      try {
        const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
          headers: {
            'Authorization': \`Bearer \${token}\`,
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
`;

if (!code.includes('fetchGithubRepos')) {
    code = code.replace(
        '// Fetch current user',
        githubLogic + '\n    // Fetch current user'
    );
}

// 4. Update the Github Repo Menus to use real data
const repoMenuHtml = `
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
`;

// Replace both instances of the old repo menu
const oldRepoMenuRegex = /<div className="absolute bottom-full left-0 mb-2 w-\[220px\] bg-white rounded-\[12px\] shadow-\[0_4px_20px_rgba\(0,0,0,0\.12\)\] border border-black\/5 py-1\.5 z-50 overflow-hidden">[\s\S]*?<\/div>/g;
code = code.replace(oldRepoMenuRegex, repoMenuHtml);

// 5. Fix silent errors in chat
if (!code.includes('**[System Error]**')) {
    code = code.replace(
        "setError(err);\n          setStatus('error');",
        "setError(err);\n          setStatus('error');\n          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `**[System Error]**\\n${err.message}` }]);"
    );
}

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Done patch-github-chat');
