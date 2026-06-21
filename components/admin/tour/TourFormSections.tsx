'use client';

import Image from 'next/image';
import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  FaqEditor,
  inputClass,
  labelClass,
  LocalizedField,
  LocalizedListEditor,
} from '@/components/admin/AdminForm';
import type { TourFormState } from '@/components/admin/tour/types';
import { slugifyTitle } from '@/lib/tour-form-utils';

interface SectionProps {
  form: TourFormState;
  setForm: Dispatch<SetStateAction<TourFormState>>;
  slugDisabled?: boolean;
  hideSlug?: boolean;
}

export function BasicsSection({ form, setForm, slugDisabled, hideSlug }: SectionProps) {
  const previewSlug = slugifyTitle(form.title.en || form.title.fr);

  return (
    <div className="space-y-6">
      {!hideSlug ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Slug</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              disabled={slugDisabled}
              placeholder="quad-agafay-2h"
            />
            <p className="text-xs text-ink-faint mt-2">Lowercase letters, numbers, and hyphens only.</p>
          </div>
          <div>
            <label className={labelClass}>
              Price amount (Dh) <span className="text-gold">*</span>
            </label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.priceAmount}
              onChange={(e) => setForm({ ...form, priceAmount: Number(e.target.value) })}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>
              Price amount (Dh) <span className="text-gold">*</span>
            </label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.priceAmount}
              onChange={(e) => setForm({ ...form, priceAmount: Number(e.target.value) })}
            />
          </div>
          {previewSlug ? (
            <div className="border border-rule/30 bg-background px-4 py-3">
              <p className="text-xs text-ink-faint uppercase tracking-widest font-syne">Auto URL slug on create</p>
              <p className="text-sm text-ink mt-1">{previewSlug}</p>
            </div>
          ) : null}
        </div>
      )}

      <LocalizedField
        label="Title *"
        valueEn={form.title.en}
        valueFr={form.title.fr}
        onChangeEn={(en) => setForm({ ...form, title: { ...form.title, en } })}
        onChangeFr={(fr) => setForm({ ...form, title: { ...form.title, fr } })}
      />

      <LocalizedField
        label="Duration"
        valueEn={form.duration.en}
        valueFr={form.duration.fr}
        onChangeEn={(en) => setForm({ ...form, duration: { ...form.duration, en } })}
        onChangeFr={(fr) => setForm({ ...form, duration: { ...form.duration, fr } })}
      />

      <LocalizedField
        label="Price display"
        valueEn={form.priceDisplay.en}
        valueFr={form.priceDisplay.fr}
        onChangeEn={(en) => setForm({ ...form, priceDisplay: { ...form.priceDisplay, en } })}
        onChangeFr={(fr) => setForm({ ...form, priceDisplay: { ...form.priceDisplay, fr } })}
      />

      <label className="flex items-center gap-3 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        Active on website
      </label>
    </div>
  );
}

export function DescriptionsSection({ form, setForm }: SectionProps) {
  return (
    <div className="space-y-6">
      <LocalizedField
        label="Short description"
        valueEn={form.shortDescription.en}
        valueFr={form.shortDescription.fr}
        onChangeEn={(en) => setForm({ ...form, shortDescription: { ...form.shortDescription, en } })}
        onChangeFr={(fr) => setForm({ ...form, shortDescription: { ...form.shortDescription, fr } })}
        multiline
      />

      <LocalizedField
        label="Full description"
        valueEn={form.fullDescription.en}
        valueFr={form.fullDescription.fr}
        onChangeEn={(en) => setForm({ ...form, fullDescription: { ...form.fullDescription, en } })}
        onChangeFr={(fr) => setForm({ ...form, fullDescription: { ...form.fullDescription, fr } })}
        multiline
      />
    </div>
  );
}

export function DetailsSection({ form, setForm }: SectionProps) {
  return (
    <div className="space-y-8">
      <LocalizedListEditor
        label="Includes"
        items={form.includes}
        onChange={(includes) => setForm({ ...form, includes })}
      />

      <LocalizedListEditor
        label="Highlights"
        items={form.highlights}
        onChange={(highlights) => setForm({ ...form, highlights })}
      />
    </div>
  );
}

