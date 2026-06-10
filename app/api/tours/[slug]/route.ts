import { prisma } from '@/lib/prisma';
import { handleApiError, jsonError, jsonSuccess } from '@/lib/api-response';
import { serializeTour } from '@/lib/tours';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const slug = params.slug?.trim();

    if (!slug) {
      return jsonError('Tour slug is required', 400);
    }

    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: {
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tour || !tour.isActive) {
      return jsonError('Tour not found', 404);
    }

    const { reviews, ...tourData } = tour;

    return jsonSuccess({
      tour: serializeTour(tourData),
      reviews: reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        country: review.country,
        flag: review.flag,
        date: review.reviewDate,
        text: review.text,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
