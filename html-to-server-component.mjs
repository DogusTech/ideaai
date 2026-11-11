import fs from 'fs';

let html = fs.readFileSync('public/matrix-demo/index.html', 'utf8');

let headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
let headHtml = headMatch ? headMatch[1] : '';

// Scripts in body
let scripts = headHtml.match(/<script.*?src="(.*?)".*?><\/script>/g) || [];
let scriptUrls = scripts.map(s => {
    let match = s.match(/src="([^"]+)"/);
    return match ? match[1] : null;
}).filter(Boolean);

let links = headHtml.match(/<link.*?href="(.*?)".*?>/g) || [];
let cssUrls = links.map(l => {
    if (l.includes('rel="stylesheet"') || l.includes('as="style"')) {
        let match = l.match(/href="([^"]+)"/);
        return match ? match[1] : null;
    }
    return null;
}).filter(Boolean);


let nextJsPage = `
import React from 'react';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

export default function CodexLandingPage() {
    // SSR'da public içindeki saf HTML dosyasını oku
    const htmlFilePath = path.join(process.cwd(), 'public', 'matrix-demo', 'index.html');
    const rawHtml = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Sadece body içeriğini al
    const bodyMatch = rawHtml.match(/<body[^>]*>([\\s\\S]*?)<\\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

    return (
        <>
            <div className="codex-container">
                {/* Orijinal CSS dosyaları */}
                ${cssUrls.map(url => `<link rel="stylesheet" href="${url.replace('./', '/matrix-demo/')}" />`).join('\n                ')}
                
                {/* Sayfa İçeriği - public/matrix-demo/index.html dosyasını düzenlediğinizde buraya yansır! */}
                <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
                
                {/* Orijinal JS dosyaları */}
                ${scriptUrls.map(url => `<Script src="${url.replace('./', '/matrix-demo/')}" strategy="lazyOnload" />`).join('\n                ')}
            </div>
        </>
    );
}
`;

fs.writeFileSync('app/ai-landing-page/page.tsx', nextJsPage);
console.log("Converted to Server Component with dynamic fs.readFileSync!");
