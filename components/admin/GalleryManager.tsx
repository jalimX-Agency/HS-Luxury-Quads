'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
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
  category: string;
  sortOrder: number;
  isActive: boolean;
  imageKey?: string | null;
}

interface GalleryManagerProps {
  items: GalleryRow[];
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All / General' },
  { value: 'quads', label: 'Quad Biking' },
  { value: 'camel', label: 'Camel Rides' },
  { value: 'dinner', label: 'Sunset & Dinner' },
  { value: 'camp', label: 'Desert Camp' },
] as const;

const emptyItem = {
  url: '',
  alt: { en: '', fr: '' },
  category: 'all' as string,
  sortOrder: 0,
  isActive: true,
  imageKey: null as string | null,
};

export default function GalleryManager({ items: initialItems }: GalleryManagerProps) {
  const router = useRouter();
  const { loading, error, success, run } = useAdminMutation();
  const [items, setItems] = useState(initialItems);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyItem);
    setUploadError(null);
  };

  const startEdit = (item: GalleryRow) => {
    setEditingId(item.id);
    setForm({
      url: item.url,
      alt: item.alt,
      category: item.category ?? 'all',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      imageKey: item.imageKey ?? null,
    });
    setUploadError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'gallery' }),
      });

      if (!res.ok) throw new Error('Failed to get upload URL');
      const { data } = await res.json();

      const uploadRes = await fetch(data.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error('Upload to R2 failed');

      setForm((f) => ({ ...f, url: data.publicUrl, imageKey: data.key }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.url) {
      setUploadError('Please upload an image before saving.');
      return;
    }

    try {
      if (editingId) {
        const data = await run(
          `/api/admin/gallery/${editingId}`,
          { method: 'PATCH', body: JSON.stringify(form) },
          'Gallery item updated',
        );
        if (data?.item) {
          setItems((current) =>
            current.map((it) => (it.id === editingId ? { ...it, ...data.item } : it))
          );
        }
      } else {
        const data = await run(
          '/api/admin/gallery',
          { method: 'POST', body: JSON.stringify(form) },
          'Gallery item created',
        );
        if (data?.item) {
          setItems((current) => [...current, data.item]);
        }
      }

      resetForm();
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

  const filteredItems = filterCategory === 'all'
    ? items
    : items.filter((item) => item.category === filterCategory);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8">
      <div className="space-y-4">
        {error ? <AdminAlert message={error} /> : null}
        {success ? <AdminAlert message={success} type="success" /> : null}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => {
            const count = opt.value === 'all' ? items.length : items.filter((it) => it.category === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilterCategory(opt.value)}
                className={`font-syne text-[10px] font-semibold tracking-wider uppercase px-4 py-2 border transition-all duration-150 flex items-center gap-1.5 ${
                  filterCategory === opt.value
                    ? 'bg-gold text-background border-gold'
                    : 'border-rule/30 text-ink-muted hover:border-gold hover:text-gold'
                }`}
              >
                {opt.label}
                <span className="opacity-60 font-normal tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="border border-rule/30 bg-bg-subtle overflow-hidden">
              <div className="relative h-48 bg-bg-sunken">
                <Image src={item.url} alt={item.alt.en} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-ink">{item.alt.en}</p>
                <p className="text-xs text-ink-faint">
                  Order {item.sortOrder} · {item.isActive ? 'Active' : 'Hidden'}
                  {item.imageKey ? ' · R2' : ''}
                </p>
                <p className="text-[10px] font-syne font-semibold tracking-wider uppercase text-gold/80">
                  {CATEGORY_OPTIONS.find((o) => o.value === item.category)?.label ?? item.category}
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

        {/* R2 upload — only source for gallery images */}
        <div>
          <label className={labelClass}>Image</label>
          <div className="border-2 border-dashed border-rule/40 p-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-syne text-[10px] tracking-wider uppercase px-4 py-2 border border-rule/40 text-ink-muted hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : '+ Choose file'}
            </button>
            {form.url && form.imageKey && (
              <p className="text-xs text-green-400 mt-2 truncate">✓ {form.url.split('/').pop()}</p>
            )}
            {uploadError && <p className="text-xs text-red-400 mt-2">{uploadError}</p>}
          </div>
        </div>

        <LocalizedField
          label="Alt text"
          valueEn={form.alt.en}
          valueFr={form.alt.fr}
          onChangeEn={(en) => setForm({ ...form, alt: { ...form.alt, en } })}
          onChangeFr={(fr) => setForm({ ...form, alt: { ...form.alt, fr } })}
        />

        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

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
          <AdminButton type="submit" disabled={loading || uploading}>
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
