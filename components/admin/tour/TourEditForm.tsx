'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminAlert, AdminButton, useAdminMutation } from '@/components/admin/AdminForm';
import {
  BasicsSection,
  DescriptionsSection,
  DetailsSection,
  FaqsSection,
  LinksSection,
} from '@/components/admin/tour/TourFormSections';
import { toFormState, type TourFormState } from '@/components/admin/tour/types';
import type { ApiTour } from '@/lib/tours';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'basics', label: 'Basics' },
  { id: 'content', label: 'Content' },
  { id: 'details', label: 'Details' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'links', label: 'Links & Media' },
] as const;

type TabId = (typeof tabs)[number]['id'];

interface TourEditFormProps {
  tour: ApiTour;
}

export default function TourEditForm({ tour }: TourEditFormProps) {
  const router = useRouter();
  const { loading, error, success, run } = useAdminMutation();
  const [activeTab, setActiveTab] = useState<TabId>('basics');
  const [form, setForm] = useState<TourFormState>(toFormState(tour));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await run(`/api/admin/tours/${tour.id}`, { method: 'PATCH', body: JSON.stringify(form) }, 'Tour updated');
      router.refresh();
    } catch {
      // handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {error ? <div className="mb-6"><AdminAlert message={error} /></div> : null}
      {success ? <div className="mb-6"><AdminAlert message={success} type="success" /></div> : null}

      <div className="border border-rule/30 bg-bg-subtle mb-8">
        <div className="flex flex-wrap border-b border-rule/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 py-4 font-syne text-[11px] tracking-[0.14em] uppercase transition-colors',
                activeTab === tab.id
                  ? 'bg-gold text-[oklch(8%_0.01_75)]'
                  : 'text-ink-muted hover:text-gold hover:bg-bg-sunken',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'basics' ? (
            <BasicsSection form={form} setForm={setForm} slugDisabled />
          ) : null}
          {activeTab === 'content' ? <DescriptionsSection form={form} setForm={setForm} /> : null}
          {activeTab === 'details' ? <DetailsSection form={form} setForm={setForm} /> : null}
          {activeTab === 'faqs' ? <FaqsSection form={form} setForm={setForm} /> : null}
          {activeTab === 'links' ? <LinksSection form={form} setForm={setForm} /> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <AdminButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </AdminButton>
        <Link href="/admin/tours" className="text-sm text-ink-muted hover:text-gold">
          Back to tours
        </Link>
      </div>
    </form>
  );
}
