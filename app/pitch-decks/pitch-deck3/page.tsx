"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  ShieldCheck,
  Cpu,
  GitBranch,
  Terminal,
  Users,
  Target,
  Layers,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  Globe,
  Lock,
} from "lucide-react";

export default function PitchDeck3Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 9;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] text-[#1E293B] font-sans antialiased selection:bg-[#3B66B8] selection:text-white print:bg-white">
      {/* Print & Slide Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: 1280px 720px;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .slide-wrapper {
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
            width: 1280px !important;
            height: 720px !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Top Navigation Bar (Hidden on Print) */}
      <header className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#3B66B8] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <span className="font-bold text-gray-900">Aeternexus, Inc.</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-[#3B66B8] font-medium">
              IdeaAI Pitch Deck ({currentSlide + 1} / {totalSlides})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="hidden md:flex items-center gap-1 px-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx
                    ? "w-6 bg-[#3B66B8]"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentSlide((p) => Math.min(p + 1, totalSlides - 1))
            }
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrintPdf}
            className="ml-3 flex items-center gap-2 bg-[#3B66B8] hover:bg-[#2E5299] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Export PDF (16:9)
          </button>
        </div>
      </header>

      {/* Main Presentation Stage */}
      <main className="py-8 px-4 flex flex-col items-center gap-8 print:p-0 print:block">
        {/* ===================================================================== */}
        {/* SLIDE 1: COVER SLIDE (Split Visual + Solid Cobalt Blue Block)         */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden grid grid-cols-12 ${
            currentSlide === 0 ? "block" : "hidden"
          }`}
        >
          {/* Left Visual Column */}
          <div className="col-span-5 bg-[#F1F5F9] relative flex flex-col justify-between p-10 border-r border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#3B66B8] text-white font-bold rounded flex items-center justify-center text-lg">
                A
              </div>
              <span className="font-bold tracking-tight text-gray-800 text-lg">
                AETERNEXUS, INC.
              </span>
            </div>

            {/* Clean Architectural Mockup Illustration */}
            <div className="my-auto relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#7CC1E8] rounded-xl" />
              <div className="relative bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3B66B8] border border-blue-200">
                    100% AIR-GAPPED LOCAL
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono text-gray-600">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>PrivacyGuard: 0 External Egress</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3B66B8]">
                    <GitBranch className="w-4 h-4" />
                    <span>Sandbox: ideaai/auto-overnight</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Cpu className="w-4 h-4" />
                    <span>Open-Weights Hub: Local Ollama</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Live on Microsoft Store</span>
                  <span className="font-bold text-gray-800">266 Active Users</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 font-medium">
              Delaware C-Corporation • ideaai.togetlink.com
            </div>
          </div>

          {/* Right White + Cobalt Blue Block Column */}
          <div className="col-span-7 flex flex-col justify-between py-10">
            <div className="px-12 flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
              <span>Investor & Accelerator Deck</span>
              <span>2026</span>
            </div>

            {/* Solid Cobalt Blue Hero Banner matching template */}
            <div className="bg-[#3B66B8] text-white px-14 py-14 my-auto shadow-sm">
              <p className="text-[#7CC1E8] font-semibold tracking-wider uppercase text-sm mb-3">
                Aeternexus, Inc. Presents
              </p>
              <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-4">
                IdeaAI Pitch Deck
              </h1>
              <p className="text-blue-100 text-xl font-light max-w-xl leading-relaxed">
                100% Local, Privacy-First Autonomous AI Software Engineering
                Agent for Desktop.
              </p>
            </div>

            <div className="px-12 flex items-center justify-between text-sm text-gray-500">
              <span>Founder & CEO: Dogus Yilmaz</span>
              <span className="text-[#3B66B8] font-semibold">
                Zero Cloud Dependency • Overnight Autonomy
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 2: CUSTOMERS (Target Segments & Live Traction)                  */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden p-14 flex flex-col justify-between ${
            currentSlide === 1 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Target <span className="text-[#3B66B8]">Customers</span>
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-2xl">
                Serving developers and organizations blocked from adopting cloud
                AI tools due to IP security, compliance, and recurring API costs.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8] bg-blue-50 px-3 py-1.5 rounded-full">
              01 • Customers & Traction
            </span>
          </div>

          {/* 3-Column Card Layout matching "Our Services" template */}
          <div className="grid grid-cols-3 gap-7 my-auto">
            <div className="bg-[#7CC1E8] text-white rounded-xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Regulated Enterprises
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Defense, FinTech, Healthcare, and legal engineering teams
                  operating under strict NDA, HIPAA, SOC2, or air-gapped
                  security mandates where source code cannot touch external
                  cloud APIs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/25 text-xs font-semibold uppercase tracking-wider">
                Primary B2B Expansion Segment
              </div>
            </div>

            <div className="bg-[#3B66B8] text-white rounded-xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center mb-6">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Privacy-First Developers
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Independent software engineers, startup founders, and local-AI
                  builders seeking autonomous multi-file coding without
                  $20–$200/month subscriptions or token throttling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 text-xs font-semibold uppercase tracking-wider">
                Core Early-Adopter Base
              </div>
            </div>

            <div className="bg-[#2C3E50] text-white rounded-xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Workstation & GPU Owners
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Developers equipped with consumer GPUs (4GB+ VRAM) or
                  high-RAM workstations who want to run open-weights models
                  (Llama, Qwen2.5-Coder, DeepSeek) natively on their hardware.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15 text-xs font-semibold uppercase tracking-wider">
                Hardware-Adaptive Tier Users
              </div>
            </div>
          </div>

          {/* Bottom Traction Metrics Strip */}
          <div className="grid grid-cols-4 gap-4 bg-[#F8FAFC] border border-gray-200 rounded-xl p-5">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Distribution Channel
              </p>
              <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                Live on Microsoft Store
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Active User Base
              </p>
              <p className="text-lg font-extrabold text-[#3B66B8] mt-0.5">
                266+ Active Users
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Daily Engagement
              </p>
              <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                92 DAU (~34.5% Stickiness)
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Customer Acquisition Cost
              </p>
              <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
                $0 Organic Growth
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 3: PROBLEM YOU WANT TO SOLVE                                    */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden p-14 flex flex-col justify-between ${
            currentSlide === 2 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                The <span className="text-[#3B66B8]">Problem</span>
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-2xl">
                Current AI coding assistants force an unacceptable trade-off
                between developer productivity and source-code sovereignty.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8] bg-blue-50 px-3 py-1.5 rounded-full">
              02 • Problem Statement
            </span>
          </div>

          <div className="grid grid-cols-12 gap-10 items-center my-auto">
            {/* Left Overlapping Venn Infographic matching top-left slide in template */}
            <div className="col-span-5 flex items-center justify-center relative py-6">
              <div className="relative w-80 h-80">
                <div className="absolute top-0 left-8 w-44 h-44 rounded-full bg-[#7CC1E8]/85 text-white flex flex-col items-center justify-center p-5 text-center shadow-md">
                  <Lock className="w-6 h-6 mb-1.5" />
                  <span className="font-bold text-sm">IP & Data Exposure</span>
                </div>
                <div className="absolute top-12 right-2 w-44 h-44 rounded-full bg-[#3B66B8]/90 text-white flex flex-col items-center justify-center p-5 text-center shadow-md">
                  <Cpu className="w-6 h-6 mb-1.5" />
                  <span className="font-bold text-sm">Cloud Token Taxes</span>
                </div>
                <div className="absolute bottom-2 left-16 w-44 h-44 rounded-full bg-[#2C3E50]/90 text-white flex flex-col items-center justify-center p-5 text-center shadow-md">
                  <GitBranch className="w-6 h-6 mb-1.5" />
                  <span className="font-bold text-sm">Unsafe Autonomy</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-center border-2 border-[#3B66B8]">
                  <span className="text-[11px] font-extrabold text-gray-900 leading-tight">
                    AI Adoption Bottleneck
                  </span>
                </div>
              </div>
            </div>

            {/* Right Numbered Pain Points matching "Our Mission" numbered list */}
            <div className="col-span-7 space-y-6">
              <div className="flex items-start gap-5 p-5 rounded-xl border border-gray-100 bg-[#F8FAFC]">
                <div className="w-10 h-10 rounded-full bg-[#3B66B8] text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Proprietary Source Code Leaks to Cloud APIs
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Tools like Copilot, Cursor, and Devin stream repositories,
                    environment variables, and proprietary logic to third-party
                    cloud endpoints—violating enterprise compliance and strict
                    NDA boundaries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 rounded-xl border border-gray-100 bg-[#F8FAFC]">
                <div className="w-10 h-10 rounded-full bg-[#3B66B8] text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Unpredictable Subscription & API Rate Limits
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Autonomous agentic loops burn millions of tokens per night.
                    Cloud agents charge $20–$500/month and throttle heavy
                    refactoring workflows right when developers need scale.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 rounded-xl border border-gray-100 bg-[#F8FAFC]">
                <div className="w-10 h-10 rounded-full bg-[#3B66B8] text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Local Models Crash or Corrupt Working Branches
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Running open-weights models manually causes GPU out-of-memory
                    (OOM) crashes, and unguarded agents can overwrite uncommitted
                    code without verification or rollback safety.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 flex justify-between border-t border-gray-100 pt-4">
            <span>Aeternexus, Inc. — IdeaAI</span>
            <span>Problem Analysis</span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 4: SOLUTION TO THE PROBLEM                                      */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden p-14 flex flex-col justify-between ${
            currentSlide === 3 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Our <span className="text-[#3B66B8]">Solution</span>
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-2xl">
                IdeaAI turns any developer PC into a self-healing, air-gapped
                autonomous software engineer that works safely while you sleep.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8] bg-blue-50 px-3 py-1.5 rounded-full">
              03 • Product Solution
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 my-auto">
            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3B66B8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Provable Zero Egress
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  100% Strict Local Privacy Guardrail
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Main-process network interception blocks all outbound HTTP/WS
                  requests except localhost (127.0.0.1), backed by a live local
                  audit log proving zero bytes ever leave the machine.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3B66B8] flex items-center justify-center shrink-0">
                <GitBranch className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Zero-Risk Autonomy
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  Night Shift Queue & Git Sandbox
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Automatically stashes dirty files and creates isolated branches
                  (<code className="text-xs bg-gray-100 px-1 py-0.5 rounded">ideaai/auto-*</code>)
                  for overnight tasks, generating a clean Morning Summary diff
                  before merging.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3B66B8] flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Universal Compatibility
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  Hardware-Adaptive Open-Weights Hub
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Auto-detects GPU VRAM & system RAM to classify machines into
                  Small, Medium, Large, or Massive tiers—dynamically tuning{" "}
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">num_ctx</code>{" "}
                  and enabling 1-click downloads of Llama, Qwen2.5-Coder, and
                  DeepSeek.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3B66B8] flex items-center justify-center shrink-0">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Closed-Loop Execution
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  Self-Healing Build & Test Loop
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Executes build, lint, and test suites in an integrated xterm
                  environment, feeding compiler stderr back into the local model
                  to self-heal errors automatically with circuit-breaker safety.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#3B66B8] text-white rounded-xl px-8 py-4 flex items-center justify-between">
            <span className="font-semibold text-sm">
              Zero Cloud API Keys • Zero Token Bills • Full Desktop Sovereignty
            </span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
              Available Today on Windows / Microsoft Store
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 5: WHY YOU WANT TO SOLVE THE PROBLEM (Mission & Vision)         */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden grid grid-cols-12 ${
            currentSlide === 4 ? "block" : "hidden"
          }`}
        >
          {/* Left Mission Text + Framed Visual */}
          <div className="col-span-6 p-14 flex flex-col justify-between border-r border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8]">
                04 • Purpose & Motivation
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                Our <span className="text-[#3B66B8]">Mission</span>
              </h2>
              <p className="text-gray-600 mt-4 text-base leading-relaxed">
                Software is becoming autonomous, yet intelligence is being
                centralized into a handful of expensive cloud monopolies. We
                founded Aeternexus to ensure every developer and enterprise owns
                their AI engineering workforce outright.
              </p>
            </div>

            {/* Geometric Frame Card matching "Our Mission" slide */}
            <div className="relative my-auto py-4">
              <div className="absolute top-2 left-4 w-72 h-44 border-2 border-[#7CC1E8] rounded-lg" />
              <div className="relative ml-8 mt-4 w-80 bg-[#F8FAFC] border border-gray-200 rounded-lg p-6 shadow-sm">
                <p className="text-xs font-bold text-[#3B66B8] uppercase tracking-wider mb-2">
                  Core Conviction
                </p>
                <p className="text-gray-800 font-semibold text-base leading-snug">
                  “Your codebase is your company’s crown jewel. Autonomous AI
                  should run inside your perimeter—never on rented cloud GPUs.”
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Aeternexus, Inc. • Democratizing Sovereign AI Engineering
            </div>
          </div>

          {/* Right 3 Numbered Pillars */}
          <div className="col-span-6 bg-[#F8FAFC] p-14 flex flex-col justify-center space-y-8">
            <h3 className="text-2xl font-extrabold text-gray-900">
              Why We Are <span className="text-[#3B66B8]">Building This</span>
            </h3>

            <div className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full bg-[#3B66B8] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </span>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  Code Privacy is a Fundamental Right
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Developers should never be forced to upload sensitive client
                  codebases or proprietary algorithms just to access modern AI
                  automation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full bg-[#3B66B8] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </span>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  Open-Weights Models Have Caught Up
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Models like Qwen2.5-Coder, Llama 3.3, and DeepSeek now rival
                  frontier cloud models on coding benchmarks—yet lack an
                  autonomous desktop harness built specifically for local GPUs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full bg-[#3B66B8] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </span>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  Eliminating the Cloud Compute Tax
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Developers already own powerful laptops and workstations.
                  Utilizing idle overnight GPU cycles unlocks continuous
                  software engineering at zero marginal cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 6: TECHNOLOGY YOU NEED FOR THE SOLUTION                         */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden p-14 flex flex-col justify-between ${
            currentSlide === 5 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Core <span className="text-[#3B66B8]">Technology</span>
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-2xl">
                A deterministic local-first desktop architecture engineered for
                air-gapped security, hardware adaptation, and crash recovery.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8] bg-blue-50 px-3 py-1.5 rounded-full">
              05 • System Architecture
            </span>
          </div>

          {/* 4-Layer Architecture Pipeline */}
          <div className="grid grid-cols-4 gap-5 my-auto">
            <div className="border-2 border-[#7CC1E8] rounded-xl p-6 bg-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#3B66B8] uppercase">
                  Layer 01
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Electron Privacy Guardrail
                </h3>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Intercepts <code className="bg-gray-100 px-1">webRequest.onBeforeRequest</code>{" "}
                  at the main-process session layer. Blocks all non-loopback
                  traffic and logs auditable proof of zero data egress.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
                Electron • TypeScript • IPC Bridge
              </div>
            </div>

            <div className="border-2 border-[#3B66B8] rounded-xl p-6 bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#3B66B8] uppercase">
                  Layer 02
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Hardware Profiler Engine
                </h3>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Queries <code className="bg-gray-100 px-1">nvidia-smi</code> & OS
                  memory APIs to classify devices into Small (4GB), Medium
                  (8GB), Large (16GB), and Massive (24GB+) tiers, auto-tuning{" "}
                  <code className="bg-gray-100 px-1">num_ctx</code>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] font-semibold text-[#3B66B8]">
                OOM Prevention • Dynamic Context
              </div>
            </div>

            <div className="border-2 border-[#7CC1E8] rounded-xl p-6 bg-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#3B66B8] uppercase">
                  Layer 03
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Open-Weights Model Hub
                </h3>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Native streaming integration with local Ollama runtime
                  (<code className="bg-gray-100 px-1">127.0.0.1:11434</code>) for
                  1-click downloading and switching across Qwen2.5-Coder,
                  Llama, DeepSeek, and Codestral.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
                Local Inference • Zero API Keys
              </div>
            </div>

            <div className="border-2 border-[#2C3E50] rounded-xl p-6 bg-[#2C3E50] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#7CC1E8] uppercase">
                  Layer 04
                </span>
                <h3 className="text-lg font-bold mt-1">
                  Checkpointed Git Sandbox
                </h3>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Finite-state machine runner (<code className="bg-white/10 px-1">Plan → Edit → Verify → Self-Heal</code>)
                  persisting JSON checkpoints in isolated Git branches with
                  circuit breakers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/15 text-[11px] font-semibold text-[#7CC1E8]">
                Next.js • Node.js • xterm • Git
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-4 flex items-center justify-between text-xs text-gray-600">
            <span>
              <strong>R&D Roadmap:</strong> Multi-agent local AST indexing,
              quantized LoRA code-style adapters, and enterprise air-gapped
              policy server.
            </span>
            <span className="font-bold text-[#3B66B8]">
              100% Built & Shipping
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 7: ADDRESSED MARKET & COMPETITIVE LANDSCAPE                     */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden p-14 flex flex-col justify-between ${
            currentSlide === 6 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Market & <span className="text-[#3B66B8]">Competition</span>
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-2xl">
                Capturing the fastest-growing segment of the $27B+ AI developer
                tools market: on-premise and privacy-compliant coding agents.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8] bg-blue-50 px-3 py-1.5 rounded-full">
              06 • Market & Landscape
            </span>
          </div>

          <div className="grid grid-cols-12 gap-8 items-center my-auto">
            {/* Left Column Chart matching bottom-right template slide */}
            <div className="col-span-5 bg-[#F8FAFC] border border-gray-200 rounded-xl p-7">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Addressable Market Size
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                AI Software Engineering & DevTools (2026–2030)
              </p>

              <div className="flex items-end justify-around h-48 pt-4 border-b border-gray-300 px-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-extrabold text-[#3B66B8]">
                    $27.5B
                  </span>
                  <div className="w-14 h-40 bg-[#3B66B8] rounded-t-md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-extrabold text-[#7CC1E8]">
                    $8.4B
                  </span>
                  <div className="w-14 h-24 bg-[#7CC1E8] rounded-t-md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-extrabold text-[#2C3E50]">
                    $1.2B
                  </span>
                  <div className="w-14 h-12 bg-[#2C3E50] rounded-t-md" />
                </div>
              </div>

              <div className="grid grid-cols-3 text-center text-xs mt-3 font-semibold text-gray-700">
                <div>
                  <p>TAM</p>
                  <p className="text-[10px] text-gray-400 font-normal">
                    Global AI DevTools
                  </p>
                </div>
                <div>
                  <p>SAM</p>
                  <p className="text-[10px] text-gray-400 font-normal">
                    Private / On-Prem AI
                  </p>
                </div>
                <div>
                  <p>SOM</p>
                  <p className="text-[10px] text-gray-400 font-normal">
                    Local Desktop Agents
                  </p>
                </div>
              </div>
            </div>

            {/* Right Competitive Landscape Matrix */}
            <div className="col-span-7 border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#3B66B8] text-white">
                    <th className="py-3.5 px-4 font-bold">Capability</th>
                    <th className="py-3.5 px-4 font-extrabold bg-[#2B5096]">
                      IdeaAI (Ours)
                    </th>
                    <th className="py-3.5 px-4 font-medium">Cursor / Copilot</th>
                    <th className="py-3.5 px-4 font-medium">Devin (Cloud)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      100% Air-Gapped Local Execution
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Enforced Guardrail
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-red-500">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Cloud Required
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-red-500">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Cloud Only
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      Zero Per-Token / API Fees
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> $0 Marginal Cost
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      Usage Caps / Paid
                    </td>
                    <td className="py-3.5 px-4 text-red-500">$500+/mo Tiers</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      Hardware-Adaptive VRAM Scaling
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 4-Tier Auto Tuning
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">N/A (Cloud)</td>
                    <td className="py-3.5 px-4 text-gray-400">N/A (Cloud)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      Isolated Git Overnight Runner
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Auto-Branch Sandbox
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      Interactive Only
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      Cloud Sandbox
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      1-Click Open-Weights Model Hub
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Built-In Hub
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-red-500">Proprietary</td>
                    <td className="py-3.5 px-4 text-red-500">Proprietary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs text-gray-400 flex justify-between border-t border-gray-100 pt-4">
            <span>Defensible Moat: Local Hardware Optimization + Privacy Auditability</span>
            <span>Competitive Positioning</span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 8: APPROACH / METHODOLOGY TO ENGAGE CUSTOMERS (GTM)             */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden p-14 flex flex-col justify-between ${
            currentSlide === 7 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Customer <span className="text-[#3B66B8]">Engagement</span>
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-2xl">
                A bottom-up Product-Led Growth (PLG) flywheel converting free
                desktop developers into high-value enterprise security seats.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8] bg-blue-50 px-3 py-1.5 rounded-full">
              07 • Go-To-Market Methodology
            </span>
          </div>

          {/* 3-Stage Process Infographic matching bottom-middle template slide */}
          <div className="grid grid-cols-3 gap-8 my-auto relative">
            {/* Step 1 */}
            <div className="relative bg-[#F8FAFC] border border-gray-200 rounded-xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#7CC1E8] text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm">
                  01
                </div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Acquisition (PLG)
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  Storefront & Developer Launches
                </h3>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Frictionless 1-click installation via Microsoft Store, Show HN
                  technical launches, and open-weights community distribution
                  (Reddit r/LocalLLaMA, GitHub, X).
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-gray-200 text-xs font-semibold text-gray-700">
                Proven: 266 Users Acquired Organically
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-[#F8FAFC] border-2 border-[#3B66B8] rounded-xl p-7 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#3B66B8] text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm">
                  02
                </div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Activation & Retention
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  Instant Hardware & Night Shift Value
                </h3>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Zero-config hardware profiling automatically selects the best
                  local coding model within 60 seconds, driving daily habit
                  formation through overnight autonomous pull requests.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-gray-200 text-xs font-semibold text-[#3B66B8]">
                Target: Pro Power-User Tier ($19/mo)
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-[#F8FAFC] border border-gray-200 rounded-xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#2C3E50] text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm">
                  03
                </div>
                <span className="text-xs font-bold text-[#3B66B8] uppercase">
                  Enterprise Expansion
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  Air-Gapped Design Partners
                </h3>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Converting bottom-up developer champions inside FinTech and
                  engineering firms into Team & Enterprise licenses ($49–$99/seat)
                  with centralized privacy audit compliance.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-gray-200 text-xs font-semibold text-gray-700">
                High-Margin B2B SaaS Revenue
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              Revenue Model: Freemium Local Core → Pro Autonomous Workflows
              ($19/mo) → Enterprise Air-Gapped Compliance ($49+/seat)
            </span>
            <span className="font-bold text-[#3B66B8]">
              100% Gross Margin on Local Compute
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* SLIDE 9: TEAM (Split Layout matching "Client Say" template slide)     */}
        {/* ===================================================================== */}
        <section
          className={`slide-wrapper relative w-full max-w-[1280px] aspect-[16/9] bg-white shadow-xl overflow-hidden grid grid-cols-12 ${
            currentSlide === 8 ? "block" : "hidden"
          }`}
        >
          {/* Left White Column with Framed Founder Card */}
          <div className="col-span-5 p-14 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3B66B8]">
                08 • Leadership & Execution
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                Founding <span className="text-[#3B66B8]">Team</span>
              </h2>
            </div>

            {/* Framed Geometric Profile Box matching template */}
            <div className="relative my-auto">
              <div className="absolute -top-4 -left-4 w-64 h-64 border-2 border-[#7CC1E8] rounded-xl" />
              <div className="relative bg-[#F8FAFC] border border-gray-200 rounded-xl p-7 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#3B66B8] text-white font-extrabold text-2xl flex items-center justify-center mb-4">
                  DY
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Dogus Yilmaz
                </h3>
                <p className="text-sm font-semibold text-[#3B66B8]">
                  Founder & CEO • Aeternexus, Inc.
                </p>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Full-stack systems engineer, open-weights LLM fine-tuner, and
                  corporate builder operating across Delaware (US) and
                  Istanbul.
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Actively recruiting US GTM Co-Founder in San Francisco Bay Area
            </div>
          </div>

          {/* Right Solid Cobalt Blue Panel matching template */}
          <div className="col-span-7 bg-[#3B66B8] text-white p-14 flex flex-col justify-between">
            <div>
              <p className="text-[#7CC1E8] text-xs font-bold uppercase tracking-widest">
                Founder Background & Track Record
              </p>
              <h3 className="text-3xl font-bold mt-2">
                Built for Speed, Capital Efficiency & Deep Tech Execution
              </h3>
            </div>

            <div className="space-y-5 my-auto">
              <div className="bg-white/10 rounded-xl p-5 border border-white/15">
                <h4 className="font-bold text-base text-[#7CC1E8]">
                  AI Systems & Local LLM Engineering
                </h4>
                <p className="text-sm text-blue-50 mt-1 leading-relaxed">
                  Architected and shipped IdeaAI solo from scratch to the
                  Microsoft Store; experienced in C++, Python, TypeScript,
                  Electron, Next.js, and fine-tuning Llama models locally.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-5 border border-white/15">
                <h4 className="font-bold text-base text-[#7CC1E8]">
                  Cross-Border Corporate & Financial Discipline
                </h4>
                <p className="text-sm text-blue-50 mt-1 leading-relaxed">
                  Founder of Aeternexus, Inc. (Delaware C-Corp) & Aeternexus
                  A.S.; combines Computer Programming studies with 2+ years of
                  corporate accounting & finance experience (CVK Mining).
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-5 border border-white/15">
                <h4 className="font-bold text-base text-[#7CC1E8]">
                  Ecosystem Validation & Innovation
                </h4>
                <p className="text-sm text-blue-50 mt-1 leading-relaxed">
                  Selected for LAUNCH Startup Tuneup Cohort 39, TÜBİTAK BİGG
                  Stage 2 finalist, and patent applicant for decision-support
                  systems (BioPsych-DSS).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20 text-xs text-blue-100">
              <span>Contact: ideaai.togetlink.com</span>
              <span className="font-bold text-white">
                Aeternexus, Inc. • Delaware C-Corp
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}