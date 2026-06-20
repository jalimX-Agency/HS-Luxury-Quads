/**
 * One-off script: uploads real client photos to Cloudflare R2,
 * inserts Gallery DB entries, and assigns hero images to each tour.
 *
 * Usage: npx tsx scripts/upload-client-media.ts
 */

import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync } from 'fs';
import { extname, join } from 'path';
import { prisma } from '../lib/prisma';

const MEDIA_DIR = 'C:\\Users\\pc\\Documents\\JalimX\\clients\\hs luxury quads\\media';

const FILE_ALT: Record<string, { en: string; fr: string }> = {
  'caption (96).jpg.jpeg':   { en: 'Two women on a quad bike at desert sunset', fr: 'Deux femmes sur un quad au coucher du soleil' },
  'QUAD-AGAFAY-SUR-LE-FIL-60dpi-1.jpg.jpeg': { en: 'Solo quad rider on an Agafay desert ridge', fr: "Pilote solo en quad sur une crête du désert d'Agafay" },
  '148.jpg.jpeg':            { en: 'Convoy of red quad bikes crossing the desert', fr: 'Convoi de quads rouges traversant le désert' },
  'caption (95).jpg.jpeg':   { en: 'Group of quads on a dusty trail with Atlas mountains', fr: "Groupe de quads sur une piste poussiéreuse avec l'Atlas" },
  'caption (69).jpg.jpeg':   { en: 'Panoramic sunset view over Agafay desert camp', fr: "Vue panoramique au coucher du soleil sur le camp d'Agafay" },
  'caption (86).jpg.jpeg':   { en: 'Moroccan dinner spread at sunset in the desert', fr: 'Dîner marocain au coucher du soleil dans le désert' },
  'from-marrakech-desert-agafay-quad-tour-with-dinner-show-3630925.jpg.jpeg': { en: 'Quad bikes lined up at blue-hour sunset', fr: 'Quads alignés au coucher du soleil' },
  '3044660f9f5bdf671c301fffd6b1eec79e4a83133ca7f8350a76e767bb5bf087.jpeg': { en: 'Fire-breathing performer at desert dinner show', fr: 'Cracheur de feu lors du spectacle de dîner dans le désert' },
  'agafay-desert.jpg.jpeg':  { en: 'Couple relaxing at luxury desert camp with Atlas views', fr: "Couple se détendant au camp de luxe avec vue sur l'Atlas" },
  'caption (92).jpg.jpeg':   { en: 'Woman smiling on camelback in Agafay Desert', fr: "Femme souriante à dos de chameau dans le désert d'Agafay" },
  'images (18).jpeg':        { en: 'Three women celebrating on quad bikes near a lake', fr: 'Trois femmes célébrant sur des quads près d\'un lac' },
  '38.jpg.jpeg':             { en: 'Couple kissing inside a glowing heart arch at desert sunset', fr: "Couple s'embrassant sous un arc en cœur lumineux au coucher du soleil" },
  'sunset-agafay-desert-camel-ride-1.jpg.jpeg': { en: 'Three camel riders silhouetted against desert sunset', fr: 'Trois chameaux en silhouette au coucher du soleil dans le désert' },
  'caption (90).jpg.jpeg':   { en: 'Fire hoop performer at Agafay desert evening show', fr: 'Artiste au cerceau de feu lors du spectacle du soir' },
  'caption (93).jpg.jpeg':   { en: 'Camel caravan resting with Atlas mountains backdrop', fr: "Caravane de chameaux avec l'Atlas en toile de fond" },
  'caption - 2025-11-21T002934.815.jpg.jpeg': { en: 'Couple riding camel at desert camp sunset', fr: 'Couple à dos de chameau au coucher du soleil' },
  'caption - 2025-11-29T132040.061.jpg.jpeg': { en: 'Guests and quads parked at Agafay sunset viewpoint', fr: 'Invités et quads au point de vue coucher de soleil d\'Agafay' },
  'caption - 2025-11-30T020105.644.jpg.jpeg': { en: 'Waiter serving bread baskets at desert dinner', fr: 'Serveur portant des paniers de pain lors du dîner' },
  'caption - 2025-12-03T155431.298.jpg.jpeg': { en: 'Mother and daughter riding camel in Agafay', fr: "Mère et fille à dos de chameau dans l'Agafay" },
  'caption - 2025-12-08T014510.942.jpg.jpeg': { en: 'Woman in orange desert headscarf with henna hands', fr: 'Femme en foulard orange du désert avec mains au henné' },
  'caption - 2026-01-02T233239.870.jpg.jpeg': { en: 'Moroccan woven basket with desert camp ambiance', fr: "Panier tressé marocain dans l'ambiance du camp" },
  '113091touractivitywhatsappimage20220816at18.04.44_sized.jpg.jpeg': { en: 'Guide leading camel caravan at sunset', fr: 'Guide conduisant une caravane de chameaux au coucher du soleil' },
  'Agafay-Desert-camp-bonfire (1).jpg.jpeg': { en: 'Desert bonfire under a starry night sky', fr: 'Feu de camp dans le désert sous un ciel étoilé' },
  '5edfdb44-783e-4f27-b310-534a6ab5da7e_agafay-desert-sunset-camel-ride-and-dinner-from-marrakech.png': { en: 'Family camel ride at golden hour in Agafay', fr: "Promenade en chameau en famille à l'heure dorée" },
  '734f3c7d-274e-4b1b-ba8a-2ffd012cd054_marrakech-magical-agafay-dinner-music-fire-show.png': { en: 'Illuminated desert camp at dusk with string lights', fr: 'Camp désertique illuminé au crépuscule avec guirlandes' },
  '8de8f1a96903ef43.jpeg':   { en: 'Moroccan mint tea service at desert sunset', fr: 'Service de thé à la menthe marocain au coucher du soleil' },
  'marrakech-dinner-in-the-agafay-desert-sunet-with-show-5113155.jpg.jpeg': { en: 'Fire breather performing for desert dinner guests', fr: 'Cracheur de feu se produisant pour les convives du dîner' },
  'snapinsta-app-460830121-18013319531625690-2118770065894460663-n-1080-jpg.webp': { en: 'Female fire performer at desert evening show', fr: 'Artiste féminine au feu lors du spectacle du soir' },
  'sunset.jpeg':             { en: 'Desert dining tables bathed in golden sunset light', fr: 'Tables de dîner dans la lumière dorée du coucher du soleil' },
  'eyJidWNrZXQiOiJmaXRyZWlzZW4tY2RuLWltYWdlcyIsImtleSI6IjM0RDI1RUJEMjI0MEU2NkVGOThBQzlGQjEwMDAwRUQxIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoxMjgwLCJmaXQiOiJjb3ZlciIsInBvc2l0aW9uIjoiY2VudGVyIn19fQ==.jpeg': { en: 'Moroccan spa massage by candlelight', fr: 'Massage du spa marocain à la lueur des bougies' },
};

