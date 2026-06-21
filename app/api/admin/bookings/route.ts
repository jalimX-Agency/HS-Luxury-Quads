import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    return jsonSuccess({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        reference: booking.reference,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        preferredDate: booking.preferredDate.toISOString().slice(0, 10),
        guests: booking.guests,
        pickup: booking.pickup,
        message: booking.message,
        status: booking.status,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        tourId: booking.tourId,
        tourSlug: booking.tour.slug,
        tourTitle: booking.tour.title,
        createdAt: booking.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
