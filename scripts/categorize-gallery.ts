import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// keyword → category mapping, checked against alt.en (lowercased)
const RULES: { keywords: string[]; category: string }[] = [
  { keywords: ['quad', 'quads', 'quad bike', 'quad rider'], category: 'quads' },
  { keywords: ['camel', 'chameau', 'camelback', 'camel ride', 'camel caravan', 'camel rider'], category: 'camel' },
  { keywords: ['dinner', 'dîner', 'fire', 'waiter', 'mint tea', 'dining', 'bread', 'fire-breathing', 'fire breather', 'fire hoop', 'fire performer', 'string lights', 'illuminated'], category: 'dinner' },
  { keywords: ['camp', 'bonfire', 'luxury desert', 'luxury camp', 'tents', 'headscarf', 'basket', 'heart arch', 'relaxing', 'henna', 'spa', 'massage'], category: 'camp' },
];

function detectCategory(altEn: string): string {
  const lower = altEn.toLowerCase();

  // Check in priority order — quads first so "quad bikes lined" doesn't match dinner accidentally
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }

  return 'all';
}

async function main() {
  const items = await prisma.gallery.findMany({ orderBy: [{ sortOrder: 'asc' }] });

  const updates: { id: string; old: string; new: string; alt: string }[] = [];

  for (const item of items) {
    const alt = typeof item.alt === 'object' && item.alt !== null ? (item.alt as { en: string }).en : '';
    const detected = detectCategory(alt);
    updates.push({ id: item.id, old: item.category, new: detected, alt });
  }

  // Preview
  console.log('\n=== CATEGORY ASSIGNMENTS ===\n');
  for (const u of updates) {
    const changed = u.old !== u.new ? ' ← CHANGED' : '';
    console.log(`[${u.new.padEnd(6)}]${changed}`);
    console.log(`  ${u.alt.substring(0, 80)}`);
    console.log(`  id: ${u.id}\n`);
  }

  // Apply updates
  console.log('Applying updates...');
  for (const u of updates) {
    if (u.old !== u.new) {
      await prisma.gallery.update({
        where: { id: u.id },
        data: { category: u.new },
      });
      console.log(`  ✓ Updated ${u.id} → ${u.new}`);
    } else {
      console.log(`  – Skipped ${u.id} (already ${u.old})`);
    }
  }

  await prisma.$disconnect();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
