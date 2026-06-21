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
  TourReviewSummary,
} from '@/components/admin/tour/TourFormSections';
import { emptyTour, type TourFormState } from '@/components/admin/tour/types';
import { validateTourBasics } from '@/lib/tour-form-utils';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'basics', label: 'Basics', description: 'Pricing and title' },
  { id: 'content', label: 'Content', description: 'Short and full descriptions' },
  { id: 'details', label: 'Details', description: 'Includes and highlights' },
  { id: 'faqs', label: 'FAQs', description: 'Common guest questions' },
  { id: 'links', label: 'Links & Media', description: 'Viator URL, WhatsApp message, images' },
  { id: 'review', label: 'Review', description: 'Confirm and create' },
] as const;

export default function TourWizardForm() {
  const router = useRouter();
  const { loading, error, success, run } = useAdminMutation();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<TourFormState>(emptyTour);
  const [stepError, setStepError] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const goNext = () => {
    if (currentStep.id === 'basics') {
      const validationError = validateTourBasics(form);
      if (validationError) {
        setStepError(validationError);
        return;
      }
    }

    setStepError(null);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const goBack = () => {
    setStepError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const handleCreate = async () => {
    const validationError = validateTourBasics(form);
    if (validationError) {
      setStepError(validationError);
      return;
    }

    setStepError(null);

    try {
      await run('/api/admin/tours', { method: 'POST', body: JSON.stringify(form) }, 'Tour created');
      router.push('/admin/tours');
      router.refresh();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="max-w-4xl">
      {(error || stepError) ? (
        <div className="mb-6">
          <AdminAlert message={stepError || error || ''} />
        </div>
      ) : null}
      {success ? (
        <div className="mb-6">
          <AdminAlert message={success} type="success" />
        </div>
      ) : null}

      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {steps.map((step, index) => {
            const isComplete = index < stepIndex;
            const isCurrent = index === stepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (index <= stepIndex) {
                    setStepError(null);
                    setStepIndex(index);
                  }
                }}
                disabled={index > stepIndex}
                className={cn(
                  'border p-3 text-left transition-colors',
                  isCurrent
                    ? 'border-gold bg-gold/10'
                    : isComplete
                      ? 'border-gold/40 bg-bg-subtle hover:border-gold'
                      : 'border-rule/30 bg-bg-subtle opacity-60 cursor-not-allowed',
                )}
              >
                <p className="font-syne text-[10px] uppercase tracking-widest text-gold">
                  Step {index + 1}
                </p>
                <p className="text-sm text-ink mt-1">{step.label}</p>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink-muted mt-4">{currentStep.description}</p>
      </div>

      <div className="border border-rule/30 bg-bg-subtle p-6 md:p-8 mb-8">
        {currentStep.id === 'basics' ? <BasicsSection form={form} setForm={setForm} hideSlug /> : null}
        {currentStep.id === 'content' ? <DescriptionsSection form={form} setForm={setForm} /> : null}
        {currentStep.id === 'details' ? <DetailsSection form={form} setForm={setForm} /> : null}
        {currentStep.id === 'faqs' ? <FaqsSection form={form} setForm={setForm} /> : null}
        {currentStep.id === 'links' ? <LinksSection form={form} setForm={setForm} /> : null}
        {currentStep.id === 'review' ? <TourReviewSummary form={form} /> : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {!isFirstStep ? (
            <AdminButton type="button" variant="secondary" onClick={goBack} disabled={loading}>
              Back
            </AdminButton>
          ) : (
            <Link href="/admin/tours" className="text-sm text-ink-muted hover:text-gold px-2">
              Cancel
            </Link>
          )}

          {!isLastStep ? (
            <AdminButton type="button" onClick={goNext} disabled={loading}>
              Continue
            </AdminButton>
          ) : (
            <AdminButton type="button" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating...' : 'Create tour'}
            </AdminButton>
          )}
        </div>

        <p className="text-xs text-ink-faint">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
