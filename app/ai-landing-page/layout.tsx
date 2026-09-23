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

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aeternexus Inc.",
    "alternateName": "IdeaAI",
    "url": "https://ideaai.togetlink.com",
    "logo": "https://ideaai.togetlink.com/icon-light-32x32.png",
    "sameAs": [
      "https://twitter.com/togetlink",
      "https://github.com/DogusTech"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "IdeaAI",
    "image": "https://ideaai.togetlink.com/icon-light-32x32.png",
    "description": "IdeaAI is a native desktop autonomous AI coding agent that helps developers build, debug, and refactor code directly within their local environment using Zero-State Architecture.",
    "brand": {
      "@type": "Brand",
      "name": "Aeternexus"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://ideaai.togetlink.com",
      "priceCurrency": "USD",
      "price": "0.00",
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Aeternexus Inc."
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "28"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is IdeaAI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IdeaAI is an autonomous desktop AI coding agent with native file system and terminal access. It operates without requiring you to copy and paste code from a browser."
        }
      },
      {
        "@type": "Question",
        "name": "Is IdeaAI free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IdeaAI offers a free tier for early adopters."
        }
      },
      {
        "@type": "Question",
        "name": "How does Zero-State Architecture work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It means the AI reads your local file system natively, runs commands in your terminal, and tests its own code autonomously via Inter-Process Communication (IPC)."
        }
      }
    ]
  }
];
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </head>
      {children}
    </>
  )
}
