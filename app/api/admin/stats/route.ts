import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const [
      tours,
      activeTours,
      bookings,
      pendingBookings,
      reviews,
      publishedReviews,
      gallery,
      activeGallery,
      recentBookings,
    ] = await Promise.all([
      prisma.tour.count(),
      prisma.tour.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.review.count(),
      prisma.review.count({ where: { isPublished: true } }),
      prisma.gallery.count(),
      prisma.gallery.count({ where: { isActive: true } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          tour: {
            select: { slug: true, title: true },
          },
        },
      }),
    ]);

    return jsonSuccess({
      stats: {
        tours,
        activeTours,
        bookings,
        pendingBookings,
        reviews,
        publishedReviews,
        gallery,
        activeGallery,
      },
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        reference: booking.reference,
        customerName: booking.customerName,
        status: booking.status,
        preferredDate: booking.preferredDate.toISOString().slice(0, 10),
        guests: booking.guests,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        tourSlug: booking.tour.slug,
        tourTitle: booking.tour.title,
        createdAt: booking.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
