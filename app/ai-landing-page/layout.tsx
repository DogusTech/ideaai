import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://ideaai.togetlink.com'),
  title: 'IdeaAI — Autonomous AI Coding Agent for Desktop',
  description: 'IdeaAI is a native desktop AI coding assistant that autonomously builds, debugs, and refactors your local codebase. No more copy-pasting code into browsers.',
  keywords: [
    'AI coding agent',
    'autonomous AI assistant',
    'desktop AI developer',
    'AI pair programmer',
    'local AI coding tool',
    'IdeaAI',
    'TogetLink IdeaAI'
  ],
  openGraph: {
    title: 'IdeaAI — Autonomous AI Coding Agent',
    description: 'The world\'s most capable autonomous execution engine for developers. Built for velocity and precision.',
    url: 'https://ideaai.togetlink.com',
    siteName: 'IdeaAI',
    images: [
      {
        url: '/icon-light-32x32.png',
        width: 800,
        height: 600,
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaAI — Autonomous AI Coding Agent',
    description: 'The autonomous AI coding agent that lives on your desktop. Build, debug, and ship faster.',
  },
}

const aiSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "IdeaAI",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, macOS",
  "description": "IdeaAI is a native desktop autonomous AI coding agent that helps developers build, debug, and refactor code directly within their local environment.",
  "url": "https://ideaai.togetlink.com",
  "publisher": {
    "@type": "Organization",
    "name": "TogetLink"
  }
};

export default function IdeaAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aiSchema) }}
        />
      </head>
      {children}
    </>
  )
}
