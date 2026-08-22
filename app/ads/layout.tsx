import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ads | TogetLink',
  description: 'Promote your projects and reach thousands of builders.',
}

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: '"Google Sans Flex", "Google Sans", "Inter", sans-serif' }} className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <style dangerouslySetInnerHTML={{__html: `
        @font-face {
          font-family: 'Google Sans Flex';
          src: local('Google Sans Flex'), local('Google Sans');
        }
      `}} />
      <nav className="w-full flex items-center justify-between p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm tracking-tighter">
            TL
          </div>
          <span className="font-bold text-xl tracking-tight">Ads</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">How it works</a>
          <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Post an Ad
          </button>
        </div>
      </nav>
      {children}
    </div>
  )
}
