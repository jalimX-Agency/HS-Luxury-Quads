import { tours, type Locale, type LocalizedString, type Tour } from './tours';

const siteUrl = 'https://hsluxuryquads.com';
const brandName = 'HS Luxury Quads';
const defaultOgImage = `${siteUrl}/images/og/agafay-luxury-quad.jpg`;

export interface SeoConfig {
  title: LocalizedString;
  description: LocalizedString;
  keywords: LocalizedString[];
  ogImage: string;
  jsonLd: unknown[];
}

const localized = (en: string, fr: string): LocalizedString => ({ en, fr });

const keywords = (...items: Array<[string, string]>): LocalizedString[] =>
  items.map(([en, fr]) => localized(en, fr));

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: brandName,
  url: siteUrl,
  image: defaultOgImage,
  priceRange: 'MAD',
  areaServed: ['Marrakech', 'Agafay Desert', 'Morocco'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Marrakech',
    addressCountry: 'MA',
  },
  sameAs: [
    'https://www.instagram.com/luxury_quads_morrocco',
    'https://www.tiktok.com/@hsquadsluxurymorocco',
    'https://www.facebook.com/share/1BeADmBxvj/',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: brandName,
  url: siteUrl,
  inLanguage: ['en', 'fr'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/tours?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = (tour: Tour, locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: tour.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question[locale],
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer[locale],
    },
  })),
});

const productSchema = (tour: Tour, locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: tour.title[locale],
  description: tour.shortDescription[locale],
  image: `${siteUrl}/images/tours/${tour.slug}.jpg`,
  brand: {
    '@type': 'Brand',
    name: brandName,
  },
  offers: {
    '@type': 'Offer',
    url: `${siteUrl}/tours/${tour.slug}`,
    price: tour.price.amount,
    priceCurrency: tour.price.currency,
    availability: 'https://schema.org/InStock',
  },
});

const touristAttractionSchema = (tour: Tour, locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: tour.title[locale],
  description: tour.fullDescription[locale],
  url: `${siteUrl}/tours/${tour.slug}`,
  image: `${siteUrl}/images/tours/${tour.slug}.jpg`,
  touristType: ['Luxury travelers', 'Adventure travelers', 'Couples', 'Families'],
  isAccessibleForFree: false,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Agafay Desert',
    addressRegion: 'Marrakech-Safi',
    addressCountry: 'MA',
  },
  provider: {
    '@type': 'LocalBusiness',
    name: brandName,
    url: siteUrl,
  },
});

const tourJsonLd = (tour: Tour, locale: Locale) => [
  touristAttractionSchema(tour, locale),
  productSchema(tour, locale),
  faqSchema(tour, locale),
];

