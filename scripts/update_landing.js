const fs = require('fs');

const jsonPath = 'app/ai-landing-page/landing-content.json';
if (fs.existsSync(jsonPath)) {
  let data = fs.readFileSync(jsonPath, 'utf8');
  data = data.replace(/iai-logo-transparent\.png/g, 'iai-logo-transparent.svg');
  // Just in case it's named something else:
  data = data.replace(/TogetLink/g, 'IdeaAI');
  fs.writeFileSync(jsonPath, data);
}

const cssPath = 'app/ai-landing-page/BaseLayout.ByH15-Pm.css';
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  css = css.replace(/--palette-blue-600:#3279f9/g, '--palette-blue-600:#4F46E5');
  css = css.replace(/--palette-blue-600: #3279f9/g, '--palette-blue-600: #4F46E5');
  fs.writeFileSync(cssPath, css);
}

const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <text x="10" y="45" font-family="'Google Sans Flex', Inter, sans-serif" font-size="42" font-weight="800" fill="#1a1d23" letter-spacing="-2">I</text>
  <text x="25" y="45" font-family="'Google Sans Flex', Inter, sans-serif" font-size="42" font-weight="800" fill="#4F46E5" letter-spacing="-2">A</text>
  <text x="60" y="45" font-family="'Google Sans Flex', Inter, sans-serif" font-size="42" font-weight="800" fill="#1a1d23" letter-spacing="-2">I</text>
</svg>`;

const dir = 'public/assets/image';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(dir + '/iai-logo-transparent.svg', svgLogo);
fs.writeFileSync('public/icon.svg', svgLogo);
fs.writeFileSync('public/favicon.svg', svgLogo);
console.log('Logo created and colors updated.');
