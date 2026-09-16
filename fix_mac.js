const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface-mac.tsx');

// Restore fresh copy
fs.copyFileSync(
    path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface.tsx'),
    filePath
);

let content = fs.readFileSync(filePath, 'utf8');

// Rename export
content = content.replace('export function IdeaAIInterface(', 'export function IdeaAIInterfaceMac(');

const returnIdx = content.indexOf('  return (\r\n    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#fafafa]');
if (returnIdx === -1) {
    console.log('Cant find exact return pattern, trying alternative...');
    const altIdx = content.indexOf('  return (\n    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#fafafa]');
    if (altIdx === -1) {
        console.error('STILL CANT FIND');
        process.exit(1);
    }
}

// Slice content BEFORE the return
const correctIdx = content.indexOf('  return (\r\n    <div className="flex h-screen') !== -1 ? content.indexOf('  return (\r\n    <div className="flex h-screen') : content.indexOf('  return (\n    <div className="flex h-screen');

const beforeReturn = content.substring(0, correctIdx);
const newReturn = fs.readFileSync('c:/Users/dogus/Downloads/togetlinkk/new_jsx.txt', 'utf8');

let newContent = beforeReturn + newReturn;

// Fix props
newContent = newContent.replace(/activeTab=\{settingsTab\}\s+setActiveTab=\{setSettingsTab\}/g, 'initialTab={settingsTab} userEmail={userEmail}');
newContent = newContent.replace(/projects=\{projects\}\s+currentUserId="founder-123"/g, 'userEmail={userEmail}');

fs.writeFileSync(filePath, newContent);
console.log('SUCCESSFULLY APPLIED NEW_JSX');
