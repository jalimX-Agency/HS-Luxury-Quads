import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const base = 'https://hsluxuryquads.com';
const locales = ['en', 'fr'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, blogPosts] = await Promise.all([
    prisma.tour.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes = [
    { path: '', priority: 1.0 },
    { path: '/tours', priority: 0.9 },
    { path: '/blog', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.7 },
    { path: '/gallery', priority: 0.6 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, priority } of staticRoutes) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
      });
    }
    for (const tour of tours) {
      entries.push({
        url: `${base}/${locale}/tours/${tour.slug}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    }
    for (const post of blogPosts) {
      entries.push({
        url: `${base}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  return entries;
}
