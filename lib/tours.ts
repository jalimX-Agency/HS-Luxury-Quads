import type { Tour as PrismaTour } from '@/generated/client';

type LocalizedString = { en: string; fr: string };

export interface ApiTour {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  includes: LocalizedString[];
  highlights: LocalizedString[];
  faqs: Array<{
    question: LocalizedString;
    answer: LocalizedString;
  }>;
  price: {
    amount: number;
    currency: string;
    display: LocalizedString;
  };
  duration: LocalizedString;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function asLocalizedString(value: unknown): LocalizedString {
  const record = value as LocalizedString;
  return {
    en: record?.en ?? '',
    fr: record?.fr ?? '',
  };
}

function asLocalizedArray(value: unknown): LocalizedString[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asLocalizedString(item));
}

function asFaqs(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const faq = item as { question: unknown; answer: unknown };
    return {
      question: asLocalizedString(faq.question),
      answer: asLocalizedString(faq.answer),
    };
  });
}

export function serializeTour(tour: PrismaTour): ApiTour {
  return {
    id: tour.id,
    slug: tour.slug,
    title: asLocalizedString(tour.title),
    shortDescription: asLocalizedString(tour.shortDescription),
    fullDescription: asLocalizedString(tour.fullDescription),
    includes: asLocalizedArray(tour.includes),
    highlights: asLocalizedArray(tour.highlights),
    faqs: asFaqs(tour.faqs),
    price: {
      amount: tour.priceAmount,
      currency: tour.priceCurrency,
      display: asLocalizedString(tour.priceDisplay),
    },
    duration: asLocalizedString(tour.duration),
    isActive: tour.isActive,
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString(),
  };
}
