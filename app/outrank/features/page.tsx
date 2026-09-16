import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white py-4 px-6 md:px-12">
        <Link href="/outrank" className="text-xl font-semibold tracking-tight text-gray-900">
          Outrank<span className="text-blue-600">AI</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <h1 className="text-4xl font-medium tracking-tight mb-8">Features</h1>
        <div className="prose prose-slate max-w-none text-gray-600">
          <p>This page is currently being updated for our upcoming AppSumo launch. Please check back later.</p>
          <p>At OutrankAI, we take your features seriously and adhere to industry standards.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-8 px-6 md:px-12 text-center text-sm text-gray-500">
        © 2026 Aeternexus, Inc. All rights reserved.
      </footer>
    </div>
  );
}