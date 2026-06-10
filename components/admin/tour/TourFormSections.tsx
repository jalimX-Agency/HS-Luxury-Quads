import type { Dispatch, SetStateAction } from 'react';
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
              Price amount (EUR) <span className="text-gold">*</span>
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
              Price amount (EUR) <span className="text-gold">*</span>
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
