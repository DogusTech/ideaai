const fs = require('fs');

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

// Escape backticks and ${}
bodyContent = bodyContent.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const reactComponent = `
"use client";
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

import './BaseLayout.ByH15-Pm.css';
import './index.BYZqGVMs.css';
import './Header.BsI8e4AW.css';

export default function NativeAntigravityLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // This guarantees that after React hydrates, we dispatch the DOMContentLoaded
    // event so that the Astro JS modules can initialize.
    // We try it a few times to ensure we catch them whenever they finish loading.
    const interval = setInterval(() => {
      window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      }));
    }, 500);

    // Stop trying after 5 seconds (plenty of time for scripts to load)
    setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const htmlContent = \`${bodyContent}\`;

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

fs.writeFileSync('C:/Users/dogus/Downloads/togetlinkk/app/ai-landing-page/page.tsx', reactComponent);
console.log('Successfully wrote page.tsx as Client Component with Hydration Fix');
