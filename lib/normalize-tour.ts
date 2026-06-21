import type { TourFormState } from '@/components/admin/tour/types';
import { prepareTourPayload } from '@/lib/tour-form-utils';
import { tourWriteSchema } from '@/lib/validations/admin';

export function normalizeTourForCreate(input: unknown) {
  const prepared = prepareTourPayload(input as TourFormState, { generateSlug: true });
  return tourWriteSchema.parse(prepared);
}

export function normalizeTourForUpdate(existing: TourFormState, input: unknown) {
  const merged = {
    ...existing,
    ...(input as Partial<TourFormState>),
  };

  const prepared = prepareTourPayload(merged);
  return tourWriteSchema.parse(prepared);
}
