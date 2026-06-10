import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import StatCard from '@/components/admin/StatCard';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  if (!(await getAdminSession())) {
    redirect('/admin/login');
  }

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

  return (
    <AdminShell
      title="Dashboard"
      description="Overview of bookings, tours, reviews, and gallery content."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard label="Tours" value={tours} hint={`${activeTours} active`} />
        <StatCard label="Bookings" value={bookings} hint={`${pendingBookings} pending`} />
        <StatCard label="Reviews" value={reviews} hint={`${publishedReviews} published`} />
        <StatCard label="Gallery" value={gallery} hint={`${activeGallery} active`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <Link href="/admin/bookings" className="block border border-rule/30 bg-bg-subtle p-5 hover:border-gold transition-colors cursor-pointer">
          <p className="font-syne text-[10px] uppercase tracking-widest text-gold">Manage</p>
          <p className="font-display text-2xl text-ink mt-2">Bookings</p>
        </Link>
        <Link href="/admin/tours" className="block border border-rule/30 bg-bg-subtle p-5 hover:border-gold transition-colors cursor-pointer">
          <p className="font-syne text-[10px] uppercase tracking-widest text-gold">Manage</p>
          <p className="font-display text-2xl text-ink mt-2">Tours</p>
        </Link>
        <Link href="/admin/reviews" className="block border border-rule/30 bg-bg-subtle p-5 hover:border-gold transition-colors cursor-pointer">
          <p className="font-syne text-[10px] uppercase tracking-widest text-gold">Manage</p>
          <p className="font-display text-2xl text-ink mt-2">Reviews</p>
        </Link>
        <Link href="/admin/gallery" className="block border border-rule/30 bg-bg-subtle p-5 hover:border-gold transition-colors cursor-pointer">
          <p className="font-syne text-[10px] uppercase tracking-widest text-gold">Manage</p>
          <p className="font-display text-2xl text-ink mt-2">Gallery</p>
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-ink">Recent bookings</h3>
          <Link href="/admin/bookings" className="text-sm text-gold hover:text-gold-light">
            View all
          </Link>
        </div>

        <div className="border border-rule/30 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-bg-subtle border-b border-rule/30">
              <tr className="text-left">
                <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Reference</th>
                <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Customer</th>
                <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Tour</th>
                <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Date</th>
                <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-rule/20">
                  <td className="px-4 py-4">{booking.reference}</td>
                  <td className="px-4 py-4">{booking.customerName}</td>
                  <td className="px-4 py-4">
                    {(booking.tour.title as { en: string }).en}
                  </td>
                  <td className="px-4 py-4">{booking.preferredDate.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-4">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
