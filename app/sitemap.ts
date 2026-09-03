export const dynamic = 'force-static';
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://togetlink.com'

  // Tüm statik rotalar
  const routes = [
    '',
    '/about',
    '/login',
    '/register',
    '/explore',
    '/contact',
    '/help',
    '/pricing',
    '/press',
    '/terms-of-service',
    '/terms-of-use',
    '/privacy-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes]
}
