const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/dogus/Downloads/togetlinkk/public/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf8');
    let changed = false;

    if (content.includes('(function() {')) {
        content = content.replace('(function() {', "document.addEventListener('DOMContentLoaded', () => {");
        content = content.replace(/\}\)\(\);?([\s\n]*)$/, '});$1');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(path.join(dir, f), content);
        console.log('Force Restored: ' + f);
    }
});
