export const dynamic = 'force-static';
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/profile',
          '/network',
          '/chat',
          '/settings',
          '/notifications',
          '/api/',
        ],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: ['/', '/blog/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/dashboard', '/profile', '/api/'],
      },
    ],
    sitemap: 'https://ideaai.togetlink.com/sitemap.xml',
  }
}
