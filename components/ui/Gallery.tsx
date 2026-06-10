'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/content/tours';
import type { ApiGalleryItem } from '@/lib/api-client';

interface GalleryProps {
  locale: Locale;
  images: ApiGalleryItem[];
}

export default function Gallery({ locale, images }: GalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
    }
  };

  if (images.length === 0) {
    return (
      <p className="text-center text-ink-muted font-sans text-sm">
        {locale === 'en' ? 'Gallery images will appear here soon.' : 'Les images de la galerie seront bientôt disponibles.'}
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5 border border-rule/20 bg-rule/10">
        {images.map((img, index) => (
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

      {activeImageIndex !== null && (
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
                alt={images[activeImageIndex].alt[locale]}
                src={images[activeImageIndex].url}
                fill
                className="object-contain filter saturate-[0.9]"
                priority
              />
            </div>
            <p className="font-syne text-[10px] text-center text-gold mt-6 tracking-widest uppercase">
              {images[activeImageIndex].alt[locale]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
