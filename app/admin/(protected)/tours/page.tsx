import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ToursList from '@/components/admin/ToursList';
import { adminButtonClass } from '@/lib/admin-styles';
import { prisma } from '@/lib/prisma';
import { serializeTour } from '@/lib/tours';

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { priceAmount: 'asc' },
  });

  return (
    <AdminShell
      title="Tours"
      description="Manage luxury quad experiences, pricing, and published content."
      actions={
        <Link href="/admin/tours/new" className={adminButtonClass('primary')}>
          Add tour
        </Link>
      }
    >
      <ToursList tours={tours.map(serializeTour)} />
    </AdminShell>
  );
}
