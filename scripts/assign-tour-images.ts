/**
 * Assign the already-uploaded R2 images to each tour in the DB.
 * Run after upload-client-media.ts has completed.
 *
 * Usage: npx tsx --env-file=.env.local scripts/assign-tour-images.ts
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

// URLs from the upload run
const TOUR_IMAGES: Record<string, { urls: string[]; keys: string[] }> = {
  'full-pack-quad-camel-dinner': {
    urls: [
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901091272-caption-96-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901085975-caption-92-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901082879-caption-86-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901064699-3044660f9f5bdf671c301fffd6b1eec79e4a83133ca7f8350a76e767bb5bf087.jpeg',
    ],
    keys: [
      'gallery/1781901091272-caption-96-.jpg',
      'gallery/1781901085975-caption-92-.jpg',
      'gallery/1781901082879-caption-86-.jpg',
      'gallery/1781901064699-3044660f9f5bdf671c301fffd6b1eec79e4a83133ca7f8350a76e767bb5bf087.jpeg',
    ],
  },
  'quad-dinner-show': {
    urls: [
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901105843-quad-agafay-sur-le-fil-60dpi-1.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901080166-caption-69-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901082879-caption-86-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901102401-from-marrakech-desert-agafay-quad-tour-with-dinner-show-3630925.jpg',
    ],
    keys: [
      'gallery/1781901105843-quad-agafay-sur-le-fil-60dpi-1.jpg',
      'gallery/1781901080166-caption-69-.jpg',
      'gallery/1781901082879-caption-86-.jpg',
      'gallery/1781901102401-from-marrakech-desert-agafay-quad-tour-with-dinner-show-3630925.jpg',
    ],
  },
  'camel-dinner-show': {
    urls: [
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901063093-113091touractivitywhatsappimage20220816at18.04.44-sized.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901080166-caption-69-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901084832-caption-90-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901066560-8de8f1a96903ef43.jpeg',
    ],
    keys: [
      'gallery/1781901063093-113091touractivitywhatsappimage20220816at18.04.44-sized.jpg',
      'gallery/1781901080166-caption-69-.jpg',
      'gallery/1781901084832-caption-90-.jpg',
      'gallery/1781901066560-8de8f1a96903ef43.jpeg',
    ],
  },
  'dinner-show-only': {
    urls: [
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901118000-sunset.jpeg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901082879-caption-86-.jpg',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901116000-snapinsta-app-460830121-18013319531625690-2118770065894460663-n-1080-jpg.webp',
      'https://pub-90d45018967a41199270841fbcd46da1.r2.dev/gallery/1781901074000-agafay-desert-camp-bonfire-1-.jpg',
    ],
    keys: [
      'gallery/1781901118000-sunset.jpeg',
      'gallery/1781901082879-caption-86-.jpg',
      'gallery/1781901116000-snapinsta-app-460830121-18013319531625690-2118770065894460663-n-1080-jpg.webp',
      'gallery/1781901074000-agafay-desert-camp-bonfire-1-.jpg',
    ],
  },
};

async function main() {
  // First, get actual uploaded URLs from the gallery table to use correct keys
  const galleryItems = await prisma.gallery.findMany({ select: { url: true, imageKey: true } });
  const urlToKey = new Map(galleryItems.map(g => [g.url, g.imageKey]));

  console.log('\nAssigning images to tours...');

  for (const [slug, { urls }] of Object.entries(TOUR_IMAGES)) {
    const tour = await prisma.tour.findUnique({ where: { slug } });
    if (!tour) { console.log(`  ⚠ Not found: ${slug}`); continue; }

    // Find best matching URLs from what was actually uploaded
    // Match by the pattern part of the URL (after the timestamp)
    const matchedUrls: string[] = [];
    const matchedKeys: string[] = [];

    for (const targetUrl of urls) {
      // Try exact match first
      const exact = galleryItems.find(g => g.url === targetUrl);
      if (exact) {
        matchedUrls.push(exact.url);
        matchedKeys.push(exact.imageKey ?? '');
        continue;
      }
      // Try partial match on the filename part
      const targetFile = targetUrl.split('/').pop()?.replace(/^\d+-/, '') ?? '';
      const fuzzy = galleryItems.find(g => {
        const gFile = g.url.split('/').pop()?.replace(/^\d+-/, '') ?? '';
        return gFile === targetFile;
      });
      if (fuzzy) {
        matchedUrls.push(fuzzy.url);
        matchedKeys.push(fuzzy.imageKey ?? '');
      } else {
        console.log(`    ⚠ No match for: ${targetFile}`);
      }
    }

    await prisma.tour.update({
      where: { slug },
      data: { images: matchedUrls, imageKeys: matchedKeys },
    });
    console.log(`  ✓ ${slug}: ${matchedUrls.length} images assigned`);
    for (const u of matchedUrls) console.log(`      → ${u}`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
