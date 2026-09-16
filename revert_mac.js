const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'dogus', 'Downloads', 'togetlinkk', 'components', 'ai', 'idea-ai-interface-mac.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const returnIndex = content.indexOf('  return (');
if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const beforeReturn = content.substring(0, returnIndex);
const newReturn = fs.readFileSync('c:/Users/dogus/Downloads/togetlinkk/new_jsx.txt', 'utf8');

const newContent = beforeReturn + newReturn;
fs.writeFileSync(filePath, newContent);
console.log('Successfully reverted to yesterday exact code!');
