export const dynamic = 'force-static';
import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

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
      
      let slug = filename.replace('.md', '');
      let lastModified = new Date(); // Fallback

      const contentParts = fileContent.split('---');
      if (contentParts.length >= 3) {
        const fmText = contentParts[1];
        const lines = fmText.split('\n');
        
        let fmSlug = '';
        let fmDate = '';
        
        lines.forEach(line => {
          const slugMatch = line.match(/^slug:\s*"(.*)"$/);
          if (slugMatch) fmSlug = slugMatch[1];
          
          const dateMatch = line.match(/^publishedAt:\s*"(.*)"$/);
          if (dateMatch) fmDate = dateMatch[1];
        });

        if (fmSlug) slug = fmSlug;
        if (fmDate) lastModified = new Date(fmDate);
      }

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
