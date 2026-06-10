import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().email('A valid email address is required'),
  phone: z.string().trim().min(6, 'A valid phone number is required').max(30).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  locale: z.enum(['en', 'fr']).optional().default('en'),
});

export type ContactInput = z.infer<typeof contactSchema>;
