'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const current = images[index];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/96 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 border border-rule/30 flex items-center justify-center text-ink-muted hover:border-gold hover:text-gold transition-colors z-[110]"
        aria-label="Close"
      >
        ✕
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 w-10 h-10 border border-rule/30 flex items-center justify-center text-ink-muted hover:border-gold hover:text-gold transition-colors z-[110]"
            aria-label="Previous"
          >
            ⟨
          </button>
          <button
            onClick={next}
            className="absolute right-6 w-10 h-10 border border-rule/30 flex items-center justify-center text-ink-muted hover:border-gold hover:text-gold transition-colors z-[110]"
            aria-label="Next"
          >
            ⟩
          </button>
        </>
      )}
      <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            alt={current.alt}
            src={current.src}
            fill
            className="object-contain filter saturate-[0.9]"
            priority
          />
        </div>
        <p className="font-syne text-[10px] text-center text-gold mt-6 tracking-widest uppercase">
          {current.alt}
        </p>
        {images.length > 1 && (
          <p className="font-syne text-[9px] text-ink-faint mt-1 tracking-wider">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
