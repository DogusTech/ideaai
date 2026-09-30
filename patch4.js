const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

// 1. Remove Github from import
code = code.replace('import { Github, Moon } from "lucide-react"', 'import { Moon } from "lucide-react"');

// 2. Replace <Github className="w-3.5 h-3.5" /> with an inline SVG
const githubSvg = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>`;

code = code.replace('<Github className="w-3.5 h-3.5" />', githubSvg);

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Fixed Github import error');
