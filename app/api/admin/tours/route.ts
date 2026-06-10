import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { normalizeTourForCreate } from '@/lib/normalize-tour';
import { prisma } from '@/lib/prisma';
import { serializeTour } from '@/lib/tours';
import { tourCreateInputSchema } from '@/lib/validations/admin';

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const tours = await prisma.tour.findMany({
      orderBy: { priceAmount: 'asc' },
    });

    return jsonSuccess({
      tours: tours.map(serializeTour),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const input = tourCreateInputSchema.parse(body);
    const data = normalizeTourForCreate(input);

    const tour = await prisma.tour.create({
      data: {
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        includes: data.includes,
        highlights: data.highlights,
        faqs: data.faqs,
        priceAmount: data.priceAmount,
        priceCurrency: data.priceCurrency,
        priceDisplay: data.priceDisplay,
        duration: data.duration,
        isActive: data.isActive,
      },
    });

    return jsonSuccess({ tour: serializeTour(tour) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
