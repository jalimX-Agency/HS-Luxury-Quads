/**
 * One-off script: uploads real client photos to Cloudflare R2,
 * inserts Gallery DB entries, and assigns hero images to each tour.
 *
 * Usage: node scripts/upload-client-media.mjs
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import pkg from '../generated/client.js';
const { PrismaClient } = pkg;
import { readFileSync, existsSync } from 'fs';
import { extname, basename } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const MEDIA_DIR = 'C:\\Users\\pc\\Documents\\JalimX\\clients\\hs luxury quads\\media';

// Images to skip (unrelated spa/hammam content identified by visual inspection)
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

// Tour image assignments: { tourSlug: [filename in upload order, first = hero] }
const TOUR_IMAGES = {
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

const EXT_TO_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Strip double extension: "file.jpg.jpeg" → "file.jpg"
function cleanExtension(filename) {
  // Match double ext patterns like .jpg.jpeg, .png.jpeg
  return filename.replace(/\.(jpg|png|webp|gif)\.jpeg$/i, '.jpg')
                 .replace(/\.(jpg|png|webp|gif)\.(jpg|png|webp|gif)$/i, '.$1');
}

function getMime(filename) {
  const cleaned = cleanExtension(filename);
  const ext = extname(cleaned).toLowerCase();
  return EXT_TO_MIME[ext] ?? 'image/jpeg';
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const prisma = new PrismaClient();

async function uploadFile(filename) {
  const filePath = join(MEDIA_DIR, filename);
  const buffer = readFileSync(filePath);
  const mime = getMime(filename);
  const cleanName = cleanExtension(filename);
  const key = `gallery/${Date.now()}-${sanitizeFilename(cleanName)}`;

  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mime,
  }));

  const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${key}`;
  return { key, publicUrl };
}

async function main() {
  const { readdirSync } = await import('fs');
  const files = readdirSync(MEDIA_DIR).filter(f => !SKIP.has(f) && /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  console.log(`\nUploading ${files.length} images to R2...\n`);

  // Map: filename → { key, publicUrl }
  const uploaded = {};

  // Upload all files
  for (const filename of files) {
    process.stdout.write(`  ↑ ${filename.slice(0, 60).padEnd(62)}`);
    try {
      const result = await uploadFile(filename);
      uploaded[filename] = result;
      console.log(`✓`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }

  console.log('\nInserting Gallery entries...');

  // Delete existing gallery entries that we'll replace
  await prisma.gallery.deleteMany({});

  let sortOrder = 1;
  for (const filename of files) {
    if (!uploaded[filename]) continue;
    await prisma.gallery.create({
      data: {
        url: uploaded[filename].publicUrl,
        key: uploaded[filename].key,
        isActive: true,
        sortOrder: sortOrder++,
      },
    });
  }

  console.log(`  ✓ ${sortOrder - 1} gallery entries created`);

  console.log('\nAssigning images to tours...');

  for (const [tourSlug, imageFiles] of Object.entries(TOUR_IMAGES)) {
    const tour = await prisma.tour.findUnique({ where: { slug: tourSlug } });
    if (!tour) {
      console.log(`  ⚠ Tour not found: ${tourSlug}`);
      continue;
    }

    const urls = imageFiles.map(f => uploaded[f]?.publicUrl).filter(Boolean);
    const keys = imageFiles.map(f => uploaded[f]?.key).filter(Boolean);

    await prisma.tour.update({
      where: { slug: tourSlug },
      data: { images: urls, imageKeys: keys },
    });

    console.log(`  ✓ ${tourSlug}: ${urls.length} images assigned`);
  }

  console.log('\n✅ Done!\n');
  console.log('Tour image assignments:');
  for (const [slug, files] of Object.entries(TOUR_IMAGES)) {
    console.log(`\n  ${slug}:`);
    for (const f of files) {
      const u = uploaded[f];
      if (u) console.log(`    • ${u.publicUrl}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
