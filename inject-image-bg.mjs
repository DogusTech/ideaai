import fs from 'fs';

const filePath = 'public/matrix-demo/index.html';
let html = fs.readFileSync(filePath, 'utf8');

const bgCss = `
<style id="ideaai-image-bg-styles">
  body, #__next, .bg-background {
      background: transparent !important;
      background-color: transparent !important;
  }
  
  .ideaai-image-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-image: url('/matrix-demo/bg-image.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: -9999;
      pointer-events: none;
      /* Hacker hissi için hafif karartma */
      filter: brightness(0.6) contrast(1.2);
  }
</style>
`;

const bgHtml = `
<!-- IdeaAI Özel Görsel Arkaplanı -->
<div class="ideaai-image-bg"></div>
`;

// Daha önce eklendiyse mesh gradient veya önceki stilleri temizle
html = html.replace(/<style id="ideaai-mesh-styles">[\s\S]*?<\/style>/, '');
html = html.replace(/<!-- IdeaAI Özel Mesh Gradient Arkaplanı -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
html = html.replace(/<style id="ideaai-image-bg-styles">[\s\S]*?<\/style>/, '');
html = html.replace(/<!-- IdeaAI Özel Görsel Arkaplanı -->[\s\S]*?<\/div>/, '');

// CSS'i head içine, HTML'i body başlangıcına ekle
html = html.replace('</head>', bgCss + '</head>');
html = html.replace(/(<body[^>]*>)/i, '$1\n' + bgHtml);

fs.writeFileSync(filePath, html);
console.log("Arkaplan görseli başarıyla enjekte edildi.");
