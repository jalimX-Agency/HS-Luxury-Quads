import AdminShell from '@/components/admin/AdminShell';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { prisma } from '@/lib/prisma';

export default async function AdminReviewsPage() {
  const [reviews, tours] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: { slug: true },
        },
      },
    }),
    prisma.tour.findMany({
      orderBy: { priceAmount: 'asc' },
      select: { id: true, slug: true, title: true },
    }),
  ]);

  return (
    <AdminShell
      title="Reviews"
      description="Publish guest impressions and link them to specific tours."
    >
      <ReviewsManager
        reviews={reviews.map((review) => ({
          id: review.id,
          tourId: review.tourId,
          tourSlug: review.tour?.slug ?? null,
          name: review.name,
          rating: review.rating,
          country: review.country,
          flag: review.flag,
          reviewDate: review.reviewDate,
          text: review.text as { en: string; fr: string },
          isPublished: review.isPublished,
        }))}
        tours={tours.map((tour) => ({
          id: tour.id,
          slug: tour.slug,
          title: tour.title as { en: string; fr: string },
        }))}
      />
    </AdminShell>
  );
}
