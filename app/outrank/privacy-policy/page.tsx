import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-medium tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: September 16, 2026</p>
        
        <div className="prose prose-slate max-w-none text-gray-700">
          <p>
            At OutrankAI, operated by Aeternexus, Inc. ("we," "us," or "our"), we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered SEO content generation service.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you use the Service:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, and billing details when you subscribe or purchase a lifetime deal (LTD).</li>
            <li><strong>User Content:</strong> URLs, competitor links, and keywords you submit to our engine for analysis.</li>
            <li><strong>Usage Data:</strong> We automatically collect diagnostic data, IP addresses, browser types, and usage timestamps to ensure platform stability.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h3>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, operate, and maintain OutrankAI's core features.</li>
            <li>To process your transactions securely via our payment providers (e.g., Stripe).</li>
            <li>To monitor usage limits and prevent abuse of our API infrastructure.</li>
            <li><strong>Important Note on AI Training:</strong> We <u>do not</u> use your submitted URLs, proprietary keywords, or the generated SEO articles to train our underlying AI models. Your strategic SEO data remains your own.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Third-Party Service Providers</h3>
          <p>
            To power OutrankAI, we utilize industry-leading third-party sub-processors. By using our service, you acknowledge that your prompts and URLs may be processed by these partners strictly for the purpose of generating your requested content:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Google & Vercel AI SDK:</strong> Used for processing complex language models (Gemini) to generate your articles.</li>
            <li><strong>Stripe:</strong> Used for secure payment processing. We do not store your credit card information on our servers.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h3>
          <p>
            We implement enterprise-grade security measures designed to secure your personal information from accidental loss and from unauthorized access. However, no internet-based service is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights (GDPR & CCPA)</h3>
          <p>
            Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal data. If you wish to exercise these rights, or request a complete deletion of your OutrankAI account, please contact us.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact our legal team at: <br/>
            <strong>Email:</strong> legal@aeternexus.com
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