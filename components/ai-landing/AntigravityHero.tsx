"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Monitor, Sparkles } from "lucide-react"

export function AntigravityHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll logic for the Video Card scaling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  })

  // Scale the video card from 0.85 to 1 as we scroll down
  // Adjusting the bounds to match the video more closely:
  // Starts slightly smaller and grows as the user scrolls.
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.7], [100, 0])



  const titleLine1 = "Experience liftoff with the next-gen".split(" ");
  const titleLine2 = "agent platform".split(" ");

  const [typingState, setTypingState] = React.useState<"flash" | "hidden" | "typing">("flash");

  React.useEffect(() => {
    const t1 = setTimeout(() => setTypingState("hidden"), 150);
    const t2 = setTimeout(() => setTypingState("typing"), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, []);

  const renderLine = (words: string[], startIndex: number) => {
    return words.map((word, idx) => (
      <motion.span 
        key={idx} 
        initial={{ opacity: 1 }}
        animate={{
          opacity: typingState === "flash" ? 1 : (typingState === "hidden" ? 0 : 1),
          y: typingState === "typing" ? 0 : (typingState === "hidden" ? 10 : 0)
        }}
        transition={
          typingState === "typing" 
            ? { duration: 0.15, ease: "easeOut", delay: (startIndex + idx) * 0.04 } 
            : { duration: 0 }
        }
        className="inline-block mr-[0.25em]"
      >
        {word}
      </motion.span>
    ))
  }

  // --- HTML5 Canvas Particle Engine (Antigravity Architecture) ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parallax target targets
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);
  const currentMouseX = useRef(0);
  const currentMouseY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    // Normalize -1 to 1
    targetMouseX.current = ((e.clientX - left) / width) * 2 - 1;
    targetMouseY.current = ((e.clientY - top) / height) * 2 - 1;
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight * 1.5; // Cover the tall hero section

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight * 1.5;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#2563EB', '#F97316', '#9333EA', '#EF4444'];
    const numParticles = 800;
    
    interface Particle {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      baseLength: number;
      baseThickness: number;
      color: string;
      life: number;
      maxLife: number;
    }

    let particles: Particle[] = [];

    const initParticle = (p?: Partial<Particle>): Particle => {
      // 3D Sphere distribution (Organic)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Radius clustered towards center but extends outwards
      const radius = Math.pow(Math.random(), 1.5) * 800 + 50; 
      
      return {
        x: p?.x ?? (radius * Math.sin(phi) * Math.cos(theta)),
        y: p?.y ?? (radius * Math.sin(phi) * Math.sin(theta)),
        z: p?.z ?? (radius * Math.cos(phi) * 1.5),
        vx: 0, vy: 0, vz: 0,
        baseLength: Math.random() * 6 + 4,
        baseThickness: Math.random() * 1.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
    };

    for (let i = 0; i < numParticles; i++) {
      particles.push(initParticle({ 
        // Initial spawn uniformly spread out so it doesn't all start at 0
        life: Math.random() * 200 
      }));
    }

    let time = 0;

    const render = () => {
      time += 0.005;
      
      // Smooth parallax easing
      currentMouseX.current += (targetMouseX.current - currentMouseX.current) * 0.05;
      currentMouseY.current += (targetMouseY.current - currentMouseY.current) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = (window.innerHeight * 0.4); // Offset center slightly up

      // Sort by Z for proper depth rendering (painters algorithm)
      particles.sort((a, b) => a.z - b.z);

      particles.forEach(p => {
        // Fluid Flow Field (Pseudo-Curl Noise)
        const scale = 0.003;
        const noiseX = Math.sin(p.y * scale + time) * Math.cos(p.z * scale);
        const noiseY = Math.cos(p.x * scale + time) * Math.sin(p.z * scale);
        const noiseZ = Math.sin(p.x * scale - time) * Math.cos(p.y * scale);

        // Velocity includes flow field + slight outward push
        p.vx += noiseX * 0.5 + (p.x * 0.0001);
        p.vy += noiseY * 0.5 + (p.y * 0.0001);
        p.vz += noiseZ * 0.5;

        // Friction
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vz *= 0.95;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.life++;

        if (p.life >= p.maxLife || p.z > 1000 || p.z < -1000) {
          Object.assign(p, initParticle());
        }

        // 3D Projection & Parallax
        const perspective = 800;
        // Shift camera based on mouse parallax
        const camX = currentMouseX.current * 200;
        const camY = currentMouseY.current * 200;
        
        // Parallax offset
        const translatedX = p.x - camX;
        const translatedY = p.y - camY;

        // Depth calculations
        const zFactor = perspective / (perspective - p.z);
        if (zFactor < 0) return; // Behind camera

        const screenX = centerX + translatedX * zFactor;
        const screenY = centerY + translatedY * zFactor;

        // Depth-based Scale (Close = big, Far = small)
        // Base zFactor is 1 at z=0. 
        // At z=400 (close), zFactor = 800/400 = 2. Scale = 1.2+
        // At z=-400 (far), zFactor = 800/1200 = 0.66. Scale = 0.4
        const particleScale = Math.max(0.1, zFactor * 0.8);
        
        // Depth-based Opacity (Close = solid, Far = faded)
        let opacity = 1;
        if (p.z < 0) opacity = Math.max(0.1, 1 + (p.z / 800)); // Fade into distance
        else opacity = Math.min(1, 1.2 - (p.z / 800)); // Fade if too close to camera
        
        // Lifecycle fade in/out
        const lifeProgress = p.life / p.maxLife;
        const lifeOpacity = Math.sin(lifeProgress * Math.PI); // 0 -> 1 -> 0

        const finalOpacity = opacity * lifeOpacity * 0.8;

        // Velocity Rotation (Math.atan2)
        const angle = Math.atan2(p.vy, p.vx);

        const screenLength = p.baseLength * particleScale;
        const screenThickness = p.baseThickness * particleScale;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(angle);
        
        ctx.globalAlpha = finalOpacity;
        
        // Simulated Blur for Z-Depth using shadow
        if (p.z < -200 || p.z > 300) {
           ctx.shadowBlur = Math.abs(p.z) * 0.01;
           ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(-screenLength / 2, -screenThickness / 2, screenLength, screenThickness, 5);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white flex flex-col items-center pt-32 pb-48 overflow-hidden min-h-[120vh]"
    >
      {/* High-Performance Canvas Particle Engine */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ filter: "contrast(1.2) saturate(1.2)" }} // Pop the colors
      />

      <div className="z-10 flex flex-col items-center text-center px-4 w-full max-w-[1400px] mx-auto">
        
        {/* Logo area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 mb-10 text-[#171717] font-medium text-lg"
        >
          <Sparkles className="w-6 h-6 text-[#2563EB]" />
          <span>TogetLink <span className="font-semibold">IdeaAI</span></span>
        </motion.div>

        {/* Huge Title */}
        <motion.h1 
          className="text-[4rem] sm:text-[5rem] lg:text-[6rem] font-medium tracking-tight text-[#171717] leading-[1.05] mb-14 w-full flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center w-full">
            {renderLine(titleLine1, 0)}
          </div>
          <div className="flex flex-wrap justify-center mt-2 w-full">
            {renderLine(titleLine2, titleLine1.length)}
          </div>
        </motion.h1>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24"
        >
          <button className="flex items-center gap-2 px-6 py-3.5 bg-[#171717] text-white rounded-full font-medium text-[15px] hover:bg-[#262626] transition-all shadow-md hover:shadow-lg">
            <Monitor className="w-4 h-4" strokeWidth={2.5} />
            Download for Windows
          </button>
          <button className="px-6 py-3.5 bg-[#f5f5f5] text-[#171717] border border-transparent hover:border-[#e5e5e5] rounded-full font-medium text-[15px] hover:bg-[#eaeaea] transition-all">
            Explore use cases
          </button>
        </motion.div>
      </div>

      {/* Scroll-scaling Video Card */}
      <motion.div 
        style={{ scale, opacity, y }}
        className="w-full max-w-6xl mx-auto px-4 z-20 sticky top-32"
      >
        <div className="w-full aspect-[16/9] bg-black rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5 relative flex items-center justify-center">
          {/* Mock Video UI / Inner Content */}
          <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col">
            {/* Fake macOS Window Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Mock Editor Area */}
            <div className="flex-1 p-8 text-white/50 font-mono text-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 text-blue-500 mx-auto opacity-50" />
                <p>Interactive Video / Demo Area</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  )
}
