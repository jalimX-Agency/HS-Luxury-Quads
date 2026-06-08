import type { Locale } from '@/content/tours';

interface Review {
  id: number;
  name: string;
  rating: number;
  country: string;
  flag: string;
  date: string;
  text: {
    en: string;
    fr: string;
  };
}

const mockReviews: Review[] = [
  {
    id: 1,
    name: 'Charlotte Vance',
    rating: 5,
    country: 'United Kingdom',
    flag: '🇬🇧',
    date: 'May 2026',
    text: {
      en: 'Incredible experience from start to finish. The private transfer was punctual, clean, and comfortable. Our guide read the landscape like a poem — the tracks we took in Agafay were spectacular, not staged.',
      fr: 'Une expérience incroyable du début à la fin. Le transfert privé était ponctuel, propre et confortable. Notre guide a lu le paysage comme un poème — les pistes d\'Agafay étaient spectaculaires.',
    },
  },
  {
    id: 2,
    name: 'Julien Mercier',
    rating: 5,
    country: 'France',
    flag: '🇫🇷',
    date: 'April 2026',
    text: {
      en: 'Absolute luxury in the desert. The quad bikes are brand new and perfectly maintained. The guide adapted the pace to our request. The tea break in the Berber tent at sunset was magical.',
      fr: 'Le luxe absolu dans le désert. Les quads sont neufs et parfaitement entretenus. Le guide a adapté le rythme à notre demande. La pause thé dans la tente berbère au coucher du soleil était magique.',
    },
  },
  {
    id: 3,
    name: 'Sarah Al-Mansoori',
    rating: 5,
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    date: 'March 2026',
    text: {
      en: 'Excellent service. The coordination via WhatsApp was fast and helpful. We booked the fully private VIP tour and it was customized to every single request we had. Five star hospitality!',
      fr: 'Excellent service. La coordination via WhatsApp était rapide et efficace. Nous avons réservé le tour VIP entièrement privé et il a été adapté à chacune de nos demandes. Une hospitalité 5 étoiles !',
    },
  },
];

interface ReviewsSectionProps {
  locale: Locale;
}

export default function ReviewsSection({ locale }: ReviewsSectionProps) {
  return (
    <section className="py-20 px-gutter max-w-container-max mx-auto border-t border-rule/20 mt-16">
      <div className="mb-16">
        <p className="font-syne text-[10px] font-semibold tracking-[0.22em] uppercase text-gold flex items-center gap-4 mb-4">
          <span className="w-8 h-[1px] bg-gold block" />
          {locale === 'en' ? 'Guest Impressions' : 'Impressions de nos Invités'}
        </p>
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-ink leading-tight max-w-xl">
          {locale === 'en'
            ? 'Words from travelers who have ridden with us.'
            : 'Quelques mots de voyageurs ayant voyagé à nos côtés.'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="bg-bg-subtle p-8 border border-rule/30 flex flex-col justify-between hover:border-gold transition-all duration-300"
          >
            <div>
              {/* Stars */}
              <div className="flex gap-1 text-gold mb-6 text-sm">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Review Text */}
              <p className="font-display italic text-[16px] text-ink leading-[1.65] mb-8">
                &ldquo;{review.text[locale]}&rdquo;
              </p>
            </div>

            {/* Author details */}
            <div className="flex items-center gap-3 border-t border-rule/10 pt-5 mt-auto">
              <span className="text-xl" role="img" aria-label={review.country}>
                {review.flag}
              </span>
              <div>
                <p className="font-syne text-[10px] font-semibold tracking-wider text-ink uppercase">{review.name}</p>
                <p className="font-sans text-[11px] text-ink-faint mt-0.5">
                  {review.country} &bull; {review.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
