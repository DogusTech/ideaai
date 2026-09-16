const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface-mac.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const lastReturnIdx = content.lastIndexOf('  return (');
if (lastReturnIdx === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const beforeReturn = content.substring(0, lastReturnIdx);
const newReturn = fs.readFileSync('c:/Users/dogus/Downloads/togetlinkk/new_jsx.txt', 'utf8');

let newContent = beforeReturn + newReturn;

// Fix SettingsModal and TeamModal props in the injected code so it doesn't break
newContent = newContent.replace(/activeTab=\{settingsTab\}\s+setActiveTab=\{setSettingsTab\}/g, 'initialTab={settingsTab} userEmail={userEmail}');
newContent = newContent.replace(/projects=\{projects\}\s+currentUserId="founder-123"/g, 'userEmail={userEmail}');

fs.writeFileSync(filePath, newContent);
console.log('Successfully injected at last return index!');