export function FaqsSection({ form, setForm }: SectionProps) {
  return <FaqEditor items={form.faqs} onChange={(faqs) => setForm({ ...form, faqs })} />;
}

export function LinksSection({ form, setForm }: SectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Step 1: get presigned URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'tours',
        }),
      });

      if (!res.ok) throw new Error('Failed to get upload URL');

      const { data } = await res.json();

      // Step 2: upload directly to R2
      const uploadRes = await fetch(data.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error('Upload to R2 failed');

      setForm({
        ...form,
        images: [...form.images, data.publicUrl],
        imageKeys: [...form.imageKeys, data.key],
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
      imageKeys: form.imageKeys.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Viator booking URL</label>
        <input
          className={inputClass}
          value={form.viatorUrl}
          onChange={(e) => setForm({ ...form, viatorUrl: e.target.value })}
          placeholder="https://www.viator.com/en-MA/tours/..."
          type="url"
        />
        <p className="text-xs text-ink-faint mt-1">
          If set, tour cards will show a "Book on Viator" button instead of the details link.
        </p>
      </div>

      <div>
        <label className={labelClass}>WhatsApp pre-filled message</label>
        <textarea
          className={inputClass}
          rows={3}
          value={form.whatsappMsg}
          onChange={(e) => setForm({ ...form, whatsappMsg: e.target.value })}
          placeholder="Hi, I'm interested in booking the 2-hour Agafay quad tour..."
        />
        <p className="text-xs text-ink-faint mt-1">
          Pre-fills the WhatsApp message when a guest taps "WhatsApp Us" on the tour card.
        </p>
      </div>

      <div>
        <label className={labelClass}>Tour images (R2)</label>

        {/* Existing images */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative group border border-rule/30 overflow-hidden">
                <div className="relative h-28">
                  <Image src={url} alt={`Tour image ${i + 1}`} fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <div className="border-2 border-dashed border-rule/40 p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="font-syne text-[10px] tracking-wider uppercase px-4 py-2 border border-rule/40 text-ink-muted hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '+ Upload image'}
          </button>
          <p className="text-xs text-ink-faint mt-2">JPEG, PNG, or WebP · max 10 MB</p>
          {uploadError && <p className="text-xs text-red-400 mt-2">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}

export function TourReviewSummary({ form }: { form: TourFormState }) {
  const previewSlug = slugifyTitle(form.title.en || form.title.fr);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        French fields left empty will be auto-filled from English when you create the tour.
      </p>

      <div className="border border-rule/30 bg-bg-subtle p-5">
        <p className="font-syne text-[10px] uppercase tracking-widest text-gold mb-3">Basics</p>
        <p className="text-sm text-ink-muted">
          Slug: <span className="text-ink">{previewSlug || '—'}</span>
        </p>
        <p className="text-sm text-ink-muted mt-1">
          Price: <span className="text-ink">{form.priceAmount} {form.priceCurrency}</span>
        </p>
        <p className="text-sm text-ink mt-2">{form.title.en || 'No English title'}</p>
        <p className="text-sm text-ink-muted mt-1">{form.title.fr || '(will mirror EN)'}</p>
      </div>

      <div className="border border-rule/30 bg-bg-subtle p-5">
        <p className="font-syne text-[10px] uppercase tracking-widest text-gold mb-3">Content</p>
        <p className="text-sm text-ink-muted line-clamp-3">
          {form.shortDescription.en || 'No short description'}
        </p>
      </div>

      <div className="border border-rule/30 bg-bg-subtle p-5">
        <p className="font-syne text-[10px] uppercase tracking-widest text-gold mb-3">Details</p>
        <p className="text-sm text-ink-muted">
          {form.includes.filter((i) => i.en).length} includes · {form.highlights.filter((h) => h.en).length} highlights
        </p>
      </div>

      <div className="border border-rule/30 bg-bg-subtle p-5">
        <p className="font-syne text-[10px] uppercase tracking-widest text-gold mb-3">FAQs</p>
        <p className="text-sm text-ink-muted">{form.faqs.length} FAQ entries</p>
      </div>

      <p className="text-sm text-ink-muted">
        Status: {form.isActive ? 'Will be published immediately' : 'Will be saved as hidden'}
      </p>
    </div>
  );
}
