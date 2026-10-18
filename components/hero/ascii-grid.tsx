"use client";
import React, { useEffect, useRef } from 'react';

const ICONS = [">", "/", "{", "}", "[", "]", '"', "-", "\\", "|", "+"];

export function AsciiGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 14;
    const globeRadius = Math.min(width, height) * 0.4;
    
    // Küre üzerindeki noktaları hesaplayalım (Fibonacci sphere distribution)
    const numPoints = 1500;
    const points: {x: number, y: number, z: number, icon: string, originalZ: number}[] = [];
    
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x,
        y: y,
        z: z,
        originalZ: z,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)]
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) / (width / 2);
      mouseY = (e.clientY - height / 2) / (height / 2);
      
      // Fare hareketine göre hedeflenen dönüş açısı
      targetRotationY = mouseX * Math.PI;
      targetRotationX = mouseY * Math.PI;
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      time += 0.01;

      // Yumuşak dönüş (lerp)
      rotationX += (targetRotationX - rotationX) * 0.05;
      rotationY += (targetRotationY - rotationY) * 0.05;
      
      // Otomatik yavaş dönüş ekle
      const currentRotY = rotationY + time;
      const currentRotX = rotationX + Math.sin(time * 0.5) * 0.2;

      // 3D dönüş matrisleri hesaplamaları
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);

      // Z eksenine göre sıralama (arkadaki noktalar önce çizilsin)
      const projectedPoints = points.map(p => {
        // Y ekseninde döndür (Rotate around Y)
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y1 = p.y;

        // X ekseninde döndür (Rotate around X)
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = z1 * cosX + y1 * sinX;
        let x2 = x1;

        return {
          ...p,
          projX: x2,
          projY: y2,
          projZ: z2
        };
      });

      projectedPoints.sort((a, b) => a.projZ - b.projZ);

      // Render
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        
        // Z değerine göre boyut ve opaklık hesapla
        const zRatio = (p.projZ + 1) / 2; // 0 (en arka) to 1 (en ön)
        
        // Sadece ön yüzeydekilere daha çok odaklan, arkadakileri gizle
        if (zRatio < 0.2) continue;

        const screenX = centerX + p.projX * globeRadius;
        const screenY = centerY + p.projY * globeRadius;
        
        // Opaklık ve renk ayarı (Mühendislik temasına uygun)
        // Ana mavi renk ve hacker yeşili/beyazı karışımı
        const opacity = Math.max(0.1, zRatio * 0.8);
        
        // Z değerine göre bazı harfleri mavi, bazılarını gri yap
        if (zRatio > 0.85) {
          ctx.fillStyle = `rgba(62, 106, 225, ${opacity + 0.2})`; // Parlak Mavi
        } else {
          ctx.fillStyle = `rgba(120, 120, 140, ${opacity})`; // Metalik Gri
        }
        
        // Noktayı çiz
        ctx.fillText(p.icon, screenX, screenY);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
