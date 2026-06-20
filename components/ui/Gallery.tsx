'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/content/tours';
import type { ApiGalleryItem } from '@/lib/api-client';

const CATEGORIES: Record<string, { en: string; fr: string }> = {
  all:    { en: 'All',            fr: 'Tout' },
  quads:  { en: 'Quad Biking',   fr: 'Quad' },
  camel:  { en: 'Camel Rides',   fr: 'Promenades en Chameau' },
  dinner: { en: 'Sunset & Dinner', fr: 'Coucher de Soleil & Dîner' },
  camp:   { en: 'Desert Camp',   fr: 'Camp du Désert' },
};

const PAGE_SIZE = 9;

interface GalleryProps {
  locale: Locale;
  images: ApiGalleryItem[];
}

export default function Gallery({ locale, images }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // All categories, always shown so users can explore
  const usedCategories = Object.keys(CATEGORIES);

  const filtered = activeCategory === 'all'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const changeCategory = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
    setLightboxIndex(null);
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex + 1) % filtered.length);
  const prevImage = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);

  if (images.length === 0) {
    return (
      <p className="text-center text-ink-muted font-sans text-sm">
        {locale === 'en' ? 'Gallery images will appear here soon.' : 'Les images de la galerie seront bientôt disponibles.'}
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* ── Category tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {usedCategories.map((cat) => {
          const count = cat === 'all' ? images.length : images.filter((img) => img.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`shrink-0 font-syne text-[10px] font-semibold tracking-[0.18em] uppercase px-5 py-2.5 border transition-all duration-200 flex items-center gap-2 ${
                activeCategory === cat
                  ? 'bg-gold text-background border-gold'
                  : 'border-rule/30 text-ink-muted hover:border-gold hover:text-gold'
              }`}
            >
              {CATEGORIES[cat]?.[locale] ?? cat}
              <span className={`text-[9px] font-normal tabular-nums ${activeCategory === cat ? 'opacity-70' : 'opacity-50'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Image grid ── */}
      {visible.length === 0 ? (
        <p className="text-center text-ink-muted font-sans text-sm py-16">
          {locale === 'en' ? 'No images in this category yet.' : 'Aucune image dans cette catégorie.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5 border border-rule/20 bg-rule/10">
          {visible.map((img, index) => (
            <div
              key={img.id}
              onClick={() => openLightbox(index)}
              className="group relative h-80 overflow-hidden cursor-pointer bg-bg-sunken border border-rule/10"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10 duration-500" />
              <Image
                alt={img.alt[locale]}
                src={img.url}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transform group-hover:scale-[1.03] transition-transform duration-700 filter saturate-[0.8]"
              />
              <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-syne text-[10px] font-semibold tracking-wider text-background bg-gold px-3.5 py-2">
                  {img.alt[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Load more ── */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="font-syne text-[10px] font-semibold tracking-[0.18em] uppercase px-8 py-3.5 border border-rule/30 text-ink-muted hover:border-gold hover:text-gold transition-all duration-200"
          >
            {locale === 'en'
              ? `Load more (${filtered.length - visibleCount} remaining)`
              : `Voir plus (${filtered.length - visibleCount} restantes)`}
          </button>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] bg-background/96 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-10 h-10 border border-rule/30 flex items-center justify-center text-ink-muted hover:border-gold hover:text-gold transition-colors z-[110]"
          >
            ✕
          </button>
          <button
            onClick={prevImage}
            className="absolute left-6 w-10 h-10 border border-rule/30 flex items-center justify-center text-ink-muted hover:border-gold hover:text-gold transition-colors z-[110]"
          >
            ⟨
          </button>
          <button
            onClick={nextImage}
            className="absolute right-6 w-10 h-10 border border-rule/30 flex items-center justify-center text-ink-muted hover:border-gold hover:text-gold transition-colors z-[110]"
          >
            ⟩
          </button>
          <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                alt={filtered[lightboxIndex].alt[locale]}
                src={filtered[lightboxIndex].url}
                fill
                className="object-contain filter saturate-[0.9]"
                priority
              />
            </div>
            <p className="font-syne text-[10px] text-center text-gold mt-6 tracking-widest uppercase">
              {filtered[lightboxIndex].alt[locale]}
            </p>
            <p className="font-syne text-[9px] text-ink-faint mt-1 tracking-wider">
              {lightboxIndex + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
