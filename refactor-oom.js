const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/dogus/Downloads/togetlinkk/public/landing/index.html';
const html = fs.readFileSync(inputPath, 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
    console.error('No body found');
    process.exit(1);
}

let bodyContent = bodyMatch[1];
// Strip the <script> tags from body
bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Save the raw HTML to a separate file to prevent Turbopack AST parsing crashes (OOM)
const contentHtmlPath = 'C:/Users/dogus/Downloads/togetlinkk/app/ai-landing-page/landing-content.html';
fs.writeFileSync(contentHtmlPath, bodyContent);

// 1. Create LandingClient.tsx (Client Component)
const clientComponent = `
"use client";
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

import './BaseLayout.ByH15-Pm.css';
import './index.BYZqGVMs.css';
import './Header.BsI8e4AW.css';

export default function LandingClient({ htmlContent }: { htmlContent: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div 
        className="landing-container" 
        style={{ width: '100%', height: '100%', overflowX: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {mounted && (
        <>
          <Script src="/landing/AgentFirst.astro_astro_type_script_index_0_lang.DHglPJ15.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/AntigravityFooter.astro_astro_type_script_index_0_lang.DQIYDjYp.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/CustomCursor.astro_astro_type_script_index_0_lang.HIixua-1.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/DownloadSection.astro_astro_type_script_index_0_lang.DO3qSWET.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/FeatureExplorerNew.astro_astro_type_script_index_0_lang.ItaQhKl5.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/Header.astro_astro_type_script_index_0_lang.KVEvS_RS.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/index.astro_astro_type_script_index_0_lang.CghSekDP.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/LandingLatestBlogs.astro_astro_type_script_index_0_lang.C0pOmJid.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/MainParticlesComponent.astro_astro_type_script_index_0_lang.Dox42TL8.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/MorphingParticlesComponent.astro_astro_type_script_index_0_lang.B4r3VvfF.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/Slider.astro_astro_type_script_index_0_lang.COD_D88F.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/SmoothScrollLayout.astro_astro_type_script_index_0_lang.DSfk63xh.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/TypedHeader.astro_astro_type_script_index_0_lang.gO3r8hlV.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/UseCases.astro_astro_type_script_index_0_lang.BF9mW6Y7.js" strategy="afterInteractive" type="module" />
          <Script src="/landing/YoutubeVideoSection.astro_astro_type_script_index_0_lang.CBT2SQlO.js" strategy="afterInteractive" type="module" />
        </>
      )}
    </>
  );
}
`;

fs.writeFileSync('C:/Users/dogus/Downloads/togetlinkk/app/ai-landing-page/LandingClient.tsx', clientComponent);

// 2. Create page.tsx (Server Component)
const serverComponent = `
import fs from 'fs';
import path from 'path';
import LandingClient from './LandingClient';

export default function NativeAntigravityLanding() {
  // Read the HTML string dynamically on the server at runtime.
  // This bypasses Turbopack AST compilation limits.
  const htmlPath = path.join(process.cwd(), 'app/ai-landing-page/landing-content.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  return <LandingClient htmlContent={htmlContent} />;
}
`;

fs.writeFileSync('C:/Users/dogus/Downloads/togetlinkk/app/ai-landing-page/page.tsx', serverComponent);

console.log('Successfully refactored into Server Component reading HTML file -> Client Component');
