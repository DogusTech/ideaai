import React from "react";
import { ArrowRight, Users, MapPin, Zap, TrendingUp, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";

export default function PitchDeskPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30 font-sans pb-24">
      {/* Navbar Minimalist */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-black font-extrabold text-lg leading-none">TL</span>
          </div>
          TogetLink
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
          Investor Presentation Q3
        </div>
      </nav>

      <main className="pt-32 max-w-5xl mx-auto px-6 space-y-32">
        
        {/* HERO / SLIDE 1 */}
        <section className="relative pt-20 pb-10 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Seed Round Open
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            The Future of <br /> Professional Networking.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-light">
            Bridging the gap between the digital and physical worlds. We transform everyday venues into high-intent, real-time networking hubs for modern professionals.
          </p>
        </section>

        {/* TRACTION / SLIDE 2 - THE MILESTONE */}
        <section className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-sm text-emerald-400 uppercase tracking-widest font-bold">Traction & Validation</h2>
              <h3 className="text-4xl font-bold tracking-tight">Strong Early Market Adoption</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Since our stealth beta launch, we have successfully onboarded <strong className="text-white">100+ active registered professionals</strong>. This rapid adoption, achieved with zero marketing spend, validates the acute pain point of isolation among remote workers and founders.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-black/50 border border-white/5 flex flex-col items-center justify-center text-center space-y-2">
                <Users className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="text-4xl font-black text-white">100+</span>
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Active Users</span>
              </div>
              <div className="p-6 rounded-2xl bg-black/50 border border-white/5 flex flex-col items-center justify-center text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-4xl font-black text-white">4.8</span>
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Engagement Rate</span>
              </div>
              <div className="p-6 rounded-2xl bg-black/50 border border-white/5 flex flex-col items-center justify-center text-center space-y-2 col-span-2">
                <MapPin className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-4xl font-black text-white">Global</span>
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Venue Accessibility</span>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM & SOLUTION / SLIDE 3 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8 p-10 rounded-3xl bg-red-950/20 border border-red-500/20">
            <h2 className="text-sm text-red-400 uppercase tracking-widest font-bold">The Problem</h2>
            <h3 className="text-3xl font-bold tracking-tight">The Isolation Epidemic</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Professionals are more digitally connected than ever, yet physically isolated. A founder can sit in a coworking space next to a brilliant developer for 5 hours, and they will never speak. Traditional networking platforms are completely disconnected from our immediate physical surroundings.
            </p>
          </div>

          <div className="space-y-8 p-10 rounded-3xl bg-emerald-950/20 border border-emerald-500/20">
            <h2 className="text-sm text-emerald-400 uppercase tracking-widest font-bold">The Solution</h2>
            <h3 className="text-3xl font-bold tracking-tight">Phygital Networking</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              TogetLink brings high-intent digital matchmaking into physical spaces. Users check into their current venue, broadcast their professional intent (e.g., "Looking for a Co-founder"), and instantly connect with verified professionals in the exact same room.
            </p>
          </div>
        </section>

        {/* BUSINESS MODEL / SLIDE 4 */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-sm text-blue-400 uppercase tracking-widest font-bold">Business Model</h2>
            <h3 className="text-4xl font-bold tracking-tight">Dual-Sided Revenue Streams</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold">B2C Lifetime Premium</h4>
              <p className="text-gray-400">
                Direct consumer monetization through Kickstarter backing and subscription models for advanced filtering, unlimited messaging, and global venue access.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold">B2B Venue Partnerships</h4>
              <p className="text-gray-400">
                Coworking spaces, coffee shops, and airport lounges pay for "Official Hub" status to attract high-value professionals and drive foot traffic.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-xl font-bold">Event & Conference API</h4>
              <p className="text-gray-400">
                Enterprise licensing for large-scale tech conferences to facilitate real-time, location-based networking among attendees.
              </p>
            </div>
          </div>
        </section>

        {/* THE TEAM & CTA / SLIDE 5 */}
        <section className="p-12 md:p-20 rounded-3xl bg-white text-black text-center space-y-8">
          <h2 className="text-sm text-gray-500 uppercase tracking-widest font-bold">Aeternexus Inc.</h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Join us in redefining how the world connects.
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are actively raising our Seed Round to scale our server infrastructure, expand our B2B venue partnerships across Europe and the US, and accelerate user acquisition.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="mailto:investors@aeternexus.com"
              className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              Contact Founders <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/"
              className="px-8 py-4 rounded-full bg-gray-100 text-black font-bold hover:bg-gray-200 transition-colors"
            >
              Back to Product
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
