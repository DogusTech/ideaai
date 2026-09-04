"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function RedeemPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email || !password) return;
    
    setStatus('loading');
    
    try {
      // 1. Kodu doðrula
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Invalid or expired code.');
        return;
      }

      // 2. Kod doðruysa Firebase'de hesabi olutur (Backend'de de yetkilendirilmeli idealde)
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setStatus('success');
        setMessage('Account created and Lifetime Pro activated successfully!');
      } catch (firebaseErr: any) {
        setStatus('error');
        // Eðer mail zaten kayitliysa
        if (firebaseErr.code === 'auth/email-already-in-use') {
          setMessage('This email is already registered. Please log in first, or use a different email.');
        } else {
          setMessage(firebaseErr.message || 'Error creating account.');
        }
      }
      
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col" style={{ fontFamily: '"Google Sans Flex", sans-serif' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@8..144,-10..0,25..150,400..500,0..100&display=swap" rel="stylesheet" />

      {/* Navbar - Landing page ile ayn minimalist tasarm */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-2xl border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
             IdeaAI
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">Sign In</a>
            <a href="/dashboard" className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Ana erik */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xl mx-auto"
        >
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-6 block">
            LIFETIME DEAL // APPSUMO
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-tight mb-4" style={{ fontVariationSettings: '"wght" 650' }}>
            Claim Your Lifetime Access.
          </h1>
          
          <p className="text-lg text-zinc-500 leading-relaxed font-medium mb-10">
            Enter the redemption code provided by AppSumo to unlock TogetLink IdeaAI Pro forever. No subscriptions. No limits.
          </p>

          <form onSubmit={handleRedeem} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Account Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-base"
                  required
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">Create Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-base"
                  required
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-zinc-700 mb-1">AppSumo Redemption Code</label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="IDEAAI-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-lg font-mono placeholder:font-sans placeholder:text-zinc-400 uppercase"
                  required
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !code || !email || !password}
              className={`w-full py-4 rounded-xl text-white font-medium text-lg transition-all shadow-sm flex justify-center items-center gap-2 ${
                status === 'success' ? 'bg-emerald-600' : 'bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98]'
              } disabled:opacity-70 disabled:active:scale-100`}
            >
              {status === 'loading' && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {status === 'success' ? 'Code Redeemed!' : 'Redeem Now'}
            </button>
            
            {status === 'error' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 font-medium text-sm mt-2 text-center">
                {message}
              </motion.p>
            )}
            
            {status === 'success' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-emerald-800 font-bold mb-2 text-lg">Welcome to Pro!</h3>
                <p className="text-emerald-700 text-sm mb-6">Your lifetime access has been granted. You can now download the native app or go to your dashboard.</p>
                <a href="/dashboard" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm">
                  Go to Dashboard
                </a>
              </motion.div>
            )}
          </form>

        </motion.div>
      </div>
    </div>
  );
}
