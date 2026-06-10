import type { ApiTour } from '@/lib/tours';

type LocalizedString = { en: string; fr: string };

export interface ApiReview {
  id: string;
  name: string;
  rating: number;
  country: string;
  flag: string;
  date: string;
  text: LocalizedString;
  tourSlug?: string | null;
  tourTitle?: LocalizedString | null;
}

export interface ApiGalleryItem {
  id: string;
  url: string;
  alt: LocalizedString;
  sortOrder: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getApiBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    next: { revalidate: 60 },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || `Failed to fetch ${path}`);
  }

  return result.data;
}

export async function getTours() {
  const data = await apiFetch<{ tours: ApiTour[] }>('/api/tours');
  return data.tours;
}

export async function getTourBySlug(slug: string) {
  return apiFetch<{ tour: ApiTour; reviews: ApiReview[] }>(`/api/tours/${slug}`);
}

export async function getGallery() {
  const data = await apiFetch<{ gallery: ApiGalleryItem[] }>('/api/gallery');
  return data.gallery;
}

export async function getReviews() {
  const data = await apiFetch<{ reviews: ApiReview[] }>('/api/reviews');
  return data.reviews;
}
