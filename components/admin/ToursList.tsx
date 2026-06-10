'use client';

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
    <div className="space-y-4">
      {tours.map((tour) => (
        <div
          key={tour.id}
          className="border border-rule/30 bg-bg-subtle p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl text-ink">{tour.title.en}</h3>
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                  tour.isActive
                    ? 'border-green-500/40 text-green-400'
                    : 'border-rule/40 text-ink-faint'
                }`}
              >
                {tour.isActive ? 'Active' : 'Hidden'}
              </span>
            </div>
            <p className="text-sm text-ink-muted mt-2">{tour.shortDescription.en.slice(0, 160)}...</p>
            <p className="text-xs text-ink-faint mt-3">
              {tour.slug} · {tour.price.amount} {tour.price.currency}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
      ))}
    </div>
  );
}
