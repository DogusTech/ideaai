const fs = require('fs');
let code = fs.readFileSync('app/register/page.tsx', 'utf8');

// Replace Github import
code = code.replace(/import \{ Mail, ArrowRight, Github \} from "lucide-react"/, 'import { Mail, ArrowRight } from "lucide-react"');

// Replace <Github className="w-[16px] h-[16px]" /> with inline SVG
const githubSvg = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>`;

code = code.replace(/<Github className="w-\[16px\] h-\[16px\]" \/>/, githubSvg);

fs.writeFileSync('app/register/page.tsx', code);
console.log("Fixed Github icon import in register page.");
