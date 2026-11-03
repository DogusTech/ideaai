export const dynamic = 'force-static';
import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

function parseArticleFrontmatter(fileContent: string) {
  const contentParts = fileContent.split('---')
  if (contentParts.length < 3) {
    return { slug: '', publishedAt: '' }
  }

  let slug = ''
  let publishedAt = ''

  contentParts[1].split('\n').forEach(line => {
    const slugMatch = line.match(/^slug:\s*"(.*)"$/)
    const dateMatch = line.match(/^publishedAt:\s*"(.*)"$/)
    if (slugMatch) slug = slugMatch[1]
    if (dateMatch) publishedAt = dateMatch[1]
  })

  return { slug, publishedAt }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ideaai.togetlink.com'

  // Tüm statik rotalar
  const routes: MetadataRoute.Sitemap = [
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
    '/blog', // Anasayfaya blog eklendi
    '/matrix-demo',
    '/docs',
    '/security',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : (route === '/blog' ? 0.9 : 0.8),
  }))

  // Blog yazılarını dinamik olarak ekle
  const articlesDir = path.join(process.cwd(), 'content/articles');
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    
    files.forEach(filename => {
      const filePath = path.join(articlesDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { slug: frontmatterSlug, publishedAt } = parseArticleFrontmatter(fileContent);
      const slug = frontmatterSlug || filename.replace('.md', '');
      const parsedDate = publishedAt ? new Date(publishedAt) : null;
      const lastModified = parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate
        : fs.statSync(filePath).mtime;

      routes.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  }

  return routes;
}
