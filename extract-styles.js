const fs = require('fs');

const htmlPath = 'C:/Users/dogus/Downloads/togetlinkk/all-files/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let allStyles = '';
let match;

while ((match = styleRegex.exec(html)) !== null) {
  allStyles += '\n/* Extracted Inline Style */\n' + match[1];
}

const targetCssPath = 'C:/Users/dogus/Downloads/togetlinkk/app/ai-landing-page/BaseLayout.ByH15-Pm.css';
fs.appendFileSync(targetCssPath, allStyles);

console.log('Successfully appended ' + allStyles.length + ' bytes of inline CSS to BaseLayout');
