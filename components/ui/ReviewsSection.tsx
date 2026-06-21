import type { Locale } from '@/content/tours';
import type { ApiReview } from '@/lib/api-client';

interface ReviewsSectionProps {
  locale: Locale;
  reviews: ApiReview[];
}

export default function ReviewsSection({ locale, reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null;
  }

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
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-bg-subtle p-8 border border-rule/30 flex flex-col justify-between hover:border-gold transition-all duration-300"
          >
            <div>
              <div className="flex gap-1 text-gold mb-6 text-sm">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              <p className="font-display italic text-[16px] text-ink leading-[1.65] mb-8">
                &ldquo;{review.text[locale]}&rdquo;
              </p>
            </div>

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
