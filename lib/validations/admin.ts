import { z } from 'zod';

export const localizedStringSchema = z.object({
  en: z.string().trim().min(1),
  fr: z.string().trim().min(1),
});

export const optionalLocalizedStringSchema = z.object({
  en: z.string().trim().optional().default(''),
  fr: z.string().trim().optional().default(''),
});

export const localizedListSchema = z.array(localizedStringSchema).min(1);

export const optionalLocalizedListSchema = z.array(optionalLocalizedStringSchema).default([]);

export const faqSchema = z.object({
  question: localizedStringSchema,
  answer: localizedStringSchema,
});

export const optionalFaqSchema = z.object({
  question: optionalLocalizedStringSchema,
  answer: optionalLocalizedStringSchema,
});

export const tourTitleSchema = z
  .object({
    en: z.string().trim().optional().default(''),
    fr: z.string().trim().optional().default(''),
  })
  .refine((data) => data.en.length > 0 || data.fr.length > 0, {
    message: 'Title is required',
  });

export const loginSchema = z.object({
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const bookingStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']);

export const bookingUpdateSchema = z.object({
  status: bookingStatusSchema,
});

export const tourCreateInputSchema = z.object({
  slug: z.string().trim().optional().default(''),
  title: tourTitleSchema,
  shortDescription: optionalLocalizedStringSchema,
  fullDescription: optionalLocalizedStringSchema,
  includes: optionalLocalizedListSchema,
  highlights: optionalLocalizedListSchema,
  faqs: z.array(optionalFaqSchema).default([]),
  priceAmount: z.coerce.number().int().min(0),
  priceCurrency: z.string().trim().min(3).max(3).default('EUR'),
  priceDisplay: optionalLocalizedStringSchema,
  duration: optionalLocalizedStringSchema,
  isActive: z.boolean().default(true),
});

export const tourWriteSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  title: tourTitleSchema,
  shortDescription: optionalLocalizedStringSchema,
  fullDescription: optionalLocalizedStringSchema,
  includes: optionalLocalizedListSchema,
  highlights: optionalLocalizedListSchema,
  faqs: z.array(optionalFaqSchema).default([]),
  priceAmount: z.coerce.number().int().min(0),
  priceCurrency: z.string().trim().min(3).max(3).default('EUR'),
  priceDisplay: optionalLocalizedStringSchema,
  duration: optionalLocalizedStringSchema,
  isActive: z.boolean().default(true),
});

export const tourUpdateSchema = tourWriteSchema.partial();

export const reviewWriteSchema = z.object({
  tourId: z.string().trim().optional().nullable(),
  name: z.string().trim().min(2).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  country: z.string().trim().min(2).max(120),
  flag: z.string().trim().min(1).max(8),
  reviewDate: z.string().trim().min(2).max(40),
  text: localizedStringSchema,
  isPublished: z.boolean().default(true),
});

export const reviewUpdateSchema = reviewWriteSchema.partial();

export const galleryWriteSchema = z.object({
  url: z.string().trim().min(1).max(500),
  alt: localizedStringSchema,
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const galleryUpdateSchema = galleryWriteSchema.partial();