export const seoConfig: Record<string, SeoConfig> = {
  home: {
    title: localized(
      'Luxury Quad Marrakech | Private Agafay Desert Quad Biking',
      'Quad de luxe Marrakech | Tour prive dans le desert d Agafay',
    ),
    description: localized(
      'Book premium quad biking in Agafay Desert with private Marrakech transfers, expert guides, sunset rides, and luxury desert dining.',
      'Reservez un quad premium dans le desert d Agafay avec transferts prives depuis Marrakech, guides experts, coucher de soleil et diner desert.',
    ),
    keywords: keywords(
      ['luxury quad marrakech', 'quad de luxe marrakech'],
      ['quad agafay', 'quad agafay'],
      ['agafay desert quad biking', 'quad desert agafay'],
      ['private quad tour marrakech', 'tour prive quad marrakech'],
      ['best quad experience morocco', 'meilleure experience quad maroc'],
    ),
    ogImage: defaultOgImage,
    jsonLd: [organizationSchema, websiteSchema],
  },
  about: {
    title: localized(
      'About HS Luxury Quads | Premium Agafay Desert Experiences',
      'A propos de HS Luxury Quads | Experiences premium a Agafay',
    ),
    description: localized(
      'Meet the Marrakech team behind refined private quad tours in Agafay Desert, combining Moroccan hospitality, safety, and premium adventure.',
      'Decouvrez l equipe marrakchie derriere nos tours prives en quad a Agafay, entre hospitalite marocaine, securite et aventure premium.',
    ),
    keywords: keywords(
      ['luxury desert experience marrakech', 'experience desert luxe marrakech'],
      ['premium quad agafay', 'quad premium agafay'],
      ['morocco adventure concierge', 'conciergerie aventure maroc'],
    ),
    ogImage: `${siteUrl}/images/og/about-hs-luxury-quads.jpg`,
    jsonLd: [organizationSchema],
  },
  tours: {
    title: localized(
      'Agafay Desert Quad Biking Tours | Luxury Quad Marrakech',
      'Tours quad desert Agafay | Quad de luxe Marrakech',
    ),
    description: localized(
      'Compare private and luxury Agafay quad tours from Marrakech, including 2-hour rides, sunset dinner experiences, and bespoke VIP itineraries.',
      'Comparez nos tours quad de luxe a Agafay depuis Marrakech: balade 2h, coucher de soleil avec diner et itineraires VIP sur mesure.',
    ),
    keywords: keywords(
      ['quad agafay tours', 'tours quad agafay'],
      ['luxury quad marrakech tours', 'tours quad de luxe marrakech'],
      ['private quad tour marrakech', 'tour prive quad marrakech'],
    ),
    ogImage: `${siteUrl}/images/og/agafay-quad-tours.jpg`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Agafay Desert Quad Biking Tours',
        itemListElement: tours.map((tour, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/tours/${tour.slug}`,
          name: tour.title.en,
        })),
      },
    ],
  },
  booking: {
    title: localized(
      'Book a Private Quad Tour in Marrakech | HS Luxury Quads',
      'Reserver un tour prive en quad a Marrakech | HS Luxury Quads',
    ),
    description: localized(
      'Request your luxury quad biking experience in Agafay Desert with private transfer, guide, and tailored timing from Marrakech.',
      'Demandez votre experience quad de luxe dans le desert d Agafay avec transfert prive, guide et horaires adaptes depuis Marrakech.',
    ),
    keywords: keywords(
      ['book quad agafay', 'reserver quad agafay'],
      ['private quad booking marrakech', 'reservation quad prive marrakech'],
      ['luxury quad marrakech booking', 'reservation quad de luxe marrakech'],
    ),
    ogImage: `${siteUrl}/images/og/book-luxury-quad.jpg`,
    jsonLd: [organizationSchema],
  },
  contact: {
    title: localized(
      'Contact HS Luxury Quads | Private Agafay Quad Tours',
      'Contact HS Luxury Quads | Tours prives quad Agafay',
    ),
    description: localized(
      'Contact HS Luxury Quads for premium quad biking, private Agafay tours, concierge requests, and custom Marrakech adventure planning.',
      'Contactez HS Luxury Quads pour quad premium, tours prives a Agafay, demandes conciergerie et aventures sur mesure a Marrakech.',
    ),
    keywords: keywords(
      ['contact luxury quad marrakech', 'contact quad luxe marrakech'],
      ['agafay quad concierge', 'conciergerie quad agafay'],
      ['private quad tour morocco', 'tour prive quad maroc'],
    ),
    ogImage: `${siteUrl}/images/og/contact-hs-luxury-quads.jpg`,
    jsonLd: [organizationSchema],
  },
};

export const tourSeoConfig: Record<Tour['slug'], SeoConfig> = tours.reduce(
  (acc, tour) => {
    acc[tour.slug] = {
      title: {
        en: `${tour.title.en} | ${brandName}`,
        fr: `${tour.title.fr} | ${brandName}`,
      },
      description: tour.shortDescription,
      keywords: keywords(
        ['luxury quad marrakech', 'quad de luxe marrakech'],
        ['quad agafay', 'quad agafay'],
        ['agafay desert quad biking', 'quad desert agafay'],
        ['private quad tour marrakech', 'tour prive quad marrakech'],
        ['best quad experience morocco', 'meilleure experience quad maroc'],
      ),
      ogImage: `${siteUrl}/images/tours/${tour.slug}.jpg`,
      jsonLd: [
        ...tourJsonLd(tour, 'en'),
        ...tourJsonLd(tour, 'fr'),
      ],
    };

    return acc;
  },
  {} as Record<Tour['slug'], SeoConfig>,
);

export const allSeoConfig = {
  ...seoConfig,
  tours: seoConfig.tours,
  tourPages: tourSeoConfig,
};

// Google Business Profile optimization tips:
// - Primary category: "Tour operator"; secondary categories can include "Adventure sports" and "ATV rental service" if accurate.
// - Use "HS Luxury Quads" consistently across website, GBP, Instagram, WhatsApp, and booking partners.
// - Add service names that match search intent: Luxury Quad Marrakech, Quad Agafay, Agafay Desert Quad Biking, Private Quad Tour Marrakech.
// - Upload real high-resolution photos weekly: vehicles, helmets, guides, transfers, sunset rides, dinner setup, and guest viewpoints.
// - Create GBP posts for seasonal moments: sunset dinner rides, private luxury quad tours, honeymoon experiences, and family-friendly Agafay rides.
// - Ask guests for reviews within 24 hours and invite natural mentions of "Agafay", "Marrakech", "private quad", "luxury", and the guide name.
// - Answer every review in English or French, referencing the booked experience and location without keyword stuffing.
// - Keep hours, WhatsApp number, booking URL, pickup area, and holiday availability current.
// - Add FAQs directly in GBP that mirror the website: pickup, beginner suitability, clothing, private tours, sunset timing, and dinner options.
// - Track GBP clicks and calls with UTM tags, for example ?utm_source=google&utm_medium=organic&utm_campaign=gbp.
