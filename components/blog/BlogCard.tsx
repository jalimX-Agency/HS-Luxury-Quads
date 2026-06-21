import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/content/tours';

interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; fr: string };
  excerpt: { en: string; fr: string };
  image: string;
  category: string;
  author: string;
  publishedAt: Date | null;
}

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const title = post.title[locale];
  const excerpt = post.excerpt[locale];
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(new Date(post.publishedAt))
    : '';

  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block">
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden mb-5 bg-bg-sunken">
        {post.image ? (
          <Image
            src={post.image}
            alt={title}
            fill
            className="object-cover filter saturate-[0.85] group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}
        {post.category && (
          <span
            className="absolute top-3 left-3 font-syne text-[8px] font-semibold tracking-widest uppercase px-2.5 py-1"
            style={{ background: 'oklch(8% 0.01 75 / 0.85)', color: 'oklch(74% 0.130 72)', border: '1px solid oklch(74% 0.130 72 / 0.4)' }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* Meta */}
      {date && (
        <p className="font-syne text-[9px] font-medium tracking-[0.18em] uppercase mb-2" style={{ color: 'oklch(var(--ink-faint))' }}>
          {date}
        </p>
      )}
      <h3
        className="font-display font-semibold text-lg leading-snug mb-3 group-hover:text-gold transition-colors duration-300"
        style={{ color: 'oklch(var(--ink))' }}
      >
        {title}
      </h3>
      <p className="font-sans font-light text-sm leading-[1.75] line-clamp-3" style={{ color: 'oklch(var(--ink-muted))' }}>
        {excerpt}
      </p>
      <span
        className="inline-block mt-4 font-syne text-[9px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 group-hover:text-gold"
        style={{ color: 'oklch(var(--ink-faint))' }}
      >
        {locale === 'en' ? 'Read article →' : 'Lire l\'article →'}
      </span>
    </Link>
  );
}
