import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.flatMap((post) => [
    { locale: 'en', slug: post.slug },
    { locale: 'fr', slug: post.slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  const title = post.title as { en: string; fr: string };
  const excerpt = post.excerpt as { en: string; fr: string };
  return {
    title: `${title[locale]} | HS Luxury Quads`,
    description: excerpt[locale],
    openGraph: {
      title: title[locale],
      description: excerpt[locale],
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') notFound();

  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.isPublished) notFound();

  const title = post.title as { en: string; fr: string };
  const excerpt = post.excerpt as { en: string; fr: string };
  const content = post.content as { en: string; fr: string };

  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(new Date(post.publishedAt))
    : '';

  const siteUrl = 'https://hsluxuryquads.com';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title[locale],
    description: excerpt[locale],
    image: post.image || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'HS Luxury Quads',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${locale}/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Home' : 'Accueil', item: `${siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: title[locale], item: `${siteUrl}/${locale}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar locale={locale} />

      <article className="min-h-screen">
        {/* Hero */}
        <header className="relative w-full h-[50vh] min-h-[360px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            {post.image ? (
              <Image src={post.image} alt={title[locale]} fill priority className="object-cover filter saturate-[0.85]" />
            ) : (
              <div className="absolute inset-0" style={{ background: 'oklch(10% 0.02 72)' }} />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, oklch(8% 0.01 75 / 0.95) 100%)' }} />
          </div>
          <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pb-12 max-w-[1440px] mx-auto">
            {post.category && (
              <span className="font-syne text-[9px] font-semibold tracking-widest uppercase mb-3 block" style={{ color: 'oklch(var(--gold))' }}>
                {post.category}
              </span>
            )}
            <h1 className="font-display font-semibold text-3xl md:text-5xl text-white leading-tight max-w-3xl">
              {title[locale]}
            </h1>
          </div>
        </header>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
          {/* Byline */}
          <div className="flex items-center gap-4 pb-8 mb-8 border-b" style={{ borderColor: 'oklch(var(--rule) / 0.2)' }}>
            <div>
              <p className="font-syne text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'oklch(var(--ink))' }}>
                {post.author}
              </p>
              {date && (
                <p className="font-syne text-[9px] tracking-wider mt-0.5" style={{ color: 'oklch(var(--ink-faint))' }}>
                  {date}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div
            className="prose-luxury"
            dangerouslySetInnerHTML={{ __html: content[locale] }}
          />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t" style={{ borderColor: 'oklch(var(--rule) / 0.2)' }}>
            <Link
              href={`/${locale}/blog`}
              className="font-syne text-[10px] font-semibold tracking-widest uppercase transition-colors hover:text-gold"
              style={{ color: 'oklch(var(--ink-faint))' }}
            >
              ← {locale === 'en' ? 'Back to Blog' : 'Retour au Blog'}
            </Link>
          </div>
        </div>
      </article>

      <Footer locale={locale} />
    </>
  );
}
