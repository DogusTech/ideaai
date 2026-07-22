import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.togetlink.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'togetlink — Professional Networking & Co-working Hubs',
    template: '%s | togetlink',
  },
  description:
    'Where local builders build together and meet nearby. Discover professional hubs across USA and Turkey to find collaborators and ship faster.',
  keywords: [
    'professional networking', 
    'local hubs', 
    'builders', 
    'founders', 
    'co-working', 
    'networking in Istanbul', 
    'networking in USA', 
    'startup collaboration', 
    'meet founders',
    'check in to work',
    'TogetLink'
  ],
  authors: [{ name: 'DogusTech' }],
  creator: 'TogetLink',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.togetlink.com',
    title: 'togetlink — Professional Networking & Co-working Hubs',
    description: 'Where local builders build together and meet nearby. Discover professional hubs across USA and Turkey to find collaborators and ship faster.',
    siteName: 'togetlink',
    images: [
      {
        url: '/icon-light-32x32.png',
        width: 800,
        height: 600,
        alt: 'togetlink - Professional Networking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'togetlink — Professional Networking & Co-working Hubs',
    description: 'Where local builders build together and meet nearby. Discover professional hubs across USA and Turkey to find collaborators and ship faster.',
    images: ['/icon-light-32x32.png'],
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
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

import { AuthProvider } from '@/lib/auth/context'
import Script from 'next/script'

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://togetlink.com/#organization",
      "name": "TogetLink",
      "url": "https://togetlink.com",
      "logo": "https://togetlink.com/icon-light-32x32.png",
      "sameAs": [
        "https://twitter.com/togetlink",
        "https://linkedin.com/company/togetlink"
      ],
      "description": "TogetLink connects builders, designers, and founders in local hubs across the USA and Turkey."
    },
    {
      "@type": "WebSite",
      "@id": "https://togetlink.com/#website",
      "url": "https://togetlink.com",
      "name": "TogetLink",
      "publisher": {
        "@id": "https://togetlink.com/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light bg-background ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <Script
          id="global-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
