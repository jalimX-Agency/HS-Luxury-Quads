import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().email('A valid email address is required'),
  phone: z.string().trim().min(6, 'A valid phone number is required').max(30),
  tourSlug: z
    .string()
    .trim()
    .min(1, 'Tour selection is required')
    .regex(/^[a-z0-9-]+$/, 'Invalid tour slug'),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(parsed.getTime());
    }, 'Invalid date'),
  guests: z.coerce.number().int().min(1, 'At least 1 guest is required').max(20),
  pickup: z.string().trim().max(300).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  locale: z.enum(['en', 'fr']).optional().default('en'),
});

export type BookingInput = z.infer<typeof bookingSchema>;
