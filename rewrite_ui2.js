const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const newReturn = fs.readFileSync('new_jsx.txt', 'utf8');

const returnIndex = content.indexOf('  return (\n');
const realReturnIndex = content.indexOf('  return (');
const idx = returnIndex > -1 ? returnIndex : realReturnIndex;

if (idx === -1) {
    console.error('Could not find main return statement');
    process.exit(1);
}

const beforeReturn = content.substring(0, idx);

// Since new_jsx.txt contains the complete replacement from "  return (" down to "}",
// we just concatenate them.
const newContent = beforeReturn + newReturn;

fs.writeFileSync(filePath, newContent);
console.log('Successfully updated the file with the new design!');
