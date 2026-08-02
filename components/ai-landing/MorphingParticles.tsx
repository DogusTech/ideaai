'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface MorphingParticlesProps {
  theme?: 'light' | 'dark';
  density?: number;
  particlesScale?: number;
  cameraZoom?: number;
  textures?: string[];
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

export function MorphingParticles({
  theme = 'dark',
  density = 100,
  particlesScale = 1.0,
  cameraZoom = 3.5,
  textures = ['/landing/antigravity-logo.png'],
  color1,
  color2,
  color3,
  className = ''
}: MorphingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // If the script has loaded and the init function is available, run it
    if (isScriptLoaded && typeof window !== 'undefined' && (window as any).initMorphingParticles) {
      // Clear previous instances if they exist
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      // Initialize the particles
      (window as any).initMorphingParticles();
    }
  }, [isScriptLoaded, theme, density, particlesScale, cameraZoom, textures, color1, color2, color3]);

  return (
    <div 
      className={`morphing-particles-component-section morphing-particles ${className}`}
      data-morphing-particles-component
      data-theme={theme}
      data-density={density}
      data-particles-scale={particlesScale}
      data-camera-zoom={cameraZoom}
      data-textures={JSON.stringify(textures)}
      data-color1={color1}
      data-color2={color2}
      data-color3={color3}
      style={{ width: '100%', height: '500px', position: 'relative' }}
    >
      <div 
        ref={containerRef}
        className="morphing-particles-container" 
        data-container 
        style={{ width: '100%', height: '100%' }}
      />
      <Script 
        src="/landing/MorphingParticlesComponent.astro_astro_type_script_index_0_lang.B4r3VvfF.js" 
        strategy="lazyOnload"
        type="module"
        onLoad={() => setIsScriptLoaded(true)}
      />
    </div>
  );
}
