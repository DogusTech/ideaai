"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

// GSAP Akıcılığında (Spring Physics) çalışan "Agentic Galaxy/Vortex" Parçacık Sistemi
// Antigravity'deki dash (çizgi) tarzını alıp, tamamen fareyle etkileşimli özgün bir galaksiye çevirdik.
const InteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const globe = useRef({ x: -1000, y: -1000 }); // Galaksinin (kürenin) merkezi

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Antigravity benzeri (soldan sağa sıcak-soğuk geçişi) IdeaAI renk paleti
    const colorPalette = ['#f59e0b', '#ec4899', '#d946ef', '#8b5cf6', '#4f46e5', '#3b82f6'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 1.2;
      // İlk açılışta galaksiyi merkeze koy
      if (globe.current.x === -1000) {
        globe.current = { x: canvas.width / 2, y: canvas.height / 2 };
        mouse.current = { x: canvas.width / 2, y: canvas.height / 2 };
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    class DashParticle {
      angle: number; distance: number; length: number; width: number;
      speed: number; phase: number; zOffset: number; colorIndex: number;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        // Küre/Galaksi içinde dağılım (Dışa doğru seyrekleşen)
        this.distance = Math.pow(Math.random(), 0.6) * (Math.min(canvas.width, canvas.height) * 0.7); 
        
        // 2. ekran görüntüsündeki gibi minik çizgiler (dash)
        this.length = Math.random() * 8 + 4;
        this.width = Math.random() * 1.5 + 1;
        
        // Galaksinin dönüş hızı (içtekiler daha hızlı dönebilir, rastgele yön)
        this.speed = (Math.random() * 0.0015 + 0.0002) * (Math.random() > 0.5 ? 1 : -1);
        
        this.phase = Math.random() * Math.PI * 2;
        this.zOffset = Math.random() * 25 + 5; // Nefes alma (pulse) derinliği
        
        // Rengi açısına göre belirle (Solda sıcak, sağda soğuk renkler gibi gradyan hissi)
        this.colorIndex = Math.floor(((Math.cos(this.angle) + 1) / 2) * (colorPalette.length - 1));
      }
      
      update() {
        this.angle += this.speed;
        this.phase += 0.02; // Nefes alma hızı
        // Renk indeksini dönüşe göre dinamik güncelle (renkler de döner)
        this.colorIndex = Math.floor(((Math.cos(this.angle) + 1) / 2) * (colorPalette.length - 0.1));
      }
      
      draw(gx: number, gy: number) {
        if (!ctx) return;
        
        // Nefes alan (büyüyüp küçülen) galaksi çapı
        const currentDist = this.distance + Math.sin(this.phase) * this.zOffset;
        
        const x = gx + Math.cos(this.angle) * currentDist;
        const y = gy + Math.sin(this.angle) * currentDist;
        
        // Çizgilerin yönü merkeze teğet (Vortex / Küre görünümü oluşturur)
        // Hafif bir dalgalanma (wobble) ekleyerek mükemmel organik hissi yakalıyoruz
        const dashAngle = this.angle + Math.PI / 2 + Math.sin(this.phase) * 0.1;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(dashAngle);
        
        // Parlayıp sönme (Twinkle) efekti
        ctx.globalAlpha = 0.15 + Math.max(0, Math.sin(this.phase) * 0.6); 
        ctx.fillStyle = colorPalette[this.colorIndex];
        
        ctx.beginPath();
        ctx.roundRect(-this.length/2, -this.width/2, this.length, this.width, 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: DashParticle[] = [];
    // Çok yoğun bir küre için 400 parça
    for (let i = 0; i < 400; i++) particles.push(new DashParticle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // GSAP "Ease-Out" tarzı, galaksinin merkezinin fareyi pürüzsüz takip etmesi
      globe.current.x += (mouse.current.x - globe.current.x) * 0.04;
      globe.current.y += (mouse.current.y - globe.current.y) * 0.04;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(globe.current.x, globe.current.y);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// Yapay Zeka Dinamik Yazma (Typing) Efekti
const AIFastTyping = ({ text, className, delay = 0, style }: { text: string, className?: string, delay?: number, style?: React.CSSProperties }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.03, delayChildren: delay } // Yapay zeka hızında kelime basma
        }
      }}
      className={className}
      style={style}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, filter: 'blur(4px)', y: 10 },
            visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.2 } }
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function IdeaAILanding() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative" style={{ fontFamily: '"Google Sans Flex", sans-serif' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@8..144,-10..0,25..150,400..500,0..100&display=swap" rel="stylesheet" />
      
      {/* Antigravity tarzı dinamik parçacıklar - Fare etkileşimli */}
      <InteractiveParticles />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-zinc-100/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
             IdeaAI
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">Sign In</a>
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-7xl mx-auto text-center relative w-full flex flex-col items-center">
          
          {/* Logo + TogetLink IdeaAI - Küçük "Badge" Stili (Antigravity referansı) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center gap-2 md:gap-3 mb-8"
          >
            {/* Küçük logo */}
            <svg viewBox="0 0 100 100" className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 15 80 Q 50 10, 85 80" stroke="#4f46e5" strokeWidth="16" strokeLinecap="round" />
            </svg>
            <div className="text-xl md:text-2xl flex gap-1.5 text-zinc-900 tracking-tight leading-none">
               <span style={{ fontVariationSettings: '"wght" 600' }}>TogetLink</span>
               <span style={{ fontVariationSettings: '"wght" 400' }} className="text-zinc-700">IdeaAI</span>
            </div>
          </motion.div>

          {/* Dinamik Daktilo - Ana Slogan (Gerçek H1 büyüklüğünde) */}
          <AIFastTyping 
            text="Experience liftoff with the next-gen agent platform" 
            className="text-5xl md:text-6xl lg:text-[76px] text-zinc-900 mb-8 leading-[1.05] max-w-5xl mx-auto tracking-tight"
            style={{ fontVariationSettings: '"wght" 450' }}
            delay={0.3}
          />

          <motion.p 
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 mb-12 leading-relaxed font-medium"
          >
            The world's most capable autonomous execution engine. Built for velocity, precision, and zero-state architecture.
          </motion.p>
        </div>
      </section>

      {/* Video Placeholder Section */}
      <section className="px-6 pb-32 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full aspect-video rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-zinc-200/80 shadow-2xl overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50/80 to-zinc-100/80">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out">
                <Play className="w-10 h-10 text-indigo-600 ml-2" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Neden Tercih Edilmeliyiz - AI Dynamic Terminal Stream */}
      <section className="py-32 bg-[#f8f9fa] relative z-10 rounded-t-[4rem] border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-6">
           <div className="mb-24">
              <motion.span 
                initial={{ opacity: 0 }} 
                whileInView={{ opacity: 1 }} 
                className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-6 block"
              >
                Output Stream // 01
              </motion.span>
              
              <AIFastTyping 
                text="The Intelligence That Actually Executes." 
                className="text-4xl md:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-tight"
                style={{ fontVariationSettings: '"wght" 650' }}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              
              <div>
                <AIFastTyping 
                  text="Zero-State Architecture" 
                  className="text-2xl md:text-3xl text-zinc-900 mb-6 block tracking-tight"
                  style={{ fontVariationSettings: '"wght" 600' }}
                  delay={0.2}
                />
                <AIFastTyping 
                  text="Stop starting from a blank prompt. IdeaAI anticipates context, understands your codebase instantly, and offers executable solutions before you even ask. The future isn't conversational; it's proactive." 
                  className="text-lg text-zinc-500 leading-relaxed font-medium block"
                  delay={0.6}
                />
              </div>

              <div>
                <AIFastTyping 
                  text="Agentic Velocity" 
                  className="text-2xl md:text-3xl text-zinc-900 mb-6 block tracking-tight"
                  style={{ fontVariationSettings: '"wght" 600' }}
                  delay={0.4}
                />
                <AIFastTyping 
                  text="IdeaAI doesn't just suggest code snippets. It runs tests, reads error logs, fixes bugs, and deploys. We designed an engine that iterates autonomously until your build is perfectly green." 
                  className="text-lg text-zinc-500 leading-relaxed font-medium block"
                  delay={0.8}
                />
              </div>

              <div className="md:col-span-2 max-w-2xl">
                <AIFastTyping 
                  text="Uncompromised Security" 
                  className="text-2xl md:text-3xl text-zinc-900 mb-6 block tracking-tight"
                  style={{ fontVariationSettings: '"wght" 600' }}
                  delay={0.6}
                />
                <AIFastTyping 
                  text="Enterprise-grade out of the box. Your proprietary code never trains public models. We provide complete VPC isolation, SOC2 Type II compliance, and granular role-based access controls for elite engineering teams." 
                  className="text-lg text-zinc-500 leading-relaxed font-medium block"
                  delay={1.0}
                />
              </div>
              
           </div>
        </div>
      </section>

    </div>
  );
}
