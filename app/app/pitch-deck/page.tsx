"use client";
import React from 'react';
import Link from 'next/link';

export default function PitchDeck() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            Idea<span className="text-purple-500">AI</span>
          </Link>
          <div className="text-sm text-gray-400 font-mono">CONFIDENTIAL PITCH DECK</div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-32 flex flex-col gap-32">
        
        {/* Slide 1: Title */}
        <section className="min-h-[80vh] flex flex-col justify-center items-start">
          <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400 mb-8">
            Seedcamp / Plug & Play Open Call 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-tight">
            The Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Desktop Agent
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed mb-12">
            Code while you sleep. Master software architecture while you wake. A native hybrid agent preventing human skill degradation.
          </p>
          <a href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US" target="_blank" rel="noreferrer" className="bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-gray-200 transition-colors">
            View Live on Microsoft Store
          </a>
        </section>

        {/* Slide 2: The Problem */}
        <section className="border-t border-white/10 pt-32">
          <h2 className="text-sm font-mono text-purple-500 mb-4">01 / THE PROBLEM</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Web AI is destroying engineering skills.</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Current AI tools exist in web browsers. Developers are forced into an endless loop of copying and pasting code they don't fully understand.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✕</span> Loss of architectural context
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✕</span> "Developer Laziness" epidemic
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500">✕</span> Unmaintainable legacy codebases
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex items-center justify-center">
              <p className="text-2xl font-medium text-center text-gray-300 italic">
                "We are transitioning from software engineers to lazy typists."
              </p>
            </div>
          </div>
        </section>

        {/* Slide 3: The Solution */}
        <section className="border-t border-white/10 pt-32">
          <h2 className="text-sm font-mono text-blue-500 mb-4">02 / THE SOLUTION</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Native Execution + Strict Mentorship.</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-2xl mb-6">💻</div>
              <h4 className="text-xl font-bold mb-4">Native Desktop App</h4>
              <p className="text-gray-400">Not a web wrapper. Inter-process communication directly with the local file system. No copy-pasting required.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-2xl mb-6">⚡</div>
              <h4 className="text-xl font-bold mb-4">Cloud GPU Bridge</h4>
              <p className="text-gray-400">Heavy LLM reasoning offloaded to Modal cloud GPUs, seamlessly pushing architectural logic back to the local machine.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center text-2xl mb-6">🧠</div>
              <h4 className="text-xl font-bold mb-4">Anti-Laziness Engine</h4>
              <p className="text-gray-400">Forces the developer to learn. The AI acts as a strict senior mentor, explaining system design before closing the task.</p>
            </div>
          </div>
        </section>

        {/* Slide 4: Overnight Coding */}
        <section className="border-t border-white/10 pt-32">
          <h2 className="text-sm font-mono text-purple-500 mb-4">03 / CORE WORKFLOW</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Overnight Coding.</h3>
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-3xl p-12 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="text-left">
                <div className="text-sm text-purple-400 font-mono mb-2">11:00 PM</div>
                <div className="bg-black/50 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-300">"Build a SaaS authentication <br/>module in Next.js."</p>
                </div>
              </div>
              <div className="text-4xl text-gray-600">→</div>
              <div className="text-left">
                <div className="text-sm text-blue-400 font-mono mb-2">07:00 AM</div>
                <div className="bg-black/50 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-300">Fully structured, autonomously <br/>written local repository.</p>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              You sleep. The agent executes. You wake up to code written directly into your IDE, accompanied by a rigorous architectural breakdown.
            </p>
          </div>
        </section>

        {/* Slide 5: Market & Traction */}
        <section className="border-t border-white/10 pt-32">
          <h2 className="text-sm font-mono text-green-500 mb-4">04 / TRACTION</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Built by a Solo Dev. Live on MS Store.</h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <h4 className="text-3xl font-bold mb-2">Zero Capital</h4>
              <p className="text-gray-400 mb-8">Bootstrapped to a fully functional commercial deployment.</p>
              
              <h4 className="text-3xl font-bold mb-2">100% Native</h4>
              <p className="text-gray-400 mb-8">Built with Electron and IPC bridges for deep local access.</p>

              <h4 className="text-3xl font-bold mb-2">Target Market</h4>
              <p className="text-gray-400">SME / Solo Developers in the $10B+ DevTools & AI Agent TAM.</p>
            </div>
            <div className="relative h-64 bg-gradient-to-br from-gray-800 to-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
               <img src="/ms-store-badge.svg" alt="Microsoft Store" className="h-16 relative z-10" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Store_2022_logo.svg'; }} />
            </div>
          </div>
        </section>

        {/* Slide 6: The Vision */}
        <section className="border-t border-white/10 pt-32 text-center">
          <h2 className="text-sm font-mono text-purple-500 mb-4">05 / 10-YEAR VISION</h2>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 max-w-4xl mx-auto">
            From Lazy Typists to Master Architects.
          </h3>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
            In ten years, AI will execute all heavy coding tasks. IdeaAI prevents the collapse of human engineering skills by strictly mentoring developers as it builds their infrastructure. We don't just write code; we build the architects of the future.
          </p>
          <div className="inline-block border border-white/20 bg-white/5 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="font-bold text-lg mb-2">The Ask</div>
            <p className="text-gray-400">Raising Pre-Seed to scale GTM, run aggressive performance marketing, and acquire our first 10,000 active developers.</p>
          </div>
        </section>

      </main>
    </div>
  );
}
