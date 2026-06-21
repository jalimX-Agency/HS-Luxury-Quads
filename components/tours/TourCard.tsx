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
  const imageSrc = tour.images?.[0] ?? null;

  return (
    <div className="group bg-bg-subtle border border-rule/30 overflow-hidden hover:border-gold transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="h-72 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
        {imageSrc ? (
          <Image
            alt={tour.title[locale]}
            width={640}
            height={380}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter saturate-[0.85]"
            src={imageSrc}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, oklch(12% 0.03 72), oklch(8% 0.01 75))' }} />
        )}
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

        {/* Location pill */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="font-syne text-[9px] font-medium tracking-wider text-ink-faint uppercase">
            📍 Agafay Desert, Marrakech
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-5 border-t border-rule/20">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="font-syne text-[9px] tracking-wider text-ink-faint uppercase mb-1">
                {locale === 'en' ? 'From' : 'À partir de'}
              </p>
              <p className="font-display italic text-2xl text-gold font-light">
                {tour.price.amount} Dh{' '}
                <span className="font-sans not-italic text-xs text-ink-faint ml-1">
                  {locale === 'en' ? '/ rider' : '/ pers.'}
                </span>
              </p>
            </div>
          </div>

          {/* Primary CTA — WhatsApp */}
          <a
            href={`https://wa.me/212634857515?text=${encodeURIComponent(tour.whatsappMsg ?? (locale === 'en' ? `Hi, I'd like to book the ${tour.title.en} experience` : `Bonjour, je souhaite réserver l'expérience ${tour.title.fr}`))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-3 mb-2 transition-all duration-300 hover:opacity-90"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {locale === 'en' ? 'Reserve on WhatsApp' : 'Réserver sur WhatsApp'}
          </a>

          {/* Secondary CTA — View Details */}
          <Link
            href={`/${locale}/tours/${tour.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 border border-rule/40 hover:border-gold hover:text-gold text-ink-muted font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-2.5 transition-all duration-300"
          >
            {locale === 'en' ? 'View Details' : 'Voir Détails'}
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
