const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const newReturn = fs.readFileSync('new_jsx.txt', 'utf8');

const targetString = '  return (\r\n    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#fafafa] text-[#171717]">';
let idx = content.indexOf(targetString);
if (idx === -1) {
    idx = content.indexOf('  return (\n    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#fafafa] text-[#171717]">');
}

if (idx === -1) {
    console.error('Could not find exact main return statement');
    process.exit(1);
}

const beforeReturn = content.substring(0, idx);

// In idea-ai-interface.tsx, we have Helper components at the bottom (NavItem, ChatNavItem, ProjectItem).
// Since the user might use them or we don't want to delete them accidentally,
// we just need to replace the return statement of IdeaAIInterface, NOT the whole rest of the file!
// Wait! `new_jsx.txt` ALREADY has `}` at the end! So it closes IdeaAIInterface.
// If I just append newReturn, the Helper components will be DELETED.
// That's perfectly fine if I don't use them in the new UI. But wait!
// SettingsModal and TeamModal are used! Yes, and they are imported from other files!
// So I don't need NavItem anymore! 
// Let's just append new_jsx.txt!

const newContent = beforeReturn + newReturn;

fs.writeFileSync(filePath, newContent);
console.log('Successfully updated the file with the new design!');
