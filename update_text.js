const fs = require('fs');
let json = fs.readFileSync('app/ai-landing-page/landing-content.json', 'utf8');

// Replace button texts
json = json.replace(/<span>Download<\/span>/g, '<span>Get Started</span>');
json = json.replace(/<span>Download for Windows<\/span>/g, '<span>Get Started</span>');
json = json.replace(/<span>Download for Mac<\/span>/g, '<span>Get Started</span>');
json = json.replace(/<span>Download for Linux<\/span>/g, '<span>Get Started</span>');

fs.writeFileSync('app/ai-landing-page/landing-content.json', json);
console.log('Done replacing texts!');
