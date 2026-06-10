import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { bookingUpdateSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    if (!booking) {
      return jsonError('Booking not found', 404);
    }

    return jsonSuccess({ booking });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const data = bookingUpdateSchema.parse(body);

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data,
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    return jsonSuccess({ booking });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return jsonSuccess({ message: 'Booking deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