const SKIP = new Set([
  'cela-hammam-spa-servies-in-hurghada-2.webp',
  'cela-hammam-spa-servies-in-hurghada-62.webp',
  'Screenshot_20260421_111832_Chrome.jpg.jpeg',
  'Screenshot_20260421_111859_Chrome.jpg.jpeg',
  'Screenshot_20260421_112023_Chrome.jpg.jpeg',
  'Screenshot_20260421_112108_Chrome.jpg.jpeg',
  'Screenshot_20260421_112121_Chrome.jpg.jpeg',
  '04 (1).jpg.jpeg',
  'download.png',
  'DC6C0D1C-9CB7-4D54-9636-CA458EC95612-scaled.jpeg',
  'caption - 2026-01-02T233244.670.jpg.jpeg',
  'caption - 2026-01-02T233330.241.jpg.jpeg',
]);

const TOUR_IMAGES: Record<string, string[]> = {
  'quad-agafay-2h': [
    'caption (96).jpg.jpeg',
    'QUAD-AGAFAY-SUR-LE-FIL-60dpi-1.jpg.jpeg',
    '148.jpg.jpeg',
    'caption (95).jpg.jpeg',
  ],
  'quad-sunset-dinner': [
    'caption (69).jpg.jpeg',
    'caption (86).jpg.jpeg',
    'from-marrakech-desert-agafay-quad-tour-with-dinner-show-3630925.jpg.jpeg',
    '3044660f9f5bdf671c301fffd6b1eec79e4a83133ca7f8350a76e767bb5bf087.jpeg',
  ],
  'private-luxury-quad': [
    'agafay-desert.jpg.jpeg',
    'caption (92).jpg.jpeg',
    'images (18).jpeg',
    '38.jpg.jpeg',
  ],
};

