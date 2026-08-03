"use client";
import React, { useEffect, useRef } from 'react';

import './BaseLayout.ByH15-Pm.css';
import './index.BYZqGVMs.css';
import './Header.BsI8e4AW.css';
import contentData from './landing-content.json';

export default function NativeAntigravityLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Inject raw HTML manually so React never re-renders and destroys GSAP DOM mutations.
    // In React 18 strict mode, this runs twice, but it's safe because it resets the innerHTML
    if (containerRef.current) {
      containerRef.current.innerHTML = contentData.html;
    }
    
    // Inject scripts natively into the DOM
    const scriptUrls = [
      "/landing/AgentFirst.astro_astro_type_script_index_0_lang.DHglPJ15.js",
      "/landing/AntigravityFooter.astro_astro_type_script_index_0_lang.DQIYDjYp.js",
      "/landing/CustomCursor.astro_astro_type_script_index_0_lang.HIixua-1.js",
      "/landing/DownloadSection.astro_astro_type_script_index_0_lang.DO3qSWET.js",
      "/landing/FeatureExplorerNew.astro_astro_type_script_index_0_lang.ItaQhKl5.js",
      "/landing/Header.astro_astro_type_script_index_0_lang.KVEvS_RS.js",
      "/landing/index.astro_astro_type_script_index_0_lang.CghSekDP.js",
      "/landing/LandingLatestBlogs.astro_astro_type_script_index_0_lang.C0pOmJid.js",
      "/landing/MainParticlesComponent.astro_astro_type_script_index_0_lang.Dox42TL8.js",
      "/landing/MorphingParticlesComponent.astro_astro_type_script_index_0_lang.B4r3VvfF.js",
      "/landing/Slider.astro_astro_type_script_index_0_lang.COD_D88F.js",
      "/landing/SmoothScrollLayout.astro_astro_type_script_index_0_lang.DSfk63xh.js",
      "/landing/TypedHeader.astro_astro_type_script_index_0_lang.gO3r8hlV.js",
      "/landing/UseCases.astro_astro_type_script_index_0_lang.BF9mW6Y7.js",
      "/landing/YoutubeVideoSection.astro_astro_type_script_index_0_lang.CBT2SQlO.js"
    ];

    let loadedCount = 0;
    
    scriptUrls.forEach(src => {
      // Prevent duplicate script tags
      if (document.querySelector(`script[src="${src}"]`)) {
         loadedCount++;
         if (loadedCount === scriptUrls.length) {
            document.fonts.ready.then(() => {
                window.document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
            });
         }
         return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.type = 'module';
      
      script.onload = () => {
        loadedCount++;
        if (loadedCount === scriptUrls.length) {
          setTimeout(() => {
             document.fonts.ready.then(() => {
                 window.document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
             });
          }, 100);
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load script:", src);
        loadedCount++;
        if (loadedCount === scriptUrls.length) {
           setTimeout(() => {
             document.fonts.ready.then(() => {
                 window.document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
             });
           }, 100);
        }
      }

      document.body.appendChild(script);
    });

  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@8..144,-10..0,25..150,400..500,0..100&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital@0;1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Symbols:opsz,wght,FILL,GRAD,ROND@40..48,300,0..1,0,50&display=swap" rel="stylesheet" />
      <link href="https://www.gstatic.com/glue/cookienotificationbar/cookienotificationbar.min.css" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        .header .grid-container { margin: 0 auto !important; padding: 0 var(--page-margin) !important; }\n            
.visually-hidden { 
          clip: rect(0 0 0 0) !important; 
          white-space: nowrap !important; 
          border: 0 !important; 
          width: 1px !important; 
          height: 1px !important; 
          margin: -1px !important; 
          padding: 0 !important; 
          position: absolute !important; 
          overflow: hidden !important; 
        }
      `}} />

      <div 
        className="landing-container" 
        ref={containerRef}
        style={{ width: '100%' }}
      />
    </>
  );
}
