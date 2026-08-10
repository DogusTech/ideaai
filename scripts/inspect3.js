const fs = require('fs');
const path = 'app/ai-landing-page/landing-content.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const idx = data.html.indexOf('typed-container landing-main');
if (idx !== -1) {
  // extract some context before and after
  console.log(data.html.substring(Math.max(0, idx - 500), idx + 200));
}
