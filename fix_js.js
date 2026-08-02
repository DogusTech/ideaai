const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/dogus/Downloads/togetlinkk/public/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let modifiedCount = 0;

files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf8');
    
    // Replace: document.addEventListener('DOMContentLoaded', () => {
    // Or: document.addEventListener(`DOMContentLoaded`, () => {
    const regex = /document\.addEventListener\(['"\`]DOMContentLoaded['"\`],\s*\(\)\s*=>\s*\{/;
    if (regex.test(content)) {
        content = content.replace(regex, '(function() {');
        // Match the final closing }); at the end of the file. 
        content = content.replace(/\}\);?[\s\n]*$/, '})();');
        
        fs.writeFileSync(path.join(dir, f), content);
        modifiedCount++;
        console.log('Modified:', f);
    }
});
console.log('Total modified: ' + modifiedCount);
