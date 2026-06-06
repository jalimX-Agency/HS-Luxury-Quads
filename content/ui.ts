import type { LocalizedString } from './tours';

export const homepageContent = {
  heroHeadline: {
    en: 'Luxury Quad Biking in the Agafay Desert',
    fr: 'Quad de luxe dans le desert d Agafay',
  },
  heroSubheadline: {
    en: 'Private Marrakech transfers, polished guides, cinematic desert tracks, and premium moments crafted for travelers who want adventure with elegance.',
    fr: 'Transferts prives depuis Marrakech, guides attentifs, pistes desertiques spectaculaires et instants premium pour une aventure elegante.',
  },
  primaryCta: {
    en: 'Book your private ride',
    fr: 'Reserver votre tour prive',
  },
  secondaryCta: {
    en: 'Explore tours',
    fr: 'Voir les experiences',
  },
  usps: [
    {
      title: {
        en: 'Private from Marrakech',
        fr: 'Prive depuis Marrakech',
      },
      text: {
        en: 'Door-to-door transfers from your hotel, riad, villa, or concierge address.',
        fr: 'Transferts porte a porte depuis votre hotel, riad, villa ou adresse conciergerie.',
      },
    },
    {
      title: {
        en: 'Premium desert routes',
        fr: 'Itineraires desert premium',
      },
      text: {
        en: 'Agafay tracks selected for scenery, safety, comfort, and unforgettable photo stops.',
        fr: 'Pistes d Agafay choisies pour les paysages, la securite, le confort et les pauses photo.',
      },
    },
    {
      title: {
        en: 'Luxury hospitality',
        fr: 'Hospitalite haut de gamme',
      },
      text: {
        en: 'Attentive guides, clean equipment, Moroccan tea, and optional sunset dinner service.',
        fr: 'Guides attentifs, equipement soigne, the marocain et diner au coucher du soleil en option.',
      },
    },
  ],
  sections: {
    featuredTours: {
      en: 'Signature Agafay Quad Experiences',
      fr: 'Experiences quad signature a Agafay',
    },
    whyChooseUs: {
      en: 'Adventure, Elevated',
      fr: 'L aventure en version premium',
    },
    sunsetDinner: {
      en: 'Golden Hour in the Stone Desert',
      fr: 'L heure doree dans le desert de pierre',
    },
    privateExperience: {
      en: 'Private Tours for Discerning Travelers',
      fr: 'Tours prives pour voyageurs exigeants',
    },
    testimonials: {
      en: 'Guest Impressions',
      fr: 'Avis de nos invites',
    },
    faq: {
      en: 'Before You Ride',
      fr: 'Avant le depart',
    },
  } satisfies Record<string, LocalizedString>,
};

export const aboutContent = {
  heading: {
    en: 'Born in Marrakech, Built for the Desert',
    fr: 'Nee a Marrakech, pensee pour le desert',
  },
  story: {
    en: 'HS Luxury Quads Morocco was created for travelers who want more than a standard excursion. We know Agafay as a living landscape: mineral, open, quiet, and dramatic in the late light. Our work is to shape that landscape into a premium quad biking experience where every detail feels considered, from the first WhatsApp message to the final return to Marrakech. We combine local knowledge, careful route planning, polished hospitality, and reliable equipment so guests can feel the thrill of the desert while staying completely supported.',
    fr: 'HS Luxury Quads Morocco a ete cree pour les voyageurs qui attendent plus qu une excursion classique. Nous connaissons Agafay comme un paysage vivant: mineral, ouvert, silencieux et spectaculaire dans la lumiere du soir. Notre role est de transformer ce decor en experience quad premium, ou chaque detail compte, du premier message WhatsApp au retour final a Marrakech. Nous associons connaissance locale, itineraires soignes, hospitalite raffinee et equipement fiable pour offrir les sensations du desert avec un accompagnement total.',
  },
  values: [
    {
      title: {
        en: 'Safety with confidence',
        fr: 'Securite et confiance',
      },
      text: {
        en: 'Every ride begins with clear guidance, quality equipment, and a pace adapted to the guest.',
        fr: 'Chaque sortie commence par des consignes claires, un equipement de qualite et un rythme adapte.',
      },
    },
    {
      title: {
        en: 'Moroccan hospitality',
        fr: 'Hospitalite marocaine',
      },
      text: {
        en: 'Warmth, discretion, timing, and generosity define the way we host.',
        fr: 'Chaleur, discretion, sens du timing et generosite definissent notre accueil.',
      },
    },
    {
      title: {
        en: 'Premium without pretense',
        fr: 'Premium sans pretention',
      },
      text: {
        en: 'Luxury means clean logistics, beautiful settings, honest service, and room to enjoy the moment.',
        fr: 'Le luxe signifie une organisation fluide, de beaux decors, un service sincere et le temps de savourer.',
      },
    },
  ],
  teamIntro: {
    en: 'Our team brings together Marrakech drivers, Agafay guides, hospitality coordinators, and local partners who understand what international travelers expect: punctuality, clarity, comfort, and a sense of place. We are here to make the desert feel both thrilling and effortless.',
    fr: 'Notre equipe reunit chauffeurs marrakchis, guides d Agafay, coordinateurs hospitalite et partenaires locaux qui comprennent les attentes des voyageurs internationaux: ponctualite, clarte, confort et authenticite. Notre mission est de rendre le desert a la fois intense et fluide.',
  },
};

export const contactContent = {
  heading: {
    en: 'Plan Your Private Agafay Quad Experience',
    fr: 'Planifier votre experience quad privee a Agafay',
  },
  subheading: {
    en: 'Tell us your preferred date, group size, and style of experience. Our team will confirm availability and tailor the details.',
    fr: 'Indiquez votre date souhaitee, la taille du groupe et le style d experience. Notre equipe confirmera la disponibilite et adaptera les details.',
  },
  formLabels: {
    name: {
      en: 'Full name',
      fr: 'Nom complet',
    },
    email: {
      en: 'Email address',
      fr: 'Adresse email',
    },
    phone: {
      en: 'WhatsApp or phone',
      fr: 'WhatsApp ou telephone',
    },
    tour: {
      en: 'Preferred experience',
      fr: 'Experience souhaitee',
    },
    date: {
      en: 'Preferred date',
      fr: 'Date souhaitee',
    },
    guests: {
      en: 'Number of guests',
      fr: 'Nombre de personnes',
    },
    pickup: {
      en: 'Pickup address in Marrakech',
      fr: 'Adresse de prise en charge a Marrakech',
    },
    message: {
      en: 'Occasion or special requests',
      fr: 'Occasion ou demandes speciales',
    },
    submit: {
      en: 'Request availability',
      fr: 'Demander la disponibilite',
    },
  } satisfies Record<string, LocalizedString>,
  success: {
    title: {
      en: 'Your request has been received',
      fr: 'Votre demande a bien ete recue',
    },
    message: {
      en: 'Thank you. HS Luxury Quads Morocco will contact you shortly with availability, timing, and private transfer details.',
      fr: 'Merci. HS Luxury Quads Morocco vous contactera rapidement avec les disponibilites, horaires et details du transfert prive.',
    },
  },
  errors: {
    required: {
      en: 'Please complete the required fields before sending your request.',
      fr: 'Veuillez completer les champs obligatoires avant d envoyer votre demande.',
    },
    unavailable: {
      en: 'We could not send your request. Please try again or contact us on WhatsApp.',
      fr: 'Votre demande n a pas pu etre envoyee. Veuillez reessayer ou nous contacter sur WhatsApp.',
    },
  },
};
