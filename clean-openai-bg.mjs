import fs from 'fs';

const filePath = 'public/matrix-demo/index.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove the floral video tag completely
html = html.replace(/<video[\s\S]*?<\/video>/gi, '<!-- OpenAI video kaldırıldı -->');

// 2. Replace the #efeefe background colors
html = html.replace(/background-color:light-dark\(#efeefe,\s*#efeefe\)/gi, 'background-color:transparent');
html = html.replace(/background-color:#efeefe/gi, 'background-color:transparent');

// 3. Remove old ideaai injected tags if any
html = html.replace(/<style id="ideaai-[^"]*">[\s\S]*?<\/style>/g, '');
html = html.replace(/<div class="ideaai-[^"]*"><\/div>/g, '');
html = html.replace(/<!-- IdeaAI[^>]*-->/g, '');

// 4. Inject the new background element right after <body>
const newBgHtml = `
<!-- IdeaAI Responsive Custom Background -->
<div class="ideaai-custom-bg"></div>
`;
html = html.replace(/(<body[^>]*>)/i, '$1\n' + newBgHtml);

fs.writeFileSync(filePath, html);
console.log("index.html başarıyla temizlendi ve video kaldırıldı.");
