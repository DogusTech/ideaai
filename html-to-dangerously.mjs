import fs from 'fs';

let html = fs.readFileSync('public/matrix-demo/index.html', 'utf8');

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = bodyMatch ? bodyMatch[1] : '';

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

// Escape backticks and dollars for JS template literal
let escapedBody = bodyHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');

let nextJsPage = `
"use client";
import React, { useEffect } from 'react';
import Script from 'next/script';
import Head from 'next/head';

export default function CodexLandingPage() {
    return (
        <>
            <div className="codex-container">
                {/* Orijinal CSS dosyaları */}
                ${cssUrls.map(url => `<link rel="stylesheet" href="${url.replace('./', '/matrix-demo/')}" />`).join('\n                ')}
                
                {/* Sayfa İçeriği - HTML string olarak, kolayca düzenleyebilirsiniz! */}
                <div dangerouslySetInnerHTML={{ __html: \`
${escapedBody}
                \` }} />
                
                {/* Orijinal JS dosyaları */}
                ${scriptUrls.map(url => `<Script src="${url.replace('./', '/matrix-demo/')}" strategy="lazyOnload" />`).join('\n                ')}
            </div>
        </>
    );
}
`;

fs.writeFileSync('app/ai-landing-page/page.tsx', nextJsPage);
console.log("Converted using dangerouslySetInnerHTML successfully!");
