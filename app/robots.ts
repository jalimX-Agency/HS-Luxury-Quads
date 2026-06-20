import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bingbot', 'Googlebot'],
        allow: '/',
      },
    ],
    sitemap: 'https://hsluxuryquads.com/sitemap.xml',
  };
}
