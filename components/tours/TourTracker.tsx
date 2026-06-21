'use client';

import { useEffect } from 'react';
import type { Tour, Locale } from '@/content/tours';
import { trackTourView } from '@/lib/analytics';

interface TourTrackerProps {
  tour: Tour;
  locale: Locale;
}

export default function TourTracker({ tour, locale }: TourTrackerProps) {
  useEffect(() => {
    trackTourView({
      tour_id: tour.slug,
      tour_name: tour.title[locale],
      tour_price: tour.price.amount,
      currency: tour.price.currency,
    });
  }, [tour, locale]);

  return null;
}
