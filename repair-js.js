const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/dogus/Downloads/togetlinkk/public/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf8');
    let changed = false;

    // Check if we previously modified this file
    if (content.includes('(function() {')) {
        // Find if it ends with })(); (possibly with trailing spaces)
        if (/\}\)\(\);?[\s\n]*$/.test(content)) {
            // Revert (function() { to document.addEventListener('DOMContentLoaded', () => {
            content = content.replace('(function() {', "document.addEventListener('DOMContentLoaded', () => {");
            // Revert })(); at the end to });
            content = content.replace(/\}\)\(\);?([\s\n]*)$/, '});$1');
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(path.join(dir, f), content);
        console.log('Restored: ' + f);
    }
});
