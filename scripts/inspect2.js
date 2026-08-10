const fs = require('fs');
const path = 'app/ai-landing-page/landing-content.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Hero Content matching
const match = data.html.match(/<div class="hero-content"[^>]*>(.*?)<h1/s);
if (match) {
  console.log('Hero Content Before H1:\n', match[1]);
}