const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function cleanExtension(filename: string): string {
  return filename
    .replace(/\.(jpg|png|webp|gif)\.jpeg$/i, '.jpg')
    .replace(/\.(jpg|png|webp|gif)\.(jpg|png|webp|gif)$/i, '.$1');
}

function getMime(filename: string): string {
  const ext = extname(cleanExtension(filename)).toLowerCase();
  return EXT_TO_MIME[ext] ?? 'image/jpeg';
}

function sanitize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function uploadFile(filename: string): Promise<{ key: string; publicUrl: string }> {
  const buffer = readFileSync(join(MEDIA_DIR, filename));
  const cleanName = cleanExtension(filename);
  const key = `gallery/${Date.now()}-${sanitize(cleanName)}`;

  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: getMime(filename),
  }));

  return { key, publicUrl: `${process.env.NEXT_PUBLIC_R2_URL}/${key}` };
}

async function main() {
  const files = readdirSync(MEDIA_DIR).filter(
    f => !SKIP.has(f) && /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
  );

  console.log(`\nUploading ${files.length} images to R2...\n`);

  const uploaded: Record<string, { key: string; publicUrl: string }> = {};

  for (const filename of files) {
    const label = filename.slice(0, 58).padEnd(60);
    process.stdout.write(`  ↑ ${label}`);
    try {
      uploaded[filename] = await uploadFile(filename);
      console.log(`✓`);
    } catch (err: any) {
      console.log(`✗ ${err.message}`);
    }
  }

  console.log('\nClearing existing gallery and inserting new entries...');
  await prisma.gallery.deleteMany({});

  let sortOrder = 1;
  for (const filename of files) {
    if (!uploaded[filename]) continue;
    const alt = FILE_ALT[filename] ?? (() => {
      const name = cleanExtension(filename).replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');
      return { en: name, fr: name };
    })();
    await prisma.gallery.create({
      data: {
        url: uploaded[filename].publicUrl,
        imageKey: uploaded[filename].key,
        alt,
        isActive: true,
        sortOrder: sortOrder++,
      },
    });
  }
  console.log(`  ✓ ${sortOrder - 1} gallery entries created`);

  console.log('\nAssigning images to tours...');
  for (const [tourSlug, imageFiles] of Object.entries(TOUR_IMAGES)) {
    const tour = await prisma.tour.findUnique({ where: { slug: tourSlug } });
    if (!tour) { console.log(`  ⚠ Tour not found: ${tourSlug}`); continue; }

    const urls = imageFiles.map(f => uploaded[f]?.publicUrl).filter(Boolean) as string[];
    const keys = imageFiles.map(f => uploaded[f]?.key).filter(Boolean) as string[];

    await prisma.tour.update({ where: { slug: tourSlug }, data: { images: urls, imageKeys: keys } });
    console.log(`  ✓ ${tourSlug}: ${urls.length} images`);
  }

  console.log('\n✅ Done! Summary:\n');
  for (const [slug, files] of Object.entries(TOUR_IMAGES)) {
    console.log(`  ${slug}:`);
    for (const f of files) {
      const u = uploaded[f];
      if (u) console.log(`    → ${u.publicUrl}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
