'use client';

import Image from 'next/image';
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

interface GalleryRow {
  id: string;
  url: string;
  alt: { en: string; fr: string };
  sortOrder: number;
  isActive: boolean;
}

interface GalleryManagerProps {
  items: GalleryRow[];
}

const emptyItem = {
  url: '',
  alt: { en: '', fr: '' },
  sortOrder: 0,
  isActive: true,
};

export default function GalleryManager({ items: initialItems }: GalleryManagerProps) {
  const router = useRouter();
  const { loading, error, success, run } = useAdminMutation();
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyItem);
  };

  const startEdit = (item: GalleryRow) => {
    setEditingId(item.id);
    setForm({
      url: item.url,
      alt: item.alt,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await run(
          `/api/admin/gallery/${editingId}`,
          { method: 'PATCH', body: JSON.stringify(form) },
          'Gallery item updated',
        );
      } else {
        await run('/api/admin/gallery', { method: 'POST', body: JSON.stringify(form) }, 'Gallery item created');
      }

      resetForm();
      router.refresh();
      window.location.reload();
    } catch {
      // handled in hook
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('Delete this gallery image?')) return;

    try {
      await run(`/api/admin/gallery/${id}`, { method: 'DELETE' }, 'Gallery item deleted');
      setItems((current) => current.filter((item) => item.id !== id));
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-rule/30 bg-bg-subtle overflow-hidden">
              <div className="relative h-48 bg-bg-sunken">
                <Image src={item.url} alt={item.alt.en} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-ink">{item.alt.en}</p>
                <p className="text-xs text-ink-faint">
                  Order {item.sortOrder} · {item.isActive ? 'Active' : 'Hidden'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminButton type="button" variant="secondary" onClick={() => startEdit(item)}>
                    Edit
                  </AdminButton>
                  <AdminButton type="button" variant="danger" onClick={() => deleteItem(item.id)}>
                    Delete
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border border-rule/30 bg-bg-subtle p-6 space-y-5 h-fit">
        <h3 className="font-display text-2xl text-ink">
          {editingId ? 'Edit image' : 'Add image'}
        </h3>

        <div>
          <label className={labelClass}>Image URL</label>
          <input
            className={inputClass}
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="/images/gallery-atlas.png"
            required
          />
        </div>

        <LocalizedField
          label="Alt text"
          valueEn={form.alt.en}
          valueFr={form.alt.fr}
          onChangeEn={(en) => setForm({ ...form, alt: { ...form.alt, en } })}
          onChangeFr={(fr) => setForm({ ...form, alt: { ...form.alt, fr } })}
        />

        <div>
          <label className={labelClass}>Sort order</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active on website
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Update image' : 'Add image'}
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
