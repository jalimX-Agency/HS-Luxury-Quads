import type { ApiTour } from '@/lib/tours';

export type TourFormState = {
  slug: string;
  title: { en: string; fr: string };
  shortDescription: { en: string; fr: string };
  fullDescription: { en: string; fr: string };
  includes: Array<{ en: string; fr: string }>;
  highlights: Array<{ en: string; fr: string }>;
  faqs: Array<{ question: { en: string; fr: string }; answer: { en: string; fr: string } }>;
  priceAmount: number;
  priceCurrency: string;
  priceDisplay: { en: string; fr: string };
  duration: { en: string; fr: string };
  isActive: boolean;
};

export const emptyTour: TourFormState = {
  slug: '',
  title: { en: '', fr: '' },
  shortDescription: { en: '', fr: '' },
  fullDescription: { en: '', fr: '' },
  includes: [{ en: '', fr: '' }],
  highlights: [{ en: '', fr: '' }],
  faqs: [{ question: { en: '', fr: '' }, answer: { en: '', fr: '' } }],
  priceAmount: 0,
  priceCurrency: 'EUR',
  priceDisplay: { en: '', fr: '' },
  duration: { en: '', fr: '' },
  isActive: true,
};

export function toFormState(tour: ApiTour): TourFormState {
  return {
    slug: tour.slug,
    title: tour.title,
    shortDescription: tour.shortDescription,
    fullDescription: tour.fullDescription,
    includes: tour.includes,
    highlights: tour.highlights,
    faqs: tour.faqs,
    priceAmount: tour.price.amount,
    priceCurrency: tour.price.currency,
    priceDisplay: tour.price.display,
    duration: tour.duration,
    isActive: tour.isActive,
  };
}
