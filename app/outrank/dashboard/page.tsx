"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  LayoutDashboard, 
  Zap, 
  FolderOpen, 
  Settings, 
  LogOut,
  Link as LinkIcon,
  Settings2,
  Lock
} from 'lucide-react'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (!user) return <div className="min-h-screen bg-[#FAFAFA]" /> // loading state

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-gray-900">Outrank<span className="text-blue-600">AI</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
            <LayoutDashboard className="w-4 h-4" />
            Workspace
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors opacity-60">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4" />
              Bulk Outrank
            </div>
            <Lock className="w-3 h-3" />
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors opacity-60">
            <FolderOpen className="w-4 h-4" />
            Projects
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors opacity-60">
            <Settings className="w-4 h-4" />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user.displayName || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between md:hidden">
          <span className="text-xl font-semibold tracking-tight text-gray-900">Outrank<span className="text-blue-600">AI</span></span>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-600">Log Out</button>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Advanced Workspace</h1>
            <p className="text-gray-500">Configure strict parameters and outrank your competitors.</p>
          </div>

          {/* Blurred/Disabled Coming Soon Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* The Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm bg-white/40 rounded-2xl border border-white/50">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center max-w-sm">
                <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Advanced Engine Updating</h3>
                <p className="text-sm text-gray-500 mb-4">
                  We are preparing this detailed workspace for our upcoming AppSumo launch. Advanced tuning will be available shortly!
                </p>
                <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium w-full pointer-events-none opacity-50">
                  Coming Soon
                </button>
              </div>
            </div>

            {/* The "Fake" Disabled UI underneath */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 opacity-40 select-none pointer-events-none">
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target URL to Outrank</label>
                <div className="flex items-center w-full border border-gray-300 rounded-xl p-3 bg-gray-50">
                  <LinkIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <input type="text" disabled placeholder="https://competitor.com/article" className="bg-transparent w-full outline-none text-gray-900" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Keyword</label>
                  <input type="text" disabled placeholder="e.g. 'best crm software'" className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone of Voice</label>
                  <select disabled className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-900 appearance-none">
                    <option>Professional & Authoritative</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-medium">
                  <Settings2 className="w-5 h-5 text-gray-500" />
                  Advanced Parameters
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked disabled className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Include NLP entities & LSI keywords</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked disabled className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Generate FAQ Schema Markup</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" disabled className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Auto-publish to WordPress via API</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button disabled className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Superior Content
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
