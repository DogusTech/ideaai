import { MetadataRoute } from 'next';
import { getLatestNews } from '@/lib/news-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_NEWS_DOMAIN || 'https://news.togetlink.com';

  const defaultEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  try {
    const articles = await getLatestNews(100);
    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => {
      const date = article.createdAt
        ? new Date(article.createdAt.seconds ? article.createdAt.seconds * 1000 : article.createdAt)
        : new Date();

      return {
        url: `${baseUrl}/news/${article.id}`,
        lastModified: date,
        changeFrequency: 'daily',
        priority: 0.8,
      };
    });

    return [...defaultEntries, ...articleEntries];
  } catch {
    return defaultEntries;
  }
}
