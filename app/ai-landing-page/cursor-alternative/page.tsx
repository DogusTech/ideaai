"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function CursorAlternativePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Navbar (Simplified for this landing page) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            IdeaAI
          </a>
          <a href="/login" className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all">
            Get Started Free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            The Next-Gen Cursor Alternative
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Beyond Autocomplete.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Meet True Autonomy.</span>
          </h1>
          <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            While Cursor is a great IDE extension for inline edits, IdeaAI is a native desktop agent that autonomously reads, plans, and executes across your entire codebase.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/" className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2">
              Try IdeaAI Today <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-zinc-50 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">IdeaAI vs Cursor</h2>
            <p className="text-zinc-500">Why top developers are upgrading to an autonomous desktop agent.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
            <div className="grid grid-cols-3 border-b border-zinc-100 bg-zinc-50/50">
              <div className="p-6 text-left font-semibold text-zinc-500">Feature</div>
              <div className="p-6 text-center font-bold text-zinc-400">Cursor</div>
              <div className="p-6 text-center font-bold text-indigo-600 text-lg bg-indigo-50/30">IdeaAI</div>
            </div>

            {[
              { name: 'AI Autocomplete', cursor: true, ideaai: true },
              { name: 'Inline Chat', cursor: true, ideaai: true },
              { name: 'Autonomous Execution', cursor: false, ideaai: true },
              { name: 'Native Desktop Agent', cursor: false, ideaai: true },
              { name: 'Overnight Coding Mode', cursor: false, ideaai: true },
              { name: 'Zero-State Architecture', cursor: false, ideaai: true },
              { name: 'Cross-IDE Independence', cursor: false, ideaai: true },
            ].map((feature, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors">
                <div className="p-6 flex items-center font-medium text-zinc-700">{feature.name}</div>
                <div className="p-6 flex items-center justify-center">
                  {feature.cursor ? <CheckCircle2 className="w-6 h-6 text-zinc-300" /> : <XCircle className="w-6 h-6 text-zinc-200" />}
                </div>
                <div className="p-6 flex items-center justify-center bg-indigo-50/10">
                  {feature.ideaai ? <CheckCircle2 className="w-6 h-6 text-indigo-500" /> : <XCircle className="w-6 h-6 text-zinc-200" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to upgrade your workflow?</h2>
        <p className="text-xl text-zinc-500 mb-10">Join the developers shifting from IDE plugins to autonomous agents.</p>
        <a href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-xl shadow-indigo-200 inline-flex items-center gap-2">
          Start Building with IdeaAI
        </a>
      </section>
    </div>
  );
}
