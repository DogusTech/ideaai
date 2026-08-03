const fs = require('fs');
let json = fs.readFileSync('app/ai-landing-page/landing-content.json', 'utf8');
json = json.replace(/href="\/download"/g, 'href="/ai-landing-page/register"');
json = json.replace(/href="\/product"/g, 'href="/ai"');
json = json.replace(/href="\/docs\/getting-started"/g, 'href="/ai-landing-page/login"');
fs.writeFileSync('app/ai-landing-page/landing-content.json', json);
console.log('Done!');
