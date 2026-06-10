'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AdminButton, useAdminMutation } from '@/components/admin/AdminForm';
import type { ApiTour } from '@/lib/tours';

interface ToursListProps {
  tours: ApiTour[];
}

export default function ToursList({ tours }: ToursListProps) {
  const router = useRouter();
  const { loading, run } = useAdminMutation();

  const toggleActive = async (tour: ApiTour) => {
    await run(
      `/api/admin/tours/${tour.id}`,
      { method: 'PATCH', body: JSON.stringify({ isActive: !tour.isActive }) },
      tour.isActive ? 'Tour deactivated' : 'Tour activated',
    );
    router.refresh();
  };

  const deleteTour = async (tour: ApiTour) => {
    if (!window.confirm(`Delete tour "${tour.title.en}"?`)) return;
    try {
      await run(`/api/admin/tours/${tour.id}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="space-y-3">
      {tours.map((tour) => (
        <div
          key={tour.id}
          className="border border-rule/30 bg-bg-subtle flex flex-col sm:flex-row sm:items-center gap-0 overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="relative w-full sm:w-36 h-28 sm:h-auto sm:self-stretch flex-shrink-0 bg-bg-sunken">
            {tour.images?.[0] ? (
              <Image
                src={tour.images[0]}
                alt={tour.title.en}
                fill
                className="object-cover"
                sizes="144px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-ink-faint/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display text-lg text-ink leading-tight truncate">{tour.title.en}</h3>
                <span
                  className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border flex-shrink-0 ${
                    tour.isActive
                      ? 'border-green-500/40 text-green-400'
                      : 'border-rule/40 text-ink-faint'
                  }`}
                >
                  {tour.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-ink-muted line-clamp-1">{tour.shortDescription.en.slice(0, 120)}</p>
              <p className="text-[10px] text-ink-faint mt-1.5">
                {tour.slug} · {tour.price.amount} {tour.price.currency}
                {tour.viatorUrl ? ' · Viator ✓' : ''}
                {tour.images.length > 0 ? ` · ${tour.images.length} image${tour.images.length > 1 ? 's' : ''}` : ' · No images'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <AdminButton href={`/admin/tours/${tour.id}`} variant="secondary">
                Edit
              </AdminButton>
              <AdminButton type="button" variant="secondary" disabled={loading} onClick={() => toggleActive(tour)}>
                {tour.isActive ? 'Deactivate' : 'Activate'}
              </AdminButton>
              <AdminButton type="button" variant="danger" disabled={loading} onClick={() => deleteTour(tour)}>
                Delete
              </AdminButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
