'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Lightbox = dynamic(() => import('@/components/ui/Lightbox'), { ssr: false });

interface DesertGalleryItem {
  url: string;
  alt: string;
}

interface DesertGalleryProps {
  items: DesertGalleryItem[];
}

export default function DesertGallery({ items }: DesertGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const lightboxImages = items.map((item) => ({ src: item.url, alt: item.alt }));

  const tileClass = 'gallery-item relative cursor-pointer overflow-hidden group';
  const overlay = 'absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10';
  const imgClass = 'object-cover filter saturate-[0.8] group-hover:scale-[1.03] transition-transform duration-700';

  return (
    <>
      <div className="grid grid-cols-12 grid-rows-2 gap-1" style={{ height: 'clamp(400px, 55vw, 700px)' }}>
        {items[0] && (
          <div className={`col-span-5 row-span-2 ${tileClass}`} onClick={() => open(0)}>
            <div className={overlay} />
            <Image alt={items[0].alt} src={items[0].url} fill className={imgClass} sizes="42vw" />
          </div>
        )}
        {items[1] && (
          <div className={`col-span-4 row-span-1 ${tileClass}`} onClick={() => open(1)}>
            <div className={overlay} />
            <Image alt={items[1].alt} src={items[1].url} fill className={imgClass} sizes="33vw" />
          </div>
        )}
        {items[2] && (
          <div className={`col-span-3 row-span-1 ${tileClass}`} onClick={() => open(2)}>
            <div className={overlay} />
            <Image alt={items[2].alt} src={items[2].url} fill className={imgClass} sizes="25vw" />
          </div>
        )}
        {items[3] && (
          <div className={`col-span-4 row-span-1 ${tileClass}`} onClick={() => open(3)}>
            <div className={overlay} />
            <Image alt={items[3].alt} src={items[3].url} fill className={imgClass} sizes="33vw" />
          </div>
        )}
        {items[4] && (
          <div className={`col-span-3 row-span-1 ${tileClass}`} onClick={() => open(4)}>
            <div className={overlay} />
            <Image alt={items[4].alt} src={items[4].url} fill className={imgClass} sizes="25vw" />
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={lightboxImages} startIndex={lightboxIndex} onClose={close} />
      )}
    </>
  );
}
