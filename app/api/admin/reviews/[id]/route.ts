import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { reviewUpdateSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const data = reviewUpdateSchema.parse(body);

    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...data,
        tourId: data.tourId === undefined ? undefined : data.tourId || null,
      },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    return jsonSuccess({ review });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await prisma.review.delete({ where: { id: params.id } });
    return jsonSuccess({ message: 'Review deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    if (!review) {
      return jsonError('Review not found', 404);
    }

    return jsonSuccess({ review });
  } catch (error) {
    return handleApiError(error);
  }
}
