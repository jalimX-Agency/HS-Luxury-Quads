'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Tour, Locale } from '@/content/tours';

interface TourCardProps {
  tour: Tour;
  locale: Locale;
}

export default function TourCard({ tour, locale }: TourCardProps) {
  const isMostPopular = tour.slug === 'quad-sunset-dinner';

  // Local images — guaranteed to always load
  const imagesBySlug: Record<string, string> = {
    'quad-agafay-2h':    '/images/tour-2h.png',
    'quad-sunset-dinner': '/images/tour-sunset.png',
    'private-luxury-quad': '/images/tour-private.png',
  };

  const imageSrc = imagesBySlug[tour.slug] || '/images/tour-2h.png';

  return (
    <div className="group bg-bg-subtle border border-rule/30 overflow-hidden hover:border-gold transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="h-72 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
        <Image
          alt={tour.title[locale]}
          width={640}
          height={380}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter saturate-[0.85]"
          src={imageSrc}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
          {isMostPopular && (
            <span className="bg-gold text-background px-3 py-1 text-[9px] font-syne font-semibold tracking-wider uppercase">
              {locale === 'en' ? 'Most Popular' : 'Plus Populaire'}
            </span>
          )}
          <span className="bg-background/80 backdrop-blur-md text-ink px-3 py-1 text-[9px] font-syne font-medium tracking-wider uppercase border border-rule/20">
            {tour.slug === 'quad-agafay-2h'
              ? (locale === 'en' ? '2 Hours · Private' : '2 Heures · Privé')
              : tour.slug === 'quad-sunset-dinner'
              ? (locale === 'en' ? 'Sunset · Dinner' : 'Coucher du Soleil · Dîner')
              : (locale === 'en' ? 'VIP · Fully Private' : 'VIP · Entièrement Privé')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-semibold text-xl text-ink mb-3 group-hover:text-gold transition-colors leading-tight">
          {tour.title[locale]}
        </h3>
        <p className="font-sans font-light text-[13.5px] text-ink-muted leading-[1.7] mb-6 flex-grow">
          {tour.shortDescription[locale]}
        </p>

        {/* Pricing & CTA */}
        <div className="flex justify-between items-end pt-5 border-t border-rule/20">
          <div>
            <p className="font-syne text-[9px] tracking-wider text-ink-faint uppercase mb-1">
              {locale === 'en' ? 'From' : 'À partir de'}
            </p>
            <p className="font-display italic text-2xl text-gold font-light">
              €{tour.price.amount}{' '}
              <span className="font-sans not-italic text-xs text-ink-faint ml-1">
                {locale === 'en' ? '/ rider' : '/ pers.'}
              </span>
            </p>
          </div>
          <Link
            href={`/${locale}/tours/${tour.slug}`}
            className="inline-flex items-center gap-1.5 border border-rule hover:border-gold hover:text-gold text-ink font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-2.5 transition-all duration-300"
          >
            {locale === 'en' ? 'Details' : 'Détails'}
            <span className="transform group-hover:translateX(2px) transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
