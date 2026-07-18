import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
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
    sitemap: 'https://togetlink.com/sitemap.xml',
  }
}
