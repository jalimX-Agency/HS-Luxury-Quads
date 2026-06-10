import type { TourFormState } from '@/components/admin/tour/types';

export type LocalizedString = { en: string; fr: string };

export function mirrorLocalized(en: string, fr: string): LocalizedString {
  const enTrim = en.trim();
  const frTrim = fr.trim();

  if (enTrim && !frTrim) return { en: enTrim, fr: enTrim };
  if (frTrim && !enTrim) return { en: frTrim, fr: frTrim };

  return { en, fr };
}

export function slugifyTitle(title: string) {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 80);

  return slug || 'tour';
}

export function prepareTourPayload(
  form: TourFormState,
  options?: { generateSlug?: boolean },
): TourFormState {
  const title = mirrorLocalized(form.title.en, form.title.fr);
  const slug = options?.generateSlug ? slugifyTitle(title.en || title.fr) : form.slug;

  const priceDisplay = mirrorLocalized(form.priceDisplay.en, form.priceDisplay.fr);

  return {
    ...form,
    slug,
    title,
    shortDescription: mirrorLocalized(form.shortDescription.en, form.shortDescription.fr),
    fullDescription: mirrorLocalized(form.fullDescription.en, form.fullDescription.fr),
    duration: mirrorLocalized(form.duration.en, form.duration.fr),
    priceDisplay: {
      en: priceDisplay.en || `From EUR${form.priceAmount}`,
      fr: priceDisplay.fr || `A partir de ${form.priceAmount} EUR`,
    },
    includes: form.includes
      .map((item) => mirrorLocalized(item.en, item.fr))
      .filter((item) => item.en.trim() || item.fr.trim()),
    highlights: form.highlights
      .map((item) => mirrorLocalized(item.en, item.fr))
      .filter((item) => item.en.trim() || item.fr.trim()),
    faqs: form.faqs
      .map((faq) => ({
        question: mirrorLocalized(faq.question.en, faq.question.fr),
        answer: mirrorLocalized(faq.answer.en, faq.answer.fr),
      }))
      .filter(
        (faq) =>
          faq.question.en.trim() ||
          faq.question.fr.trim() ||
          faq.answer.en.trim() ||
          faq.answer.fr.trim(),
      ),
  };
}

export function validateTourBasics(form: TourFormState): string | null {
  const hasTitle = Boolean(form.title.en.trim() || form.title.fr.trim());

  if (!hasTitle) {
    return 'Title is required.';
  }

  if (form.priceAmount < 0 || Number.isNaN(form.priceAmount)) {
    return 'Price must be zero or greater.';
  }

  return null;
}
