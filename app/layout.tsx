import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'xterm/css/xterm.css';
import { satoshi } from '@/lib/fonts';
import Script from 'next/script';


export const metadata: Metadata = {
  metadataBase: new URL('https://ideaai.togetlink.com'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  title: {
    default: 'IdeaAI — Autonomous AI Coding Agent',
    template: '%s | IdeaAI',
  },
  description:
    'IdeaAI is a Windows desktop autonomous AI coding agent and engineering workspace with local Ollama, terminal automation, and workspace‑scoped file operations.',
  keywords: [
    'local AI coding agent',
    'Windows AI coding assistant',
    'Ollama coding',
    'offline coding assistant',
    'IdeaAI',
  ],
  authors: [{ name: 'DogusTech' }],
  creator: 'Aeternexus, Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ideaai.togetlink.com',
    title: 'IdeaAI — Autonomous AI Coding Agent',
    description: 'A Windows desktop engineering workspace that connects local Ollama models to files, terminals, and autonomous workflows.',
    siteName: 'IdeaAI',
    images: [
      {
        url: '/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg',
        width: 800,
        height: 600,
        alt: 'IdeaAI autonomous Windows coding agent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaAI — Autonomous AI Coding Agent',
    description: 'A Windows desktop engineering workspace that connects local Ollama models to files, terminals, and autonomous workflows.',
    images: ['/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg',
    shortcut: '/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg',
    apple: '/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ideaai.togetlink.com/#organization",
      "name": "Aeternexus, Inc.",
      "url": "https://ideaai.togetlink.com",
      "logo": "https://ideaai.togetlink.com/matrix-demo/Gemini_Generated_Image_dpurc9dpurc9dpur.jpg",
      "sameAs": [
        "https://apps.microsoft.com/detail/9p9sfqgbsk7",
        "https://ideaai.togetlink.com"
      ],
      "description": "Aeternexus, Inc. develops IdeaAI, a Windows desktop autonomous AI coding agent and engineering workspace."
    },
    {
      "@type": "WebSite",
      "@id": "https://ideaai.togetlink.com/#website",
      "url": "https://ideaai.togetlink.com",
      "name": "IdeaAI",
      "publisher": { "@id": "https://ideaai.togetlink.com/#organization" }
    }
  ]
};

import RootLayoutClient from './RootLayoutClient';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <meta name="impact-site-verification" content="77c85579-a9bf-40eb-b03c-b9bcf5b8426b" />
        <Script id="global-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }} />
      </head>
      <body className={`${satoshi.variable} font-sans antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
