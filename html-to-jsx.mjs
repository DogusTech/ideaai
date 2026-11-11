import fs from 'fs';

let html = fs.readFileSync('public/matrix-demo/index.html', 'utf8');

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = bodyMatch ? bodyMatch[1] : '';

let headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
let headHtml = headMatch ? headMatch[1] : '';

let jsx = bodyHtml;

// Make it valid JSX
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');

const selfClosingTags = ['img', 'br', 'hr', 'input', 'source', 'meta', 'link'];
selfClosingTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'g');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
});

jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
    let styles = {};
    styleString.split(';').forEach(s => {
        let [key, value] = s.split(':');
        if (key && value) {
            key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            styles[key] = value.trim().replace(/'/g, '"');
        }
    });
    return `style={${JSON.stringify(styles)}}`;
});

jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
jsx = jsx.replace(/stroke-miterlimit=/g, 'strokeMiterlimit=');
jsx = jsx.replace(/clip-path=/g, 'clipPath=');
jsx = jsx.replace(/stop-color=/g, 'stopColor=');
jsx = jsx.replace(/stop-opacity=/g, 'stopOpacity=');
jsx = jsx.replace(/xmlns:xlink=/g, 'xmlnsXlink=');
jsx = jsx.replace(/xml:space=/g, 'xmlSpace=');
jsx = jsx.replace(/tabindex=/g, 'tabIndex=');
jsx = jsx.replace(/autocomplete=/g, 'autoComplete=');
jsx = jsx.replace(/autofocus=/g, 'autoFocus=');
jsx = jsx.replace(/readonly=/g, 'readOnly=');

// Fix style tags (convert <style>...</style> to dangerouslySetInnerHTML)
jsx = jsx.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (match, content) => {
    // Escape quotes and backticks for the content
    const escapedContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `<style dangerouslySetInnerHTML={{ __html: \`${escapedContent}\` }} />`;
});

// Also there might be some remaining HTML specific things
jsx = jsx.replace(/srcset=/g, 'srcSet=');
jsx = jsx.replace(/crossorigin=/g, 'crossOrigin=');
jsx = jsx.replace(/datetime=/g, 'dateTime=');

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
                
                {/* Sayfa İçeriği */}
                ${jsx}
                
                {/* Orijinal JS dosyaları */}
                ${scriptUrls.map(url => `<Script src="${url.replace('./', '/matrix-demo/')}" strategy="lazyOnload" />`).join('\n                ')}
            </div>
        </>
    );
}
`;

fs.writeFileSync('app/ai-landing-page/page.tsx', nextJsPage);
console.log("Converted successfully!");
