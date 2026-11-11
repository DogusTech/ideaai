import fs from 'fs';

const filePath = 'public/matrix-demo/index.html';
let html = fs.readFileSync(filePath, 'utf8');

const meshCss = `
<style id="ideaai-mesh-styles">
  body, #__next, .bg-background {
      background: transparent !important;
      background-color: transparent !important;
  }
  
  .ideaai-mesh-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #080808; /* Çok koyu gri/siyah ana zemin */
      z-index: -9999;
      overflow: hidden;
      pointer-events: none;
  }

  /* Ana Elite Mavi Bulut */
  .ideaai-mesh-blob-1 {
      position: absolute;
      width: 90vw;
      height: 90vw;
      background: radial-gradient(circle, rgba(62, 106, 225, 0.12) 0%, rgba(0,0,0,0) 60%);
      top: -20vh;
      left: -20vw;
      animation: drift 20s infinite alternate ease-in-out;
  }

  /* Daha Koyu / Kirli Mavi-Gri Bulut (Derinlik katar) */
  .ideaai-mesh-blob-2 {
      position: absolute;
      width: 100vw;
      height: 100vw;
      background: radial-gradient(circle, rgba(20, 24, 30, 0.6) 0%, rgba(0,0,0,0) 60%);
      bottom: -30vh;
      right: -20vw;
      animation: drift2 28s infinite alternate ease-in-out;
  }

  /* Ortada hafifçe parlayan yavaş vurgu */
  .ideaai-mesh-blob-3 {
      position: absolute;
      width: 80vw;
      height: 80vw;
      background: radial-gradient(circle, rgba(40, 70, 160, 0.08) 0%, rgba(0,0,0,0) 50%);
      top: 20vh;
      left: 20vw;
      animation: drift3 24s infinite alternate-reverse ease-in-out;
  }

  @keyframes drift {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(15vw, 15vh) scale(1.15); }
  }

  @keyframes drift2 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-20vw, -10vh) scale(1.2); }
  }

  @keyframes drift3 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(20vw, -25vh) scale(0.9); }
  }
</style>
`;

const meshHtml = `
<!-- IdeaAI Özel Mesh Gradient Arkaplanı -->
<div class="ideaai-mesh-bg">
    <div class="ideaai-mesh-blob-1"></div>
    <div class="ideaai-mesh-blob-2"></div>
    <div class="ideaai-mesh-blob-3"></div>
</div>
`;

// Daha önce eklendiyse temizle
html = html.replace(/<style id="ideaai-mesh-styles">[\s\S]*?<\/style>/, '');
html = html.replace(/<!-- IdeaAI Özel Mesh Gradient Arkaplanı -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// CSS'i head içine, HTML'i body başlangıcına ekle
html = html.replace('</head>', meshCss + '</head>');
html = html.replace('<body', '<body'); // Sadece işaret
html = html.replace(/(<body[^>]*>)/i, '$1\n' + meshHtml);

fs.writeFileSync(filePath, html);
console.log("Mesh Gradient başarıyla enjekte edildi.");
