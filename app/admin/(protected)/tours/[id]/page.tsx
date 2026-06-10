import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import TourEditForm from '@/components/admin/tour/TourEditForm';
import { prisma } from '@/lib/prisma';
import { serializeTour } from '@/lib/tours';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditTourPage({ params }: PageProps) {
  const tour = await prisma.tour.findUnique({ where: { id: params.id } });

  if (!tour) {
    notFound();
  }

  return (
    <AdminShell title="Edit tour" description={`Update content for ${tour.slug}.`}>
      <TourEditForm tour={serializeTour(tour)} />
    </AdminShell>
  );
}
