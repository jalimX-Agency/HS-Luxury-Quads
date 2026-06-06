/**
 * Google Analytics 4 — HS Luxury Quads Morocco
 *
 * Tracked events:
 *   page_view         — auto-fired on route change via usePathname effect
 *   tour_view         — user opens a tour/quad detail page
 *   booking_started   — user clicks "Book Now" or starts the booking form
 *   booking_completed — user submits the booking form successfully
 *
 * Setup:
 *   1. Create a GA4 property in Google Analytics
 *   2. Get your Measurement ID (G-XXXXXXXXXX)
 *   3. Add NEXT_PUBLIC_GA_MEASUREMENT_ID to Vercel environment variables
 *   4. Import and call pageView() in your root layout or page wrapper
 */

declare global {
  interface Window {
    gtag?: (...args: GtagEvent[]) => void;
    dataLayer?: GtagEvent[];
  }
}

type GtagEvent = unknown; // GA accepts any number of mixed-type args

// ─── Singleton GA client ─────────────────────────────────────────────────────
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

/**
 * Inject the GA4 script tag. Call this once in your root layout.
 * Safe to call multiple times — script is only added once.
 */
export function initGA(): void {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtagFn(...args: GtagEvent[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());

  window.gtag('config', GA_MEASUREMENT_ID, {
    // Send page_view automatically on config — we handle it separately below
    send_page_view: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.type = 'text/javascript';
  document.head.appendChild(script);
}

// ─── Page view ───────────────────────────────────────────────────────────────
export function pageView(url: string, title?: string): void {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', 'page_view', {
    page_location: url,
    page_title: title ?? document.title,
  });
}

// ─── Tour view ───────────────────────────────────────────────────────────────
export interface TourViewParams {
  tour_id: string;
  tour_name: string;
  tour_price?: number;
  currency?: string;
}

export function trackTourView(params: TourViewParams): void {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', 'tour_view', {
    event_category: 'engagement',
    event_label: params.tour_name,
    tour_id: params.tour_id,
    value: params.tour_price ?? 0,
    currency: params.currency ?? 'EUR',
  });
}

// ─── Booking started ──────────────────────────────────────────────────────────
export interface BookingStartedParams {
  tour_id: string;
  tour_name: string;
  booking_source?: 'website' | 'whatsapp' | 'instagram';
  visitors_count?: number;
}

export function trackBookingStarted(params: BookingStartedParams): void {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', 'booking_started', {
    event_category: 'conversion',
    event_label: params.tour_name,
    tour_id: params.tour_id,
    visitors_count: params.visitors_count ?? 1,
    booking_source: params.booking_source ?? 'website',
  });
}

// ─── Booking completed ────────────────────────────────────────────────────────
export interface BookingCompletedParams {
  booking_id: string;
  tour_id: string;
  tour_name: string;
  total_amount?: number;
  currency?: string;
  visitors_count?: number;
  customer_email?: string;
  payment_method?: 'stripe' | 'cash' | 'transfer';
}

export function trackBookingCompleted(params: BookingCompletedParams): void {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', 'booking_completed', {
    event_category: 'conversion',
    event_label: params.tour_name,
    booking_id: params.booking_id,
    value: params.total_amount ?? 0,
    currency: params.currency ?? 'EUR',
    visitors_count: params.visitors_count ?? 1,
    payment_method: params.payment_method ?? 'cash',
    // PII should only be sent if user has consented — keep email optional and off by default
    ...(params.customer_email && { user_email: params.customer_email }),
  });
}

// ─── React hook for automatic page view tracking ─────────────────────────────
/*
// Usage in your root layout or a layout component:
//
// import { usePathname } from 'next/navigation';
// import { useEffect } from 'react';
// import { pageView } from '@/lib/analytics';
//
// export default function AnalyticsTracker() {
//   const pathname = usePathname();
//
//   useEffect(() => {
//     pageView(pathname);
//   }, [pathname]);
//
//   return null;
// }
*/