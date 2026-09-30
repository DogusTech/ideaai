const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

// 1. Add Import
if (!code.includes('ConstitutionalModalMac')) {
    code = code.replace(
        'import { TeamModal } from "./team-modal"',
        'import { TeamModal } from "./team-modal"\nimport { ConstitutionalModalMac } from "./constitutional-modal-mac"\nimport { Github, Moon } from "lucide-react"'
    );
}

// 2. Add State for Modal & Repo
if (!code.includes('isConstitutionalModalOpen')) {
    code = code.replace(
        'const [settingsTab, setSettingsTab] = useState("general")',
        'const [settingsTab, setSettingsTab] = useState("general")\n  const [isConstitutionalModalOpen, setIsConstitutionalModalOpen] = useState(false)\n  const [selectedRepo, setSelectedRepo] = useState("DogusTech/togetlink")'
    );
}

// 3. Add GitHub and Night Mode to the header
const newHeader = `<div className="flex gap-4 text-[13px] text-black/50 font-medium ml-2">
            <span className="hover:text-black cursor-pointer transition-colors">File</span>
            <span className="hover:text-black cursor-pointer transition-colors">Edit</span>
            <span className="hover:text-black cursor-pointer transition-colors">View</span>
            <span className="hover:text-black cursor-pointer transition-colors">Help</span>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-4 text-[12px] font-medium text-black/60 pr-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/5 rounded-md border border-black/5 cursor-pointer hover:bg-black/10 transition-colors">
              <Github className="w-3.5 h-3.5" />
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

code = code.replace(/<div className="flex gap-4 text-\[13px\] text-black\/50 font-medium ml-2\">[\s\S]*?<\/div>/, newHeader);

// 4. Render the modal at the bottom
if (!code.includes('<ConstitutionalModalMac')) {
    code = code.replace(
        '{/* Team Modal (Unchanged) */}',
        `{/* Constitutional Modal */}\n        <ConstitutionalModalMac isOpen={isConstitutionalModalOpen} onClose={() => setIsConstitutionalModalOpen(false)} />\n\n        {/* Team Modal (Unchanged) */}`
    );
}

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Done header and modal');
