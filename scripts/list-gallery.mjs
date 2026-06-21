import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const { PrismaClient } = await import('../generated/client/index.js');
const prisma = new PrismaClient();
const items = await prisma.gallery.findMany({ orderBy: [{ sortOrder: 'asc' }] });
for (const i of items) {
  const alt = i.alt && typeof i.alt === 'object' ? i.alt.en : String(i.alt);
  console.log(`${i.id} | ${i.category} | ${alt}`);
}
await prisma.$disconnect();
