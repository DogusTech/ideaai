import React from 'react';

export default function PitchDeck() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-sans selection:bg-black selection:text-white pb-20">
      
      {/* Print button (hidden when printing) */}
      <div className="fixed top-4 right-4 print:hidden z-50">
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black/80 transition-colors shadow-lg"
        >
          Save as PDF
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #E5E5E5 !important; }
          .slide-container { page-break-after: always; box-shadow: none !important; margin: 0 !important; width: 100vw !important; height: 100vh !important; }
        }
      `}} />

      <div className="max-w-[1120px] mx-auto space-y-12 pt-12 print:pt-0 print:space-y-0">
        
        {/* SLIDE 1: Cover */}
        <section className="slide-container relative w-full aspect-[16/9] bg-black text-white overflow-hidden shadow-2xl print:shadow-none flex flex-col justify-between p-16 group">
          {/* Abstract Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)' }} />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">I</div>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">A</div>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">I</div>
            </div>
            <div className="text-sm font-mono text-white/60 tracking-widest uppercase">October 2026</div>
          </div>

          <div className="relative z-10 mt-auto mb-12">
            <h1 className="text-7xl font-extrabold tracking-tighter mb-4">IdeaAI</h1>
            <p className="text-xl font-light tracking-widest uppercase text-white/70">The Autonomous Local Mentor</p>
          </div>

          <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-6">
            <div className="text-sm font-mono text-white/50">Pitch Deck Presentation</div>
            <div className="text-sm font-mono text-white/50">ideaai.togetlink.com</div>
          </div>
        </section>

        {/* SLIDE 2: The Problem */}
        <section className="slide-container w-full aspect-[16/9] bg-white text-black shadow-2xl print:shadow-none p-16 flex flex-col">
          <div className="flex justify-between items-start mb-16">
            <h2 className="text-4xl font-bold tracking-tight uppercase">The Problem</h2>
            <div className="text-4xl font-light text-black/20">01</div>
          </div>
          
          <div className="grid grid-cols-2 gap-16 flex-1">
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">1</div>
                  <h3 className="text-2xl font-bold">"Black Box" Laziness</h3>
                </div>
                <p className="text-black/70 text-lg leading-relaxed pl-16">
                  Current AI tools just spit out code. Developers copy-paste without understanding the underlying architecture, leading to massive technical debt.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">2</div>
                  <h3 className="text-2xl font-bold">Cloud Privacy Risks</h3>
                </div>
                <p className="text-black/70 text-lg leading-relaxed pl-16">
                  Sending proprietary enterprise codebases to external APIs is a security nightmare. Teams need localized execution.
                </p>
              </div>
            </div>

            <div className="bg-[#F8F8F8] border border-black/10 flex items-center justify-center p-8 relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
               <div className="text-center relative z-10">
                 <div className="text-6xl font-black mb-4">90%</div>
                 <div className="text-lg text-black/60 uppercase tracking-widest font-semibold">Of AI-generated code<br/>is never refactored</div>
               </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3: The Solution (Day Shift) */}
        <section className="slide-container w-full aspect-[16/9] bg-white text-black shadow-2xl print:shadow-none p-16 flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <h2 className="text-4xl font-bold tracking-tight uppercase">The Solution: Day Shift</h2>
            <div className="text-4xl font-light text-black/20">02</div>
          </div>
          
          <div className="grid grid-cols-12 gap-12 flex-1">
            <div className="col-span-5 flex flex-col justify-center border-r border-black/10 pr-12">
              <h3 className="text-3xl font-bold mb-6">Zero-State Architecture</h3>
              <p className="text-lg text-black/70 leading-relaxed mb-8">
                IdeaAI runs completely local on your desktop. It connects directly to your terminal and file system.
              </p>
              <div className="inline-block border-2 border-black px-6 py-3 text-sm font-bold uppercase tracking-widest w-max">
                Fine-tuned LLaMA 3.2
              </div>
            </div>

            <div className="col-span-7 flex flex-col justify-center pl-4">
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex-shrink-0 flex items-center justify-center font-bold text-xl">M</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">The Mentor Protocol</h4>
                    <p className="text-black/60">Before writing a single line of code, the AI explains the theoretical architecture. It teaches you how it works, preventing developer stagnation.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex-shrink-0 flex items-center justify-center font-bold text-xl">E</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Autonomous Execution</h4>
                    <p className="text-black/60">No more copy-pasting. IdeaAI executes terminal commands and modifies files directly in your IDE via a secure local IPC bridge.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4: The Night Shift */}
        <section className="slide-container w-full aspect-[16/9] bg-black text-white shadow-2xl print:shadow-none p-16 flex flex-col relative overflow-hidden">
          {/* Subtle starry background for night theme */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          
          <div className="relative z-10 flex justify-between items-start mb-16">
            <h2 className="text-4xl font-bold tracking-tight uppercase">The "Night Shift"</h2>
            <div className="text-4xl font-light text-white/20">03</div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-16 flex-1 items-center">
            <div>
              <h3 className="text-5xl font-black mb-8 leading-tight">Sleep While<br/>Your AI Codes.</h3>
              <p className="text-white/70 text-xl leading-relaxed mb-8 font-light">
                Set a high-level architectural goal before bed. IdeaAI works autonomously overnight to complete massive refactors or migrations.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/20 p-10 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-green-400 font-mono mt-1">✓</span>
                  <span className="text-white/90 text-lg">Strict deterministic prompting overnight</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-green-400 font-mono mt-1">✓</span>
                  <span className="text-white/90 text-lg">Drastically reduced hallucination rates</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-green-400 font-mono mt-1">✓</span>
                  <span className="text-white/90 text-lg">Wake up to a full architectural report</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SLIDE 5: Business Model & Vision */}
        <section className="slide-container w-full aspect-[16/9] bg-white text-black shadow-2xl print:shadow-none p-16 flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <h2 className="text-4xl font-bold tracking-tight uppercase">Traction & Vision</h2>
            <div className="text-4xl font-light text-black/20">04</div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 flex-1">
            <div className="border border-black/10 p-8 flex flex-col">
              <div className="text-5xl font-black mb-6 border-b border-black/10 pb-6">B2D</div>
              <h4 className="text-xl font-bold mb-4">Guerrilla Marketing</h4>
              <p className="text-black/60 flex-1">
                Zero-budget "Build in Public" strategy. Viral organic growth through X (Twitter) and LinkedIn by speaking directly to developer pain points.
              </p>
            </div>
            
            <div className="border border-black/10 p-8 flex flex-col bg-black text-white transform scale-105 shadow-xl">
              <div className="text-5xl font-black mb-6 border-b border-white/20 pb-6">Solo</div>
              <h4 className="text-xl font-bold mb-4">Technical Founder</h4>
              <p className="text-white/70 flex-1">
                No bloated teams. High-velocity shipping. Pure engineering focus with a minimalist, elite SaaS design language.
              </p>
            </div>
            
            <div className="border border-black/10 p-8 flex flex-col">
              <div className="text-5xl font-black mb-6 border-b border-black/10 pb-6">Seed</div>
              <h4 className="text-xl font-bold mb-4">The Ask</h4>
              <p className="text-black/60 flex-1">
                Raising capital to expand local LLM capabilities, refine the Night Shift deterministic engine, and capture the enterprise security market.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
