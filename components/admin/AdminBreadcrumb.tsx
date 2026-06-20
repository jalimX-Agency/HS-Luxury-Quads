'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  admin: 'Dashboard',
  bookings: 'Bookings',
  tours: 'Tours',
  reviews: 'Reviews',
  gallery: 'Gallery',
  media: 'Media',
  settings: 'Settings',
  new: 'New',
};

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  // Build segments: skip empty strings, strip "(protected)"
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((s) => !s.startsWith('('));

  if (segments.length <= 1) return null; // on /admin itself, no breadcrumb needed

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    // If last segment looks like a cuid (no known label), call it "Edit"
    const label = LABELS[seg] ?? (seg.length > 12 ? 'Edit' : seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 px-6 md:px-10 pt-4 pb-0">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-ink-faint text-xs">/</span>
          )}
          {crumb.isLast ? (
            <span className="font-syne text-[10px] uppercase tracking-widest text-gold">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="font-syne text-[10px] uppercase tracking-widest text-ink-faint hover:text-gold transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
