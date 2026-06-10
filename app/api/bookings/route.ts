import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { sendBookingConfirmationEmail, sendBookingOwnerNotification } from '@/lib/email';
import { bookingSchema } from '@/lib/validations/booking';

function createBookingReference() {
  return `BK-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const tour = await prisma.tour.findUnique({
      where: { slug: data.tourSlug },
    });

    if (!tour || !tour.isActive) {
      return jsonError('Selected tour was not found', 404);
    }

    const reference = createBookingReference();
    const totalAmount = tour.priceAmount * data.guests;
    const preferredDate = new Date(`${data.date}T00:00:00.000Z`);

    const booking = await prisma.booking.create({
      data: {
        reference,
        tourId: tour.id,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        preferredDate,
        guests: data.guests,
        pickup: data.pickup || null,
        message: data.message || null,
        totalAmount,
        currency: tour.priceCurrency,
      },
      include: {
        tour: true,
      },
    });

    const tourTitle =
      (tour.title as { en?: string; fr?: string })[data.locale] ??
      (tour.title as { en?: string }).en ??
      tour.slug;

    const emailContext = {
      booking: {
        ...data,
        reference,
      },
      tourTitle,
      totalAmount,
    };

    try {
      await Promise.all([
        sendBookingConfirmationEmail(data.email, emailContext),
        sendBookingOwnerNotification(emailContext),
      ]);
    } catch (emailError) {
      console.error('[Booking Email Error]', emailError);
      return jsonError(
        'Booking was saved but confirmation emails could not be sent. Our team will follow up manually.',
        502,
      );
    }

    return jsonSuccess(
      {
        booking: {
          id: booking.id,
          reference: booking.reference,
          status: booking.status,
          tourSlug: tour.slug,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          preferredDate: data.date,
          guests: booking.guests,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          createdAt: booking.createdAt.toISOString(),
        },
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
