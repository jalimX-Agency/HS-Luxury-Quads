export type Locale = 'en' | 'fr';

export type LocalizedString = Record<Locale, string>;

export interface TourFaq {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface Tour {
  slug: 'quad-agafay-2h' | 'quad-sunset-dinner' | 'private-luxury-quad';
  title: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  includes: LocalizedString[];
  highlights: LocalizedString[];
  faqs: TourFaq[];
  price: {
    amount: number;
    currency: 'EUR';
    display: LocalizedString;
  };
  duration: LocalizedString;
}

export const tours: Tour[] = [
  {
    slug: 'quad-agafay-2h',
    title: {
      en: 'Luxury Quad Agafay Desert - 2 Hour Private-Style Ride',
      fr: 'Quad de luxe dans le desert d Agafay - Balade premium de 2 heures',
    },
    shortDescription: {
      en: 'A refined two-hour quad biking experience across the stone dunes of Agafay, designed for travelers who want Marrakech adventure with comfort, privacy, and polished service.',
      fr: 'Une experience premium de deux heures en quad dans le desert d Agafay, concue pour les voyageurs qui recherchent aventure, confort et service soigne.',
    },
    fullDescription: {
      en: 'The Luxury Quad Agafay 2H experience is created for guests who want the energy of quad biking near Marrakech without giving up the ease and confidence of a premium service. Your driver collects you from your accommodation in Marrakech and brings you toward the Agafay Desert, where the city gradually gives way to open stone plains, soft desert light, and distant views of the High Atlas Mountains. On arrival, the team welcomes you with a calm briefing, well-maintained equipment, and time to get comfortable before the ride begins. This is not a rushed group excursion. It is a polished desert experience with attentive guides, beautiful photo pauses, and a route chosen to balance excitement with safety. Across two hours, you ride through Agafay terrain shaped by dry riverbeds, rolling tracks, rocky plateaus, and wide viewpoints that feel cinematic without being staged. Beginners are supported with clear instructions and an easy pace at the start, while confident riders can enjoy more dynamic sections when conditions allow. The experience is ideal for couples, friends, families with older teens, and travelers who want a best quad experience Morocco itinerary that fits neatly into a Marrakech day. Along the way, your guide shares local context about the desert landscape and Berber villages, and selects elegant stops for photos and a traditional tea moment. The tone stays calm and personal, with enough room to ask questions, adjust layers, and enjoy the desert without pressure. The service also suits guests arriving from luxury hotels, private villas, golf resorts, and concierge-planned Marrakech stays. Every detail is designed to feel effortless: hotel transfers, helmets, goggles, route supervision, and a relaxed return to Marrakech. If you are searching for luxury quad Marrakech, quad Agafay, or Agafay desert quad biking with a more considered level of service, this two-hour tour delivers a sharp, memorable adventure without feeling mass-market.',
      fr: 'L experience Luxury Quad Agafay 2H s adresse aux voyageurs qui veulent vivre l intensite du quad pres de Marrakech avec le confort d un service haut de gamme. Votre chauffeur vient vous chercher a votre riad, hotel ou villa a Marrakech, puis vous conduit vers le desert d Agafay, la ou la ville s efface peu a peu devant les plaines minerales, la lumiere chaude du desert et les panoramas sur le Haut Atlas. A l arrivee, l equipe vous accueille avec un briefing clair, un equipement soigne et le temps necessaire pour vous sentir a l aise avant le depart. Ici, rien n est precipite. La sortie est pensee comme une experience premium, avec des guides attentifs, des pauses photo elegantes et un itineraire qui combine plaisir, securite et paysages spectaculaires. Pendant deux heures, vous traversez des pistes variees: plateaux rocheux, lits d oued secs, reliefs ondulants et grands espaces typiques d Agafay. Les debutants beneficient d une prise en main progressive, tandis que les conducteurs plus a l aise peuvent profiter de passages plus dynamiques lorsque les conditions le permettent. Cette excursion convient parfaitement aux couples, amis, familles avec adolescents et visiteurs qui souhaitent integrer une activite forte dans une journee a Marrakech. Votre guide choisit les meilleurs points de vue, partage quelques reperes sur le territoire et organise une pause the traditionnelle dans une ambiance simple et raffinee. L atmosphere reste personnelle, avec le temps de poser vos questions, d ajuster votre confort et de profiter du desert sans pression. Les transferts, casques, lunettes, accompagnement et retour sont inclus pour une experience fluide du debut a la fin. Pour une recherche quad Agafay, quad de luxe Marrakech ou quad dans le desert d Agafay, cette formule offre une aventure memorable, loin de l impression d excursion standardisee.',
    },
    includes: [
      {
        en: 'Private round-trip transfer from Marrakech accommodation',
        fr: 'Transfert prive aller-retour depuis votre hebergement a Marrakech',
      },
      {
        en: 'Two-hour guided quad ride in Agafay Desert',
        fr: 'Balade guidee de deux heures en quad dans le desert d Agafay',
      },
      {
        en: 'Helmet, goggles, gloves, and safety briefing',
        fr: 'Casque, lunettes, gants et briefing securite',
      },
      {
        en: 'Traditional Moroccan mint tea stop',
        fr: 'Pause the a la menthe marocain',
      },
      {
        en: 'Photo stops with Atlas Mountain and desert views',
        fr: 'Pauses photo avec vues sur le desert et l Atlas',
      },
    ],
    highlights: [
      {
        en: 'Premium quad Agafay route selected for views, comfort, and riding pleasure',
        fr: 'Itineraire quad Agafay premium choisi pour les vues, le confort et le plaisir de conduite',
      },
      {
        en: 'Ideal half-day luxury quad Marrakech experience',
        fr: 'Experience quad de luxe Marrakech ideale en demi-journee',
      },
      {
        en: 'Professional guide support for beginners and confident riders',
        fr: 'Accompagnement professionnel pour debutants et conducteurs confirmes',
      },
    ],
    faqs: [
      {
        question: {
          en: 'Do I need previous quad biking experience?',
          fr: 'Faut-il avoir deja conduit un quad ?',
        },
        answer: {
          en: 'No. The guide begins with a safety briefing and easy practice pace, then adapts the ride to the group level.',
          fr: 'Non. Le guide commence par un briefing securite et une prise en main progressive, puis adapte le rythme au niveau du groupe.',
        },
      },
      {
        question: {
          en: 'Is hotel pickup included from Marrakech?',
          fr: 'Le transfert depuis Marrakech est-il inclus ?',
        },
        answer: {
          en: 'Yes. Private round-trip transfers from hotels, riads, and villas in Marrakech are included.',
          fr: 'Oui. Les transferts prives aller-retour depuis les hotels, riads et villas de Marrakech sont inclus.',
        },
      },
      {
        question: {
          en: 'What should I wear for Agafay desert quad biking?',
          fr: 'Quelle tenue porter pour le quad a Agafay ?',
        },
        answer: {
          en: 'Wear comfortable clothes, closed shoes, and sunglasses. We provide helmet, goggles, and gloves.',
          fr: 'Portez des vetements confortables, des chaussures fermees et des lunettes de soleil. Casque, lunettes de protection et gants sont fournis.',
        },
      },
    ],
    price: {
      amount: 120,
      currency: 'EUR',
      display: {
        en: 'From EUR120 per rider',
        fr: 'A partir de 120 EUR par conducteur',
      },
    },
    duration: {
      en: '2 hours riding, approx. 4 hours total with transfers',
      fr: '2 heures de conduite, environ 4 heures avec transferts',
    },
  },
  {
    slug: 'quad-sunset-dinner',
    title: {
      en: 'Agafay Sunset Quad Biking with Luxury Desert Dinner',
      fr: 'Quad au coucher du soleil a Agafay avec diner desert premium',
    },
    shortDescription: {
      en: 'A golden-hour quad ride through Agafay followed by a candlelit Moroccan dinner under the desert sky.',
      fr: 'Une balade en quad a l heure doree dans Agafay, suivie d un diner marocain aux chandelles sous le ciel du desert.',
    },
    fullDescription: {
      en: 'The Agafay Sunset Quad Biking with Luxury Desert Dinner tour is built for travelers who want their Marrakech adventure to become an evening they remember long after the dust has settled. Your experience begins with a private pickup in Marrakech and a scenic drive toward the Agafay Desert, timed so the landscape is already beginning to glow. Once at the desert base, your guide welcomes you, checks your equipment, and leads a clear safety briefing before you set off across the stone desert. The route is designed around the rhythm of sunset: open tracks, quiet plateaus, sculpted hills, and panoramic stops where the light moves from pale gold to amber and rose. This is one of the most atmospheric ways to experience quad Agafay, especially for couples, honeymooners, birthday celebrations, small groups, and visitors searching for the best quad experience Morocco can offer without compromising on comfort. During the ride, your guide keeps the pace confident but controlled, with time for photographs and short pauses to absorb the silence of the desert. As evening arrives, the adventure shifts into a slower, more elegant mood. You arrive at a refined desert camp or dinner setting where Moroccan hospitality takes over: mint tea, warm service, lantern light, and a seasonal dinner inspired by traditional Marrakech and Berber flavors. Depending on the evening, the meal may include fresh salads, tagine, grilled specialties, couscous, dessert, and Moroccan tea. The combination of Agafay desert quad biking and a luxury dinner creates a complete journey: adrenaline, landscape, sunset, cuisine, and calm. Transfers back to Marrakech are arranged after dinner, so you can simply relax into the night. It feels celebratory without becoming formal. For guests searching luxury quad Marrakech, Agafay sunset quad, or private quad tour Marrakech with dinner, this experience offers the polished desert evening most travelers hope to find.',
      fr: 'L excursion Quad Sunset Dinner a Agafay est concue pour les voyageurs qui souhaitent transformer une aventure pres de Marrakech en veritable soiree d exception. L experience commence par une prise en charge privee a Marrakech et une route panoramique vers le desert d Agafay, avec un horaire pense pour profiter de la lumiere de fin de journee. A votre arrivee, le guide vous accueille, verifie l equipement et presente les consignes de securite avant le depart sur les pistes. L itineraire suit le rythme du coucher du soleil: grands espaces, plateaux calmes, collines minerales et pauses panoramiques lorsque la lumiere passe de l or doux a l ambre puis au rose. C est l une des plus belles manieres de vivre le quad Agafay, notamment pour les couples, voyages de noces, anniversaires, petits groupes et visiteurs qui recherchent une experience quad haut de gamme au Maroc. Le rythme reste fluide, securise et agreable, avec des moments pour les photos et pour savourer le silence du desert. Lorsque le soir tombe, l aventure prend une dimension plus douce et raffinee. Vous rejoignez un camp ou un espace diner soigne, ou l hospitalite marocaine devient le centre de l experience: the a la menthe, lanternes, accueil chaleureux et diner saisonnier inspire des saveurs de Marrakech et des traditions berberes. Selon la soiree, le repas peut inclure salades fraiches, tajine, grillades, couscous, dessert et the marocain. L alliance entre quad dans le desert d Agafay et diner premium compose un parcours complet: sensations, paysages, coucher de soleil, cuisine et detente. Le retour prive vers Marrakech est organise apres le diner. L ensemble reste festif sans devenir formel. Pour une recherche quad de luxe Marrakech, quad coucher de soleil Agafay ou tour quad prive Marrakech avec diner, cette formule offre une soiree desert elegante et memorable.',
    },
    includes: [
      {
        en: 'Private Marrakech pickup and return after dinner',
        fr: 'Transfert prive depuis Marrakech et retour apres le diner',
      },
      {
        en: 'Guided sunset quad ride in Agafay Desert',
        fr: 'Balade guidee en quad au coucher du soleil dans Agafay',
      },
      {
        en: 'Safety equipment and pre-ride briefing',
        fr: 'Equipement de securite et briefing avant le depart',
      },
      {
        en: 'Moroccan mint tea and desert dinner',
        fr: 'The a la menthe et diner marocain dans le desert',
      },
      {
        en: 'Sunset photo stops on panoramic desert tracks',
        fr: 'Pauses photo au coucher du soleil sur pistes panoramiques',
      },
    ],
    highlights: [
      {
        en: 'Golden-hour Agafay desert quad biking with elevated dinner service',
        fr: 'Quad a l heure doree dans Agafay avec diner soigne',
      },
      {
        en: 'Romantic choice for couples and special occasions',
        fr: 'Choix romantique pour couples et occasions speciales',
      },
      {
        en: 'Complete evening experience from Marrakech with private transfers',
        fr: 'Experience complete en soiree depuis Marrakech avec transferts prives',
      },
    ],
    faqs: [
      {
        question: {
          en: 'What time does the sunset quad tour start?',
          fr: 'A quelle heure commence le tour quad coucher de soleil ?',
        },
        answer: {
          en: 'Pickup time changes with the season, usually mid to late afternoon so the ride reaches the best sunset light.',
          fr: 'L heure de depart varie selon la saison, generalement en milieu ou fin d apres-midi pour profiter de la meilleure lumiere.',
        },
      },
      {
        question: {
          en: 'Is dinner included in the price?',
          fr: 'Le diner est-il inclus dans le prix ?',
        },
        answer: {
          en: 'Yes. The experience includes a Moroccan desert dinner, tea, quad ride, equipment, guide, and transfers.',
          fr: 'Oui. L experience inclut le diner marocain dans le desert, le the, le quad, l equipement, le guide et les transferts.',
        },
      },
      {
        question: {
          en: 'Can the dinner be adapted for dietary requirements?',
          fr: 'Le diner peut-il etre adapte aux regimes alimentaires ?',
        },
        answer: {
          en: 'Yes, vegetarian and many dietary requests can be arranged when shared before the tour date.',
          fr: 'Oui, les options vegetariennes et de nombreuses demandes alimentaires peuvent etre organisees si elles sont signalees avant la date.',
        },
      },
    ],
    price: {
      amount: 180,
      currency: 'EUR',
      display: {
        en: 'From EUR180 per guest',
        fr: 'A partir de 180 EUR par personne',
      },
    },
    duration: {
      en: 'Approx. 5 to 6 hours including transfers and dinner',
      fr: 'Environ 5 a 6 heures avec transferts et diner',
    },
  },
  {
    slug: 'private-luxury-quad',
    title: {
      en: 'Private Luxury Quad Tour Marrakech to Agafay',
      fr: 'Tour prive en quad de luxe de Marrakech a Agafay',
    },
    shortDescription: {
      en: 'A fully private quad itinerary tailored for couples, families, VIP travelers, and small groups who want a discreet, premium desert adventure.',
      fr: 'Un itineraire quad entierement prive pour couples, familles, voyageurs VIP et petits groupes en quete d une aventure desert premium et discrete.',
    },
    fullDescription: {
      en: 'The Private Luxury Quad Tour Marrakech to Agafay is the signature experience for guests who want the desert on their own terms. Rather than joining a standard departure, you enjoy a private schedule, private transfer, dedicated guide, and a route shaped around your comfort, pace, and occasion. The day begins at your hotel, riad, villa, airport, or preferred Marrakech address, where a professional driver collects you for the journey to Agafay. On arrival, everything is prepared for a smooth start: clean equipment, premium service, clear instruction, and time to settle in before the ride. The itinerary can be refined for the way you like to travel. Couples may prefer a romantic route with extended photo stops and a sunset finish. Families may want a steady, scenic pace with extra support. Friends and VIP groups may choose a more dynamic ride with a longer desert loop, a tea pause, and optional lunch or dinner add-ons. Your guide knows how to make the landscape feel private, guiding you through less crowded tracks, open viewpoints, dry riverbeds, and dramatic stone desert scenery. This is a private quad tour Marrakech visitors can book when they want flexibility, discretion, and a sense of occasion. It also suits luxury travel advisors, concierge teams, and guests planning birthdays, proposals, incentives, or short-notice premium adventures. Safety remains central: the guide adapts the pace, supervises technical sections, and ensures each rider feels confident before moving into more open terrain. From start to finish, the experience is designed to feel personal rather than packaged. You have the thrill of Agafay desert quad biking, the elegance of private hospitality, and the practical ease of door-to-door logistics. For travelers comparing luxury quad Marrakech options and looking for the best quad experience Morocco can offer in a private format, this tour is the most flexible and elevated choice.',
      fr: 'Le Tour Prive en Quad de Luxe de Marrakech a Agafay est l experience signature pour les voyageurs qui souhaitent decouvrir le desert selon leurs propres envies. Au lieu de rejoindre un depart classique, vous profitez d un horaire prive, d un transfert exclusif, d un guide dedie et d un parcours adapte a votre confort, a votre rythme et a l occasion. La journee commence a votre hotel, riad, villa, a l aeroport ou a l adresse de votre choix a Marrakech, ou un chauffeur professionnel vous conduit vers Agafay. A l arrivee, tout est prepare pour un depart fluide: equipement propre, service premium, explications claires et temps de prise en main. L itineraire peut etre ajuste selon votre style de voyage. Les couples apprecient souvent une route romantique avec pauses photo prolongees et fin au coucher du soleil. Les familles preferent un rythme scenic et rassurant avec accompagnement renforce. Les amis et groupes VIP peuvent choisir une conduite plus dynamique, une boucle desert plus longue, une pause the et des options de dejeuner ou diner. Votre guide sait rendre le paysage plus intime en vous emmenant sur des pistes moins frequentees, vers des points de vue ouverts, des lits d oued secs et des decors mineraux puissants. Ce tour quad prive Marrakech convient aux voyageurs qui recherchent flexibilite, discretion et experience sur mesure. Il s adresse aussi aux conciergeries, agences de luxe, anniversaires, demandes en mariage, incentives et aventures premium de derniere minute. La securite reste essentielle: le guide adapte le rythme, supervise les passages techniques et s assure que chaque conducteur se sente confiant avant les zones plus ouvertes. Du debut a la fin, tout est pense pour etre personnel plutot que standardise. Vous profitez des sensations du quad a Agafay, de l elegance d un accueil prive et de la facilite d une organisation porte a porte. Pour une experience quad de luxe Marrakech en format exclusif, cette formule est la plus flexible et la plus aboutie.',
    },
    includes: [
      {
        en: 'Private luxury transfer from any Marrakech address',
        fr: 'Transfert prive premium depuis toute adresse a Marrakech',
      },
      {
        en: 'Dedicated guide and private quad route',
        fr: 'Guide dedie et parcours quad prive',
      },
      {
        en: 'Premium safety equipment and personalized briefing',
        fr: 'Equipement premium et briefing personnalise',
      },
      {
        en: 'Flexible photo, tea, lunch, sunset, or dinner options',
        fr: 'Options flexibles: photos, the, dejeuner, coucher de soleil ou diner',
      },
      {
        en: 'Concierge-style coordination before the tour',
        fr: 'Coordination type conciergerie avant l experience',
      },
    ],
    highlights: [
      {
        en: 'Fully private luxury quad Marrakech experience',
        fr: 'Experience quad de luxe Marrakech entierement privee',
      },
      {
        en: 'Tailored pace for VIP travelers, couples, families, and groups',
        fr: 'Rythme adapte aux voyageurs VIP, couples, familles et groupes',
      },
      {
        en: 'Best choice for special occasions and discreet premium service',
        fr: 'Meilleur choix pour occasions speciales et service premium discret',
      },
    ],
    faqs: [
      {
        question: {
          en: 'Can this private quad tour be customized?',
          fr: 'Ce tour prive en quad peut-il etre personnalise ?',
        },
        answer: {
          en: 'Yes. Timing, pace, route style, photo stops, and dining options can be adjusted according to your group.',
          fr: 'Oui. Horaires, rythme, style de parcours, pauses photo et options repas peuvent etre adaptes a votre groupe.',
        },
      },
      {
        question: {
          en: 'Is this suitable for luxury travel advisors or concierge bookings?',
          fr: 'Cette formule convient-elle aux conciergeries et agences de luxe ?',
        },
        answer: {
          en: 'Yes. The private format is ideal for concierge requests, VIP travelers, celebrations, and tailored Marrakech itineraries.',
          fr: 'Oui. Le format prive est ideal pour les demandes conciergerie, voyageurs VIP, celebrations et itineraires sur mesure a Marrakech.',
        },
      },
      {
        question: {
          en: 'How many guests can join a private quad experience?',
          fr: 'Combien de personnes peuvent participer a une experience privee ?',
        },
        answer: {
          en: 'The experience works well for couples and small groups. Larger private groups can be arranged with advance planning.',
          fr: 'L experience convient tres bien aux couples et petits groupes. Les groupes prives plus importants peuvent etre organises sur demande.',
        },
      },
    ],
    price: {
      amount: 250,
      currency: 'EUR',
      display: {
        en: 'From EUR250 per guest',
        fr: 'A partir de 250 EUR par personne',
      },
    },
    duration: {
      en: 'Flexible private itinerary, usually 4 to 7 hours',
      fr: 'Itineraire prive flexible, generalement 4 a 7 heures',
    },
  },
];
