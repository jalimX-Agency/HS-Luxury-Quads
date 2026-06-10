import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { handleApiError, jsonSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { reviewWriteSchema } from '@/lib/validations/admin';

function serializeReview(review: {
  id: string;
  tourId: string | null;
  name: string;
  rating: number;
  country: string;
  flag: string;
  reviewDate: string;
  text: unknown;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tour?: { slug: string; title: unknown } | null;
}) {
  return {
    id: review.id,
    tourId: review.tourId,
    tourSlug: review.tour?.slug ?? null,
    tourTitle: review.tour?.title ?? null,
    name: review.name,
    rating: review.rating,
    country: review.country,
    flag: review.flag,
    reviewDate: review.reviewDate,
    text: review.text,
    isPublished: review.isPublished,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    return jsonSuccess({
      reviews: reviews.map(serializeReview),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const data = reviewWriteSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        tourId: data.tourId || null,
        name: data.name,
        rating: data.rating,
        country: data.country,
        flag: data.flag,
        reviewDate: data.reviewDate,
        text: data.text,
        isPublished: data.isPublished,
      },
      include: {
        tour: {
          select: { slug: true, title: true },
        },
      },
    });

    return jsonSuccess({ review: serializeReview(review) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
