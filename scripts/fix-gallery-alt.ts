/**
 * Re-inserts Gallery DB entries with proper descriptive alt text.
 * Images are already in R2 — this only updates the DB.
 *
 * Usage: npx tsx --env-file=.env.local scripts/fix-gallery-alt.ts
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';

const FILE_ALT: Record<string, { en: string; fr: string }> = {
  '113091touractivitywhatsappimage20220816at18.04.44-sized.jpg': { en: 'Guide leading camel caravan at sunset', fr: 'Guide conduisant une caravane de chameaux au coucher du soleil' },
  '148.jpg': { en: 'Convoy of red quad bikes crossing the desert', fr: 'Convoi de quads rouges traversant le désert' },
  '3044660f9f5bdf671c301fffd6b1eec79e4a83133ca7f8350a76e767bb5bf087.jpeg': { en: 'Fire-breathing performer at desert dinner show', fr: 'Cracheur de feu lors du spectacle de dîner dans le désert' },
  '38.jpg': { en: 'Couple kissing inside a glowing heart arch at desert sunset', fr: "Couple s'embrassant sous un arc en cœur lumineux au coucher du soleil" },
  '5edfdb44-783e-4f27-b310-534a6ab5da7e-agafay-desert-sunset-camel-ride-and-dinner-from-marrakech.png': { en: 'Family camel ride at golden hour in Agafay', fr: "Promenade en chameau en famille à l'heure dorée" },
  '734f3c7d-274e-4b1b-ba8a-2ffd012cd054-marrakech-magical-agafay-dinner-music-fire-show.png': { en: 'Illuminated desert camp at dusk with string lights', fr: 'Camp désertique illuminé au crépuscule avec guirlandes' },
  '8de8f1a96903ef43.jpeg': { en: 'Moroccan mint tea service at desert sunset', fr: 'Service de thé à la menthe marocain au coucher du soleil' },
  'agafay-desert-camp-bonfire-1-.jpg': { en: 'Desert bonfire under a starry night sky', fr: 'Feu de camp dans le désert sous un ciel étoilé' },
  'agafay-desert.jpg': { en: 'Couple relaxing at luxury desert camp with Atlas views', fr: "Couple se détendant au camp de luxe avec vue sur l'Atlas" },
  'caption-69-.jpg': { en: 'Panoramic sunset view over Agafay desert camp', fr: "Vue panoramique au coucher du soleil sur le camp d'Agafay" },
  'caption-86-.jpg': { en: 'Moroccan dinner spread at sunset in the desert', fr: 'Dîner marocain au coucher du soleil dans le désert' },
  'caption-90-.jpg': { en: 'Fire hoop performer at Agafay desert evening show', fr: 'Artiste au cerceau de feu lors du spectacle du soir' },
  'caption-92-.jpg': { en: 'Woman smiling on camelback in Agafay Desert', fr: "Femme souriante à dos de chameau dans le désert d'Agafay" },
  'caption-93-.jpg': { en: 'Camel caravan resting with Atlas mountains backdrop', fr: "Caravane de chameaux avec l'Atlas en toile de fond" },
  'caption-95-.jpg': { en: 'Group of quads on a dusty trail with Atlas mountains', fr: "Groupe de quads sur une piste poussiéreuse avec l'Atlas" },
  'caption-96-.jpg': { en: 'Two women on a quad bike at desert sunset', fr: 'Deux femmes sur un quad au coucher du soleil' },
  'caption---2025-11-21t002934.815.jpg': { en: 'Couple riding camel at desert camp sunset', fr: 'Couple à dos de chameau au coucher du soleil' },
  'caption---2025-11-29t132040.061.jpg': { en: 'Guests and quads parked at Agafay sunset viewpoint', fr: "Invités et quads au point de vue coucher de soleil d'Agafay" },
  'caption---2025-11-30t020105.644.jpg': { en: 'Waiter serving bread baskets at desert dinner', fr: 'Serveur portant des paniers de pain lors du dîner' },
  'caption---2025-12-03t155431.298.jpg': { en: 'Mother and daughter riding camel in Agafay', fr: "Mère et fille à dos de chameau dans l'Agafay" },
  'caption---2025-12-08t014510.942.jpg': { en: 'Woman in orange desert headscarf with henna hands', fr: 'Femme en foulard orange du désert avec mains au henné' },
  'caption---2026-01-02t233239.870.jpg': { en: 'Moroccan woven basket with desert camp ambiance', fr: "Panier tressé marocain dans l'ambiance du camp" },
  'eyjiduNrZXqioijmaXRyzwlzzu4tdgnuawltywdlcyisimtlesi6ijm0rdi1ruvcmji0meu2nkvgothhqzlgqjewmdawruqxiiwizwrpdhmionsiicmvzaxploij3imlkdggiojeyodasiijmaxqioijjb3zlcicsincpvc2l0aw9uijoimnvudgvyIn19fq--.jpeg': { en: 'Moroccan spa massage by candlelight', fr: 'Massage du spa marocain à la lueur des bougies' },
  'from-marrakech-desert-agafay-quad-tour-with-dinner-show-3630925.jpg': { en: 'Quad bikes lined up at blue-hour sunset', fr: 'Quads alignés au coucher du soleil' },
  'images-18-.jpeg': { en: 'Three women celebrating on quad bikes near a lake', fr: "Trois femmes célébrant sur des quads près d'un lac" },
  'marrakech-dinner-in-the-agafay-desert-sunet-with-show-5113155.jpg': { en: 'Fire breather performing for desert dinner guests', fr: 'Cracheur de feu se produisant pour les convives du dîner' },
  'quad-agafay-sur-le-fil-60dpi-1.jpg': { en: 'Solo quad rider on an Agafay desert ridge', fr: "Pilote solo en quad sur une crête du désert d'Agafay" },
  'snapinsta-app-460830121-18013319531625690-2118770065894460663-n-1080-jpg.webp': { en: 'Female fire performer at desert evening show', fr: 'Artiste féminine au feu lors du spectacle du soir' },
  'sunset-agafay-desert-camel-ride-1.jpg': { en: 'Three camel riders silhouetted against desert sunset', fr: 'Trois chameaux en silhouette au coucher du soleil dans le désert' },
  'sunset.jpeg': { en: 'Desert dining tables bathed in golden sunset light', fr: 'Tables de dîner dans la lumière dorée du coucher du soleil' },
};

function getAlt(url: string): { en: string; fr: string } {
  // Extract the sanitized filename part after the timestamp prefix
  const key = url.split('/').pop() ?? '';
  const filenameWithoutTs = key.replace(/^\d+-/, '');

  // Direct match
  if (FILE_ALT[filenameWithoutTs]) return FILE_ALT[filenameWithoutTs];

  // Fuzzy: try partial key match
  for (const [k, v] of Object.entries(FILE_ALT)) {
    if (filenameWithoutTs.startsWith(k.slice(0, 20))) return v;
  }

  // Fallback: humanize the key
  const name = filenameWithoutTs.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');
  return { en: name, fr: name };
}

async function main() {
  const items = await prisma.gallery.findMany({ orderBy: { sortOrder: 'asc' } });
  console.log(`\nUpdating alt text for ${items.length} gallery entries...\n`);

  for (const item of items) {
    const alt = getAlt(item.url);
    await prisma.gallery.update({ where: { id: item.id }, data: { alt } });
    console.log(`  ✓ ${alt.en}`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
