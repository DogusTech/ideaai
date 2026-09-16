import React from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
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
        <h1 className="text-4xl font-medium tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: September 16, 2026</p>
        
        <div className="prose prose-slate max-w-none text-gray-700">
          <p>
            This Cookie Policy explains how Aeternexus, Inc. ("we," "us," or "our") uses cookies and similar technologies when you visit the OutrankAI platform.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h3>
          <p>
            Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work efficiently and provide tracking information to the site owners.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h3>
          <p>We use cookies for the following essential purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Authentication:</strong> To remember that you are logged into OutrankAI and keep your session active securely.</li>
            <li><strong>Preferences:</strong> To remember your UI choices, such as dark/light mode or language settings.</li>
            <li><strong>Security:</strong> To protect your account and prevent fraudulent login attempts.</li>
            <li><strong>Analytics:</strong> We use privacy-friendly analytics tools (such as Vercel Analytics) to understand how users interact with our tool. These do not track personal identifying information across the web.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Strictly Necessary Cookies:</strong> Required for the basic functionality of OutrankAI (e.g., Next.js session cookies). Cannot be disabled.</li>
            <li><strong>Performance Cookies:</strong> Help us measure and improve site speed and usability.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Managing Your Cookie Preferences</h3>
          <p>
            Most modern web browsers allow you to control cookies through their settings. However, if you disable strictly necessary cookies, some features of OutrankAI (like maintaining a logged-in state) will not function properly.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Contact</h3>
          <p>
            If you have questions about our use of cookies, please contact us at: <strong>legal@aeternexus.com</strong>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-8 px-6 md:px-12 text-center text-sm text-gray-500">
        © 2026 Aeternexus, Inc. All rights reserved.
      </footer>
    </div>
  );
}