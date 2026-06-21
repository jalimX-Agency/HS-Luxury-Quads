'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/ui/Lightbox';

interface TourImageGalleryProps {
  images: string[];
  alt: string;
}

export default function TourImageGallery({ images, alt }: TourImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length <= 1) return null;

  const lightboxImages = images.map((src) => ({ src, alt }));

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <p className="font-syne text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-6">
        Photos
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5 border border-rule/20 bg-rule/10">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative h-60 overflow-hidden cursor-pointer bg-bg-sunken border border-rule/10"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10 duration-500" />
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transform group-hover:scale-[1.03] transition-transform duration-700 filter saturate-[0.8]"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
