import { prisma } from '@/lib/prisma';
import { serializeTour, type ApiTour } from '@/lib/tours';
import type { ApiReview, ApiGalleryItem } from '@/lib/api-client';

/**
 * Shared data-access functions used by BOTH the public API routes and the
 * server-component pages. Pages call these directly (no HTTP round-trip);
 * API routes wrap them for external/client consumers.
 */

export async function fetchActiveTours(): Promise<ApiTour[]> {
  const tours = await prisma.tour.findMany({
    where: { isActive: true },
    orderBy: { priceAmount: 'asc' },
  });
  return tours.map(serializeTour);
}

export async function fetchTourBySlug(
  slug: string,
): Promise<{ tour: ApiTour; reviews: ApiReview[] } | null> {
  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!tour || !tour.isActive) return null;

  const { reviews, ...tourData } = tour;

  return {
    tour: serializeTour(tourData),
    reviews: reviews.map((review) => ({
      id: review.id,
      name: review.name,
      rating: review.rating,
      country: review.country,
      flag: review.flag,
      date: review.reviewDate,
      text: review.text as ApiReview['text'],
    })),
  };
}

export async function fetchPublishedReviews(): Promise<ApiReview[]> {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      tour: { select: { slug: true, title: true } },
    },
  });

  return reviews.map((review) => ({
    id: review.id,
    name: review.name,
    rating: review.rating,
    country: review.country,
    flag: review.flag,
    date: review.reviewDate,
    text: review.text as ApiReview['text'],
    tourSlug: review.tour?.slug ?? null,
    tourTitle: (review.tour?.title ?? null) as ApiReview['tourTitle'],
  }));
}

export async function fetchActiveGallery(): Promise<ApiGalleryItem[]> {
  const items = await prisma.gallery.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return items.map((item) => ({
    id: item.id,
    url: item.url,
    alt: item.alt as ApiGalleryItem['alt'],
    category: item.category,
    sortOrder: item.sortOrder,
  }));
}
