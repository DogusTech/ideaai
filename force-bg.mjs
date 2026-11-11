import fs from 'fs';

const filePath = 'public/matrix-demo/index.html';
let html = fs.readFileSync(filePath, 'utf8');

const bgCss = `
<style id="ideaai-image-bg-styles">
  /* OpenAI'in kendi arkaplanlarını ve gölgelerini yok et */
  body, #__next, .bg-background {
      background: transparent !important;
      background-color: transparent !important;
  }
  
  /* Tüm div'lerin arkaplan görsellerini iptal et (kendi div'imiz hariç) */
  div:not(.ideaai-image-bg) {
      background-image: none !important;
  }
  
  /* Arkaplan olarak eklenen büyük imajları veya videoları gizle */
  img[src*="bg"], img[alt*="background"], video {
      opacity: 0 !important;
      display: none !important;
  }

  .ideaai-image-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-image: url('/matrix-demo/bg-image.jpg') !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      z-index: -9999 !important;
      pointer-events: none !important;
      /* Hacker hissi için hafif karartma */
      filter: brightness(0.5) contrast(1.2) !important;
  }
</style>
`;

const bgHtml = `
<!-- IdeaAI Özel Görsel Arkaplanı -->
<div class="ideaai-image-bg"></div>
`;

// Temizle
html = html.replace(/<style id="ideaai-image-bg-styles">[\s\S]*?<\/style>/, '');
html = html.replace(/<!-- IdeaAI Özel Görsel Arkaplanı -->[\s\S]*?<\/div>/, '');

// Ekle
html = html.replace('</head>', bgCss + '</head>');
html = html.replace(/(<body[^>]*>)/i, '$1\n' + bgHtml);

fs.writeFileSync(filePath, html);

// Invalidate Next.js cache by touching page.tsx
let pageTsx = fs.readFileSync('app/ai-landing-page/page.tsx', 'utf8');
pageTsx += '\n// Cache bust: ' + Date.now();
fs.writeFileSync('app/ai-landing-page/page.tsx', pageTsx);

console.log("Arkaplan hacki başarıyla enjekte edildi ve önbellek kırıldı.");
