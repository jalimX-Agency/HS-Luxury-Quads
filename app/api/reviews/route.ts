import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    return jsonSuccess({
      reviews: reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        country: review.country,
        flag: review.flag,
        date: review.reviewDate,
        text: review.text,
        tourSlug: review.tour?.slug ?? null,
        tourTitle: review.tour?.title ?? null,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
