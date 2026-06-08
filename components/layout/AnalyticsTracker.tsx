'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initGA, pageView } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GA on mount
    initGA();
  }, []);

  useEffect(() => {
    // Track page view on route change
    pageView(pathname);
  }, [pathname]);

  return null;
}
