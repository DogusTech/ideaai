const fs = require('fs');
const path = require('path');

const cssDir = path.join('c:\\Users\\dogus\\Downloads\\togetlinkk\\app\\ai-landing-page');
const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

const regex = /\[data-astro-cid-[a-zA-Z0-9_-]+\]/g;

files.forEach(file => {
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(regex, '');
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Stripped astro-cids from ${file}`);
    } else {
        console.log(`No astro-cids found in ${file}`);
    }
});
