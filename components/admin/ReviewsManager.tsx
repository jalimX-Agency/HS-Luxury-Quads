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

interface ReviewRow {
  id: string;
  tourId: string | null;
  tourSlug: string | null;
  name: string;
  rating: number;
  country: string;
  flag: string;
  reviewDate: string;
  text: { en: string; fr: string };
  isPublished: boolean;
}

interface TourOption {
  id: string;
  slug: string;
  title: { en: string; fr: string };
}

interface ReviewsManagerProps {
  reviews: ReviewRow[];
  tours: TourOption[];
}

const emptyReview = {
  tourId: '',
  name: '',
  rating: 5,
  country: '',
  flag: '',
  reviewDate: '',
  text: { en: '', fr: '' },
  isPublished: true,
};

export default function ReviewsManager({ reviews: initialReviews, tours }: ReviewsManagerProps) {
  const router = useRouter();
  const { loading, error, success, run } = useAdminMutation();
  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReview);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyReview);
  };

  const startEdit = (review: ReviewRow) => {
    setEditingId(review.id);
    setForm({
      tourId: review.tourId ?? '',
      name: review.name,
      rating: review.rating,
      country: review.country,
      flag: review.flag,
      reviewDate: review.reviewDate,
      text: review.text,
      isPublished: review.isPublished,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      tourId: form.tourId || null,
    };

    try {
      if (editingId) {
        await run(
          `/api/admin/reviews/${editingId}`,
          { method: 'PATCH', body: JSON.stringify(payload) },
          'Review updated',
        );
      } else {
        await run('/api/admin/reviews', { method: 'POST', body: JSON.stringify(payload) }, 'Review created');
      }

      resetForm();
      router.refresh();
      window.location.reload();
    } catch {
      // handled in hook
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      await run(`/api/admin/reviews/${id}`, { method: 'DELETE' }, 'Review deleted');
      setReviews((current) => current.filter((review) => review.id !== id));
      router.refresh();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8">
      <div className="space-y-4">
        {error ? <AdminAlert message={error} /> : null}
        {success ? <AdminAlert message={success} type="success" /> : null}

        {reviews.map((review) => (
          <div key={review.id} className="border border-rule/30 bg-bg-subtle p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-ink">
                  {review.flag} {review.name}
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  {review.country} · {review.reviewDate} · {'★'.repeat(review.rating)}
                </p>
                <p className="text-sm text-ink-muted mt-3 italic">&ldquo;{review.text.en}&rdquo;</p>
                <p className="text-xs text-ink-faint mt-2">
                  {review.isPublished ? 'Published' : 'Hidden'}
                  {review.tourSlug ? ` · ${review.tourSlug}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <AdminButton type="button" variant="secondary" onClick={() => startEdit(review)}>
                  Edit
                </AdminButton>
                <AdminButton type="button" variant="danger" onClick={() => deleteReview(review.id)}>
                  Delete
                </AdminButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border border-rule/30 bg-bg-subtle p-6 space-y-5 h-fit">
        <h3 className="font-display text-2xl text-ink">
          {editingId ? 'Edit review' : 'Add review'}
        </h3>

        <div>
          <label className={labelClass}>Linked tour</label>
          <select
            className={inputClass}
            value={form.tourId}
            onChange={(e) => setForm({ ...form, tourId: e.target.value })}
          >
            <option value="">No tour</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title.en}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input
              className={inputClass}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Flag</label>
            <input
              className={inputClass}
              value={form.flag}
              onChange={(e) => setForm({ ...form, flag: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              className={inputClass}
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Date label</label>
            <input
              className={inputClass}
              value={form.reviewDate}
              onChange={(e) => setForm({ ...form, reviewDate: e.target.value })}
              placeholder="May 2026"
              required
            />
          </div>
        </div>

        <LocalizedField
          label="Review text"
          valueEn={form.text.en}
          valueFr={form.text.fr}
          onChangeEn={(en) => setForm({ ...form, text: { ...form.text, en } })}
          onChangeFr={(fr) => setForm({ ...form, text: { ...form.text, fr } })}
          multiline
        />

        <label className="flex items-center gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />
          Published on website
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Update review' : 'Add review'}
          </AdminButton>
          {editingId ? (
            <AdminButton type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </AdminButton>
          ) : null}
        </div>
      </form>
    </div>
  );
}
