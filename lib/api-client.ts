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
  category: string;
  sortOrder: number;
}

// NOTE: Public data is now fetched directly via `lib/queries.ts` in server
// components (no HTTP round-trip). These interfaces remain the shared response
// shapes used by both the API routes and the query layer.
