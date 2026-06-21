import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.tour.findUnique({ where: { slug: 'horse-dinner-show' } });
  if (existing) {
    console.log('Tour "horse-dinner-show" already exists — skipping.');
    await prisma.$disconnect();
    return;
  }

  const tour = await prisma.tour.create({
    data: {
      slug: 'horse-dinner-show',
      title: { en: 'Horse Ride, Dinner Show & Transport', fr: 'Balade à Cheval, Dîner Spectacle & Transport' },
      shortDescription: {
        en: 'A magical evening combining a guided horse ride through the Agafay Desert, a traditional Moroccan dinner show with live entertainment, and comfortable round-trip transport from Marrakech.',
        fr: 'Une soirée magique alliant une promenade à cheval guidée dans le désert d\'Agafay, un dîner spectacle marocain avec animation live et un transport aller-retour confortable depuis Marrakech.',
      },
      fullDescription: {
        en: 'Escape the city and discover the magic of the Agafay Desert on horseback. Your evening begins with a pick-up from your Marrakech accommodation, then a scenic drive to the desert. You\'ll enjoy a guided horse ride at the golden hour, watching the sun dip behind the Atlas Mountains. After the ride, settle in for an authentic Moroccan dinner under the stars, accompanied by live traditional music and a captivating performance show. Round-trip transport is included, making this a seamless and unforgettable experience for couples, families, and groups alike.',
        fr: 'Échappez-vous de la ville et découvrez la magie du désert d\'Agafay à cheval. Votre soirée commence par un transfert depuis votre hébergement à Marrakech, suivi d\'un trajet panoramique vers le désert. Vous profiterez d\'une promenade à cheval guidée à l\'heure dorée, regardant le soleil se coucher derrière l\'Atlas. Après la balade, installez-vous pour un dîner marocain authentique sous les étoiles, accompagné de musique traditionnelle live et d\'un spectacle envoûtant. Le transport aller-retour est inclus, pour une expérience inoubliable et sans contrainte pour les couples, familles et groupes.',
      },
      includes: [
        { en: 'Round-trip transport from Marrakech', fr: 'Transport aller-retour depuis Marrakech' },
        { en: 'Guided horse ride in Agafay Desert', fr: 'Balade à cheval guidée dans le désert d\'Agafay' },
        { en: 'Traditional Moroccan dinner', fr: 'Dîner traditionnel marocain' },
        { en: 'Live music and entertainment show', fr: 'Spectacle de musique et animation live' },
        { en: 'Professional bilingual guide', fr: 'Guide professionnel bilingue' },
        { en: 'Mint tea and welcome refreshments', fr: 'Thé à la menthe et rafraîchissements d\'accueil' },
      ],
      highlights: [
        { en: 'Horse ride at golden hour in the Agafay Desert', fr: 'Promenade à cheval à l\'heure dorée dans le désert d\'Agafay' },
        { en: 'Authentic Moroccan dinner under the stars', fr: 'Dîner marocain authentique sous les étoiles' },
        { en: 'Live traditional music and entertainment show', fr: 'Spectacle de musique traditionnelle et animation live' },
        { en: 'Panoramic views of the Atlas Mountains', fr: 'Vue panoramique sur les montagnes de l\'Atlas' },
        { en: 'Comfortable transport included from Marrakech', fr: 'Transport confortable inclus depuis Marrakech' },
        { en: 'Ideal for couples, families, and groups', fr: 'Idéal pour les couples, familles et groupes' },
      ],
      faqs: [
        {
          question: {
            en: 'Is horse riding experience required?',
            fr: 'Une expérience en équitation est-elle nécessaire ?',
          },
          answer: {
            en: 'No experience is needed. Our horses are calm and well-trained, and our guides will assist beginners throughout the ride.',
            fr: 'Aucune expérience n\'est nécessaire. Nos chevaux sont calmes et bien entraînés, et nos guides accompagnent les débutants tout au long de la balade.',
          },
        },
        {
          question: {
            en: 'What time does the experience start?',
            fr: 'À quelle heure commence l\'expérience ?',
          },
          answer: {
            en: 'Pick-up is typically in the late afternoon (around 4–5 PM) so the horse ride coincides with sunset. Exact timing is confirmed upon booking.',
            fr: 'Le ramassage est généralement en fin d\'après-midi (vers 16h–17h) pour que la balade coïncide avec le coucher du soleil. L\'horaire exact est confirmé lors de la réservation.',
          },
        },
        {
          question: {
            en: 'Is transport included from any hotel in Marrakech?',
            fr: 'Le transport est-il inclus depuis tous les hôtels de Marrakech ?',
          },
          answer: {
            en: 'Yes, we offer pick-up and drop-off from your hotel or riad anywhere in Marrakech.',
            fr: 'Oui, nous proposons le ramassage et le retour depuis votre hôtel ou riad partout à Marrakech.',
          },
        },
      ],
      priceAmount: 350,
      priceCurrency: 'MAD',
      priceDisplay: { en: 'From 350 Dh per guest', fr: 'A partir de 350 Dh par personne' },
      duration: { en: 'Approximately 5–6 hours including transport', fr: 'Environ 5 à 6 heures transport inclus' },
      isActive: true,
      images: [],
      imageKeys: [],
    },
  });

  console.log(`✓ Created tour: ${tour.slug} (id: ${tour.id})`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
