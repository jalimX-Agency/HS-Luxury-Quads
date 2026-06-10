import AdminShell from '@/components/admin/AdminShell';
import BookingsManager from '@/components/admin/BookingsManager';
import { prisma } from '@/lib/prisma';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tour: {
        select: { slug: true, title: true },
      },
    },
  });

  return (
    <AdminShell
      title="Bookings"
      description="Review incoming requests, update status, and manage customer details."
    >
      <BookingsManager
        bookings={bookings.map((booking) => ({
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
          tourSlug: booking.tour.slug,
          tourTitle: booking.tour.title as { en: string; fr: string },
          createdAt: booking.createdAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
