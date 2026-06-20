'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface LocalizedString {
  en: string;
  fr: string;
}

interface BlogFormState {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  image: string;
  imageKey: string;
  category: string;
  author: string;
  featured: boolean;
  isPublished: boolean;
}

const emptyPost: BlogFormState = {
  slug: '',
  title: { en: '', fr: '' },
  excerpt: { en: '', fr: '' },
  content: { en: '', fr: '' },
  image: '',
  imageKey: '',
  category: '',
  author: 'HS Luxury Quads',
  featured: false,
  isPublished: false,
};

interface BlogFormProps {
  mode: 'create' | 'edit';
  postId?: string;
  initial?: Partial<BlogFormState>;
}

type Tab = 'general' | 'content-en' | 'content-fr' | 'media';

export default function BlogForm({ mode, postId, initial }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormState>({ ...emptyPost, ...initial });
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setLocalized = (field: 'title' | 'excerpt' | 'content', locale: 'en' | 'fr', value: string) =>
    setForm((f) => ({ ...f, [field]: { ...f[field], [locale]: value } }));

  const autoSlug = (enTitle: string) => {
    if (mode === 'create' && !form.slug) {
      const slug = enTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      set('slug', slug);
    }
  };

  const uploadImage = async (file: File) => {
    setUploadError('');
    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'blog' }),
      });
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { presignedUrl, publicUrl, key } = await res.json();
      const put = await fetch(presignedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      if (!put.ok) throw new Error('Upload failed');
      setForm((f) => ({ ...f, image: publicUrl, imageKey: key }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${postId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          imageKey: form.imageKey || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }
      router.push('/admin/blog');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!postId || !confirm('Delete this post permanently?')) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' });
      router.push('/admin/blog');
      router.refresh();
    } catch {
      setError('Delete failed');
      setDeleting(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'content-en', label: 'Content EN' },
    { id: 'content-fr', label: 'Content FR' },
    { id: 'media', label: 'Media' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-rule/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-syne text-[10px] font-semibold tracking-widest uppercase transition-colors ${
              activeTab === tab.id
                ? 'text-gold border-b-2 border-gold -mb-px'
                : 'text-ink-faint hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-5 max-w-2xl">
          <Field label="Title (EN)" required>
            <input
              value={form.title.en}
              onChange={(e) => { setLocalized('title', 'en', e.target.value); autoSlug(e.target.value); }}
              className="admin-input"
            />
          </Field>
          <Field label="Title (FR)" required>
            <input value={form.title.fr} onChange={(e) => setLocalized('title', 'fr', e.target.value)} className="admin-input" />
          </Field>
          <Field label="Slug" required>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className="admin-input font-mono text-sm" />
          </Field>
          <Field label="Excerpt (EN)" required>
            <textarea value={form.excerpt.en} onChange={(e) => setLocalized('excerpt', 'en', e.target.value)} rows={3} className="admin-input" />
          </Field>
          <Field label="Excerpt (FR)" required>
            <textarea value={form.excerpt.fr} onChange={(e) => setLocalized('excerpt', 'fr', e.target.value)} rows={3} className="admin-input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <input value={form.category} onChange={(e) => set('category', e.target.value)} className="admin-input" placeholder="e.g. Travel Tips" />
            </Field>
            <Field label="Author">
              <input value={form.author} onChange={(e) => set('author', e.target.value)} className="admin-input" />
            </Field>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="accent-gold" />
              <span className="font-syne text-[10px] font-semibold tracking-widest uppercase text-ink">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-gold" />
              <span className="font-syne text-[10px] font-semibold tracking-widest uppercase text-ink">Featured</span>
            </label>
          </div>
        </div>
      )}

      {/* Content EN */}
      {activeTab === 'content-en' && (
        <div className="max-w-2xl">
          <Field label="Article Content (English — HTML supported)">
            <textarea
              value={form.content.en}
              onChange={(e) => setLocalized('content', 'en', e.target.value)}
              rows={20}
              className="admin-input font-mono text-xs"
              placeholder="<p>Write your article content here...</p>"
            />
          </Field>
          <p className="mt-2 font-syne text-[9px] text-ink-faint tracking-wider">HTML is rendered. Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.</p>
        </div>
      )}

      {/* Content FR */}
      {activeTab === 'content-fr' && (
        <div className="max-w-2xl">
          <Field label="Contenu de l'article (Français — HTML supporté)">
            <textarea
              value={form.content.fr}
              onChange={(e) => setLocalized('content', 'fr', e.target.value)}
              rows={20}
              className="admin-input font-mono text-xs"
              placeholder="<p>Rédigez votre article ici...</p>"
            />
          </Field>
          <p className="mt-2 font-syne text-[9px] text-ink-faint tracking-wider">Le HTML est rendu. Utilisez &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.</p>
        </div>
      )}

      {/* Media */}
      {activeTab === 'media' && (
        <div className="max-w-md space-y-4">
          <p className="font-syne text-[10px] font-semibold tracking-widest uppercase text-ink-faint">Cover Image</p>
          {form.image && (
            <div className="relative w-full h-48 overflow-hidden">
              <Image src={form.image} alt="Cover" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, image: '', imageKey: '' }))}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 hover:bg-black/90"
              >
                Remove
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border border-dashed border-rule/50 py-8 text-center font-syne text-[10px] tracking-widest uppercase text-ink-faint hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : form.image ? 'Replace image' : 'Upload cover image'}
          </button>
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
        </div>
      )}

      {/* Footer actions */}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-3 pt-4 border-t border-rule/20">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gold text-[oklch(8%_0.01_75)] font-syne text-[10px] font-semibold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Saving…' : mode === 'create' ? 'Create post' : 'Save changes'}
        </button>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-2.5 border border-red-400/40 text-red-400 font-syne text-[10px] font-semibold tracking-widest uppercase hover:bg-red-400/10 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-syne text-[10px] font-semibold tracking-widest uppercase text-ink-faint">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
