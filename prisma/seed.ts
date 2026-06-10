import '../lib/load-env';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Prisma } from '../generated/client';
import { PrismaClient } from '../generated/client';
import { tours } from '../content/tours';
import { hashPassword } from '../lib/password';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const gallerySeed = [
  {
    url: '/images/hero-agafay.png',
    alt: {
      en: 'Agafay desert stone plains at golden hour',
      fr: "Plaines pierreuses d'Agafay à l'heure dorée",
    },
    sortOrder: 1,
  },
  {
    url: '/images/tour-2h.png',
    alt: {
      en: 'Luxury quad biking in Agafay desert',
      fr: "Quad de luxe dans le désert d'Agafay",
    },
    sortOrder: 2,
  },
  {
    url: '/images/gallery-atlas.png',
    alt: {
      en: 'Atlas Mountains panorama from Agafay',
      fr: "Panorama de l'Atlas depuis Agafay",
    },
    sortOrder: 3,
  },
  {
    url: '/images/tour-sunset.png',
    alt: {
      en: 'Luxury desert dinner at sunset',
      fr: 'Dîner de luxe dans le désert au coucher du soleil',
    },
    sortOrder: 4,
  },
  {
    url: '/images/gallery-tea.png',
    alt: {
      en: 'Traditional Moroccan mint tea ceremony',
      fr: 'Cérémonie traditionnelle du thé à la menthe marocain',
    },
    sortOrder: 5,
  },
  {
    url: '/images/tour-private.png',
    alt: {
      en: 'Private quad over Agafay plateau',
      fr: "Quad privé sur le plateau d'Agafay",
    },
    sortOrder: 6,
  },
];

const reviewSeed = [
  {
    name: 'Charlotte Vance',
    rating: 5,
    country: 'United Kingdom',
    flag: '🇬🇧',
    reviewDate: 'May 2026',
    text: {
      en: 'Incredible experience from start to finish. The private transfer was punctual, clean, and comfortable. Our guide read the landscape like a poem — the tracks we took in Agafay were spectacular, not staged.',
      fr: "Une expérience incroyable du début à la fin. Le transfert privé était ponctuel, propre et confortable. Notre guide a lu le paysage comme un poème — les pistes d'Agafay étaient spectaculaires.",
    },
    tourSlug: 'quad-agafay-2h',
  },
  {
    name: 'Julien Mercier',
    rating: 5,
    country: 'France',
    flag: '🇫🇷',
    reviewDate: 'April 2026',
    text: {
      en: 'Absolute luxury in the desert. The quad bikes are brand new and perfectly maintained. The guide adapted the pace to our request. The tea break in the Berber tent at sunset was magical.',
      fr: 'Le luxe absolu dans le désert. Les quads sont neufs et parfaitement entretenus. Le guide a adapté le rythme à notre demande. La pause thé dans la tente berbère au coucher du soleil était magique.',
    },
    tourSlug: 'quad-sunset-dinner',
  },
  {
    name: 'Sarah Al-Mansoori',
    rating: 5,
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    reviewDate: 'March 2026',
    text: {
      en: 'Excellent service. The coordination via WhatsApp was fast and helpful. We booked the fully private VIP tour and it was customized to every single request we had. Five star hospitality!',
      fr: 'Excellent service. La coordination via WhatsApp était rapide et efficace. Nous avons réservé le tour VIP entièrement privé et il a été adapté à chacune de nos demandes. Une hospitalité 5 étoiles !',
    },
    tourSlug: 'private-luxury-quad',
  },
];

const ADMIN_EMAIL = 'luxuryquadadventure@gmail.com';
const ADMIN_DEFAULT_PASSWORD = '123456';

async function main() {
  console.log('Seeding database...');

  const passwordHash = await hashPassword(ADMIN_DEFAULT_PASSWORD);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: 'HS Luxury Quads Admin',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user ready: ${ADMIN_EMAIL}`);

  for (const tour of tours) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {
        title: tour.title,
        shortDescription: tour.shortDescription,
        fullDescription: tour.fullDescription,
        includes: tour.includes,
        highlights: tour.highlights,
        faqs: tour.faqs as unknown as Prisma.InputJsonValue,
        priceAmount: tour.price.amount,
        priceCurrency: tour.price.currency,
        priceDisplay: tour.price.display,
        duration: tour.duration,
        isActive: true,
      },
      create: {
        slug: tour.slug,
        title: tour.title,
        shortDescription: tour.shortDescription,
        fullDescription: tour.fullDescription,
        includes: tour.includes,
        highlights: tour.highlights,
        faqs: tour.faqs as unknown as Prisma.InputJsonValue,
        priceAmount: tour.price.amount,
        priceCurrency: tour.price.currency,
        priceDisplay: tour.price.display,
        duration: tour.duration,
        isActive: true,
      },
    });
  }

  const tourRecords = await prisma.tour.findMany({
    select: { id: true, slug: true },
  });
  const tourIdBySlug = Object.fromEntries(tourRecords.map((tour) => [tour.slug, tour.id]));

  for (const review of reviewSeed) {
    const tourId = tourIdBySlug[review.tourSlug];

    const existing = await prisma.review.findFirst({
      where: {
        name: review.name,
        reviewDate: review.reviewDate,
      },
    });

    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: {
          tourId,
          rating: review.rating,
          country: review.country,
          flag: review.flag,
          text: review.text,
          isPublished: true,
        },
      });
      continue;
    }

    await prisma.review.create({
      data: {
        tourId,
        name: review.name,
        rating: review.rating,
        country: review.country,
        flag: review.flag,
        reviewDate: review.reviewDate,
        text: review.text,
        isPublished: true,
      },
    });
  }

  for (const image of gallerySeed) {
    const existing = await prisma.gallery.findFirst({
      where: { url: image.url },
    });

    if (existing) {
      await prisma.gallery.update({
        where: { id: existing.id },
        data: {
          alt: image.alt,
          sortOrder: image.sortOrder,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.gallery.create({
      data: {
        url: image.url,
        alt: image.alt,
        sortOrder: image.sortOrder,
        isActive: true,
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
