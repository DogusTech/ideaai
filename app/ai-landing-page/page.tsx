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
            className="max-w-3xl mx-auto text-lg md:text-xl text-zinc-500 mb-12 leading-relaxed font-medium"
          >
            The world's first <strong>Hybrid Autonomous AI Coding Agent</strong>. IdeaAI runs as a native desktop client while you work, and seamlessly transforms into a cloud-based CI/CD bot executing via GitHub and Railway when you sleep. Governed by a single <strong>Constitutional Prompt</strong> and powered by our custom-trained <strong>Llama 3</strong> engine on Modal servers, it reads, writes, and debugs code 24/7 without needing conversational chat.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
          >
            <a href="https://github.com/DogusTech/togetlink-ui/releases/download/v0.1.5/TogetLink.IdeaAI.Setup.0.1.5.exe" className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 rounded-full text-base font-medium transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4 24H0V11.4H11.4V24ZM24 24H12.6V11.4H24V24ZM11.4 10.6H0V0H11.4V10.6ZM24 10.6H12.6V0H24V10.6Z"/>
              </svg>
              Download for Windows
            </a>
            
            <a 
              href="/redeem" 
              className="w-full sm:w-auto bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 px-8 py-4 rounded-full text-base font-medium transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              Redeem AppSumo Code
            </a>
          </motion.div>
          
          {/* Product Hunt Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="mt-8 flex justify-center w-full"
          >
            <a href="https://www.producthunt.com/products/togetlink-ideaai?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-togetlink-ideaai" target="_blank" rel="noopener noreferrer">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1257388&amp;theme=neutral&amp;t=1790010465665" alt="Togetlink IdeaAI - The autonomous AI coding agent that lives on your desktop. | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
            </a>
          </motion.div>
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
                text="The Only Hybrid AI Agent: Desktop + Cloud Autonomy." 
                className="text-4xl md:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-tight"
                style={{ fontVariationSettings: '"wght" 650' }}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              
              <div>
                <AIFastTyping 
                  text="Constitutional Prompt (Zero-State)" 
                  className="text-2xl md:text-3xl text-zinc-900 mb-6 block tracking-tight"
                  style={{ fontVariationSettings: '"wght" 600' }}
                  delay={0.2}
                />
                <AIFastTyping 
                  text="Unlike ChatGPT or Claude wrappers that require constant conversational babysitting, IdeaAI operates on a single 'Constitutional Prompt'. You define the master rules and architecture once, and the agent executes autonomously within those boundaries forever." 
                  className="text-lg text-zinc-500 leading-relaxed font-medium block"
                  delay={0.6}
                />
              </div>

              <div>
                <AIFastTyping 
                  text="Dual-Engine: Local + CI/CD Bot" 
                  className="text-2xl md:text-3xl text-zinc-900 mb-6 block tracking-tight"
                  style={{ fontVariationSettings: '"wght" 600' }}
                  delay={0.4}
                />
                <AIFastTyping 
                  text="When your PC is on, IdeaAI uses an advanced Electron IPC Bridge to read, write, and execute commands directly on your local machine. When you sleep, it seamlessly switches to a cloud-based CI/CD bot, pulling from GitHub and pushing autonomous fixes overnight via Railway." 
                  className="text-lg text-zinc-500 leading-relaxed font-medium block"
                  delay={0.8}
                />
              </div>

              <div className="md:col-span-2 max-w-2xl">
                <AIFastTyping 
                  text="Custom Llama 3 on Modal Servers" 
                  className="text-2xl md:text-3xl text-zinc-900 mb-6 block tracking-tight"
                  style={{ fontVariationSettings: '"wght" 600' }}
                  delay={0.6}
                />
                <AIFastTyping 
                  text="We don't just route your data to standard APIs. IdeaAI is powered by our heavily fine-tuned Llama 3 model hosted on high-performance Modal serverless GPU clusters. This ensures lightning-fast execution, agentic reasoning tailored for software engineering, and absolute data privacy." 
                  className="text-lg text-zinc-500 leading-relaxed font-medium block"
                  delay={1.0}
                />
              </div>
              
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-indigo-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 15 80 Q 50 10, 85 80" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
                </svg>
                <span className="font-bold text-xl tracking-tight text-zinc-900">IdeaAI</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
                The autonomous execution engine for elite engineering teams. Stop typing, start shipping.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://twitter.com/togetlink" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="https://github.com/DogusTech" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-zinc-900 mb-4 text-sm tracking-wide">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Download App</a></li>
                <li><a href="/redeem" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Redeem AppSumo Code</a></li>
                <li><a href="/login" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Sign In</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 mb-4 text-sm tracking-wide">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/legal/privacy-policy" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Privacy Policy</a></li>
                <li><a href="/legal/terms" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Terms of Service</a></li>
                <li><a href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-zinc-400">
                © {new Date().getFullYear()} Aeternexus, Inc. (TogetLink). All rights reserved.
              </p>
              <a href="https://althunt.io/compare/ideaai-vs-cursor" target="_blank" rel="noopener noreferrer">
                <img src="https://althunt.io/badges/featured-light.svg" alt="Featured on AltHunt" width="130" height="28" />
              </a>
              <a href="https://alternativeto.net/software/ideaai/about/?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer">
                <img src="https://alternativeto.net/static/badges/badge-compact-light.svg" alt="IdeaAI | AlternativeTo" width="130" height="44" style={{ width: '130px', height: 'auto' }} />
              </a>
            </div>
            <p className="text-sm text-zinc-400">
              Made with <span className="text-red-500">♥</span> for developers.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
