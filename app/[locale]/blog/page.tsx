import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blog/BlogCard';
import { FadeIn } from '@/components/ui/FadeIn';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};
  return {
    title: locale === 'en'
      ? 'Desert Travel Blog | HS Luxury Quads Marrakech'
      : 'Blog Désert & Voyages | HS Luxury Quads Marrakech',
    description: locale === 'en'
      ? 'Travel tips, Agafay desert guides, and luxury quad biking insights from our expert team in Marrakech, Morocco.'
      : 'Conseils voyage, guides du désert d\'Agafay et inspirations quad de luxe depuis notre équipe à Marrakech, Maroc.',
  };
}

export default async function BlogPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') notFound();

  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    });
  } catch {
    // DB unavailable at build time — render empty state
  }

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: locale === 'en' ? 'HS Luxury Quads Blog' : 'Blog HS Luxury Quads',
    url: `https://hsluxuryquads.com/${locale}/blog`,
    description: locale === 'en'
      ? 'Travel tips and guides for luxury desert experiences in Agafay, Marrakech.'
      : 'Conseils et guides pour des expériences désert de luxe à Agafay, Marrakech.',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-container-max mx-auto px-gutter">
          {/* Header */}
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <p className="section-label justify-center mb-4">
              {locale === 'en' ? 'Desert Insights' : 'Inspirations Désert'}
            </p>
            <h1 className="font-display font-light italic text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] mb-5" style={{ color: 'oklch(var(--ink))' }}>
              {locale === 'en' ? 'Guides & Stories from Agafay' : 'Guides & Récits depuis Agafay'}
            </h1>
            <p className="font-sans font-light text-sm leading-[1.8]" style={{ color: 'oklch(var(--ink-muted))' }}>
              {locale === 'en'
                ? 'Travel tips, destination guides, and behind-the-scenes stories from our luxury quad experiences in the Agafay Desert.'
                : 'Conseils voyage, guides de destination et récits en coulisses de nos expériences quad de luxe dans le désert d\'Agafay.'}
            </p>
          </FadeIn>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-xl text-ink-faint">
                {locale === 'en' ? 'Articles coming soon.' : 'Articles à venir.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.1}>
                  <BlogCard
                    post={{
                      id: post.id,
                      slug: post.slug,
                      title: post.title as { en: string; fr: string },
                      excerpt: post.excerpt as { en: string; fr: string },
                      image: post.image,
                      category: post.category,
                      author: post.author,
                      publishedAt: post.publishedAt,
                    }}
                    locale={locale}
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
