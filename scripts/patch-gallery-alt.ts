/**
 * Patches the 7 gallery entries whose alt text fell back to filename-derived text.
 * Matches by URL substring so we don't need to know exact timestamps.
 *
 * Usage: npx tsx scripts/patch-gallery-alt.ts
 */

import { prisma } from '../lib/prisma';

const PATCHES: Array<{ urlContains: string; alt: { en: string; fr: string } }> = [
  { urlContains: 'caption-2025-11-21t', alt: { en: 'Couple riding camel at desert camp sunset', fr: 'Couple à dos de chameau au coucher du soleil dans le camp' } },
  { urlContains: 'caption-2025-11-29t', alt: { en: 'Guests and quads parked at Agafay sunset viewpoint', fr: "Invités et quads au point de vue coucher de soleil d'Agafay" } },
  { urlContains: 'caption-2025-11-30t', alt: { en: 'Waiter serving bread baskets at desert dinner', fr: 'Serveur portant des paniers de pain lors du dîner dans le désert' } },
  { urlContains: 'caption-2025-12-03t', alt: { en: 'Mother and daughter riding camel in Agafay', fr: "Mère et fille à dos de chameau dans le désert d'Agafay" } },
  { urlContains: 'caption-2025-12-08t', alt: { en: 'Woman in orange desert headscarf with henna hands', fr: 'Femme en foulard orange du désert avec mains au henné' } },
  { urlContains: 'caption-2026-01-02t', alt: { en: 'Moroccan woven basket with desert camp ambiance', fr: "Panier tressé marocain dans l'ambiance du camp désert" } },
  { urlContains: 'eyjiduNrZXqi', alt: { en: 'Moroccan spa massage by candlelight', fr: 'Massage du spa marocain à la lueur des bougies' } },
];

// Also patch the base64 one — try lowercase since R2 key is sanitized lowercase
const PATCHES_LOWER = PATCHES.map(p => ({ ...p, urlContains: p.urlContains.toLowerCase() }));

async function main() {
  const all = await prisma.gallery.findMany({ select: { id: true, url: true, alt: true } });

  let patched = 0;
  for (const patch of PATCHES_LOWER) {
    const item = all.find(g => g.url.toLowerCase().includes(patch.urlContains));
    if (!item) {
      console.log(`  ⚠ No match for: ${patch.urlContains}`);
      continue;
    }
    await prisma.gallery.update({ where: { id: item.id }, data: { alt: patch.alt } });
    console.log(`  ✓ ${patch.alt.en}`);
    patched++;
  }

  await prisma.$disconnect();
  console.log(`\n✅ Patched ${patched}/${PATCHES.length} entries`);
}

main().catch(err => { console.error(err); process.exit(1); });
