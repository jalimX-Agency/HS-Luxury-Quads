'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AdminAlert,
  AdminButton,
  inputClass,
  labelClass,
  LocalizedField,
  useAdminMutation,
} from '@/components/admin/AdminForm';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

interface BookingRow {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  guests: number;
  pickup: string | null;
  message: string | null;
  status: BookingStatus;
  totalAmount: number | null;
  currency: string;
  tourSlug: string;
  tourTitle: { en: string; fr: string };
  createdAt: string;
}

interface BookingsManagerProps {
  bookings: BookingRow[];
}

const statusStyles: Record<BookingStatus, string> = {
  PENDING: 'text-gold border-gold/40 bg-gold/5',
  CONFIRMED: 'text-green-400 border-green-500/40 bg-green-500/5',
  CANCELLED: 'text-red-400 border-red-500/40 bg-red-500/5',
};

export default function BookingsManager({ bookings: initialBookings }: BookingsManagerProps) {
  const router = useRouter();
  const { loading, error, success, run } = useAdminMutation();
  const [bookings, setBookings] = useState(initialBookings);

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const data = await run(
        `/api/admin/bookings/${id}`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        'Booking updated',
      );
      setBookings((current) =>
        current.map((booking) => (booking.id === id ? { ...booking, status: data.booking.status } : booking)),
      );
      router.refresh();
    } catch {
      // handled in hook
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Delete this booking permanently?')) return;

    try {
      await run(`/api/admin/bookings/${id}`, { method: 'DELETE' }, 'Booking deleted');
      setBookings((current) => current.filter((booking) => booking.id !== id));
      router.refresh();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="space-y-6">
      {error ? <AdminAlert message={error} /> : null}
      {success ? <AdminAlert message={success} type="success" /> : null}

      <div className="overflow-x-auto border border-rule/30">
        <table className="min-w-full text-sm">
          <thead className="bg-bg-subtle border-b border-rule/30">
            <tr className="text-left">
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Reference</th>
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Customer</th>
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Tour</th>
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Date</th>
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Guests</th>
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Status</th>
              <th className="px-4 py-3 font-syne text-[10px] uppercase tracking-widest text-ink-faint">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-rule/20 align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-ink">{booking.reference}</p>
                  <p className="text-xs text-ink-faint mt-1">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p>{booking.customerName}</p>
                  <p className="text-xs text-ink-muted mt-1">{booking.customerEmail}</p>
                  <p className="text-xs text-ink-muted">{booking.customerPhone}</p>
                  {booking.pickup ? (
                    <p className="text-xs text-ink-faint mt-1">Pickup: {booking.pickup}</p>
                  ) : null}
                  {booking.message ? (
                    <p className="text-xs text-ink-faint mt-1">{booking.message}</p>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <p>{booking.tourTitle.en}</p>
                  <p className="text-xs text-ink-faint mt-1">{booking.tourSlug}</p>
                </td>
                <td className="px-4 py-4">{booking.preferredDate}</td>
                <td className="px-4 py-4">{booking.guests}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block border px-2 py-1 text-xs uppercase ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                  <p className="text-xs text-ink-muted mt-2">
                    {booking.totalAmount ?? 0} {booking.currency}
                  </p>
                </td>
                <td className="px-4 py-4 space-y-2 min-w-[180px]">
                  <select
                    className={inputClass}
                    value={booking.status}
                    disabled={loading}
                    onChange={(e) => updateStatus(booking.id, e.target.value as BookingStatus)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <AdminButton
                    type="button"
                    variant="danger"
                    disabled={loading}
                    onClick={() => deleteBooking(booking.id)}
                    className="w-full"
                  >
                    Delete
                  </AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-ink-muted">No bookings yet.</p>
      ) : null}
    </div>
  );
}
