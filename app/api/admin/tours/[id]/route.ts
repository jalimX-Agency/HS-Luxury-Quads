import { NextRequest } from 'next/server';
import { toFormState } from '@/components/admin/tour/types';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { normalizeTourForUpdate } from '@/lib/normalize-tour';
import { prisma } from '@/lib/prisma';
import { serializeTour } from '@/lib/tours';
import { tourUpdateSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const tour = await prisma.tour.findUnique({ where: { id: params.id } });

    if (!tour) {
      return jsonError('Tour not found', 404);
    }

    return jsonSuccess({ tour: serializeTour(tour) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const existing = await prisma.tour.findUnique({ where: { id: params.id } });

    if (!existing) {
      return jsonError('Tour not found', 404);
    }

    const body = await request.json();
    tourUpdateSchema.parse(body);

    const data = normalizeTourForUpdate(toFormState(serializeTour(existing)), body);

    const tour = await prisma.tour.update({
      where: { id: params.id },
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

    return jsonSuccess({ tour: serializeTour(tour) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const bookingsCount = await prisma.booking.count({ where: { tourId: params.id } });

    if (bookingsCount > 0) {
      return jsonError('Cannot delete a tour with existing bookings. Deactivate it instead.', 409);
    }

    await prisma.tour.delete({ where: { id: params.id } });
    return jsonSuccess({ message: 'Tour deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
