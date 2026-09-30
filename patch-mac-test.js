const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

// Fix 1: sendMessage error handling
const oldCatch = `    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err);
        setStatus('error');
      } else {
        setStatus('ready');
      }
    }`;

const newCatch = `    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMsg = { id: Date.now().toString(), role: 'assistant', content: \`**[System Error]**\\n\` + (err.message || "An unknown error occurred.") };
        setMessages(prev => [...prev, errorMsg]);
        setStatus('ready');
      } else {
        setStatus('ready');
      }
    }`;
code = code.replace(oldCatch, newCatch);

// Fix 2 & 3: userName and selectedRepo
code = code.replace(/const \[userEmail, setUserEmail\] = useState<string \| null>\(null\)/, `const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)`);

code = code.replace(/if \(user && user\.email\) \{\s*setUserEmail\(user\.email\)\s*\} else \{\s*setUserEmail\(null\)\s*\}/, `if (user) {
          setUserEmail(user.email || null)
          setUserName(user.displayName || (user.email ? user.email.split('@')[0] : 'User'))
        } else {
          setUserEmail(null)
          setUserName(null)
        }`);

code = code.replace(/\{userEmail \? userEmail\.split\('@'\)\[0\] : 'User'\}/g, `{userName || 'User'}`);

code = code.replace(/const \[selectedRepo, setSelectedRepo\] = useState\("DogusTech\/togetlink"\)/, `const [selectedRepo, setSelectedRepo] = useState("Connect GitHub")`);

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log("Applied fixes to mac-test interface");
