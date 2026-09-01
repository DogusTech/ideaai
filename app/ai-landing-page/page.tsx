"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Layers, Shield, Code2, Play } from 'lucide-react';

export default function IdeaAILanding() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900" style={{ fontFamily: '"Google Sans Flex", sans-serif' }}>
      {/* Retaining the Google Fonts specifically requested to keep the typography quality identical */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@8..144,-10..0,25..150,400..500,0..100&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital@0;1&display=swap" rel="stylesheet" />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            IdeaAI
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#vision" className="hover:text-zinc-900 transition-colors">Vision</a>
            <a href="#features" className="hover:text-zinc-900 transition-colors">Platform</a>
            <a href="#security" className="hover:text-zinc-900 transition-colors">Enterprise</a>
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
      <section className="pt-36 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Introducing the Zero-State UI</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-zinc-900 mb-6 leading-[1.05]"
            style={{ fontVariationSettings: '"wght" 700' }}
          >
            Intelligence that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              executes for you.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 mb-10 leading-relaxed font-medium"
          >
            IdeaAI is the first agentic workspace that moves beyond conversational chat. We don't just generate code or text; we execute, deploy, and manage your workflows autonomously.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="h-14 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
              Start building free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-14 px-8 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium text-lg transition-all active:scale-95">
              Read the manifesto
            </button>
          </motion.div>
        </div>
      </section>

      {/* Video Placeholder Section */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full aspect-video rounded-[2.5rem] bg-zinc-50 border border-zinc-200/80 shadow-2xl overflow-hidden group cursor-pointer"
          >
            {/* Minimalist Placeholder Design */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out">
                <Play className="w-10 h-10 text-indigo-600 ml-2" fill="currentColor" />
              </div>
              <p className="mt-8 text-zinc-400 font-medium tracking-tight text-lg">Product Demo Video (Coming Soon)</p>
            </div>
            
            {/* Future image/video will go here */}
            {/* <img src="/demo.webp" alt="IdeaAI Interface" className="absolute inset-0 w-full h-full object-cover" /> */}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features - Clean, Google-Inspired, but Unique */}
      <section id="features" className="py-32 bg-[#f8f9fa] px-6 rounded-[3rem] mx-2 md:mx-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6" style={{ fontVariationSettings: '"wght" 700' }}>
              A new paradigm of work.
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Built from the ground up to replace outdated AI assistants with autonomous agents that act on your behalf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <Zap className="w-12 h-12 text-indigo-500 mb-8" />
              <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight" style={{ fontVariationSettings: '"wght" 700' }}>
                Zero-State UI Architecture
              </h3>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-lg mb-10 font-medium">
                Stop starting from a blank prompt. Our interface anticipates your needs, providing contextual actions, codebase insights, and one-click deployment pipelines before you even ask.
              </p>
              <div className="w-full h-56 bg-[#f8f9fa] rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 text-sm font-medium">
                [ UI Screenshot Placeholder ]
              </div>
            </motion.div>

            {/* Square Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <Code2 className="w-12 h-12 text-violet-500 mb-8" />
                <h3 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight" style={{ fontVariationSettings: '"wght" 700' }}>
                  Agentic Velocity
                </h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  IdeaAI doesn't just suggest code. It runs tests, reads error logs, and iterates on its own until the build is green. True autonomous execution.
                </p>
              </div>
            </motion.div>

            {/* Square Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <Layers className="w-12 h-12 text-blue-500 mb-8" />
              <h3 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight" style={{ fontVariationSettings: '"wght" 700' }}>
                Seamless Integration
              </h3>
              <p className="text-zinc-500 leading-relaxed font-medium">
                Connects directly to your GitHub, Vercel, and AWS. We act as a silent mid-layer that securely orchestrates your entire infrastructure.
              </p>
            </motion.div>

            {/* Large Card Bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-zinc-900 rounded-[2rem] p-8 md:p-12 border border-zinc-800 shadow-xl text-white overflow-hidden relative"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/40 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <Shield className="w-12 h-12 text-indigo-400 mb-8" />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight" style={{ fontVariationSettings: '"wght" 700' }}>
                  Enterprise-Grade Security
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mb-10 font-medium">
                  Your code never leaves your VPC. We offer on-prem deployment for enterprise teams who require absolute data sovereignty and SOC2 compliance out of the box.
                </p>
                <div className="flex gap-4">
                  <span className="px-5 py-2.5 rounded-full bg-white/10 text-sm font-medium border border-white/10 backdrop-blur-md">SOC2 Type II</span>
                  <span className="px-5 py-2.5 rounded-full bg-white/10 text-sm font-medium border border-white/10 backdrop-blur-md">GDPR Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-8" style={{ fontVariationSettings: '"wght" 700' }}>
            Ready to scale your ideas?
          </h2>
          <p className="text-xl text-zinc-500 mb-12 font-medium">
            Join the waitlist to get early access to the Zero-State Agentic Workspace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="h-14 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-lg transition-all active:scale-95 shadow-lg">
              Request Early Access
            </button>
            <button className="h-14 px-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-lg transition-all active:scale-95">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-100 bg-white pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Aeternexus, Inc.
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
