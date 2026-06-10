'use client';

import Link from 'next/link';
import { useState } from 'react';
import { adminButtonClass, type AdminButtonVariant } from '@/lib/admin-styles';

const inputClass =
  'w-full bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors';

const labelClass =
  'font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2 block';

interface LocalizedFieldProps {
  label: string;
  valueEn: string;
  valueFr: string;
  onChangeEn: (value: string) => void;
  onChangeFr: (value: string) => void;
  multiline?: boolean;
}

export function LocalizedField({
  label,
  valueEn,
  valueFr,
  onChangeEn,
  onChangeFr,
  multiline,
}: LocalizedFieldProps) {
  const Input = multiline ? 'textarea' : 'input';

  return (
    <div className="space-y-4">
      <p className={labelClass}>{label}</p>
      <div>
        <label className="text-xs text-ink-muted mb-1 block">English</label>
        <Input
          className={`${inputClass} ${multiline ? 'min-h-28 resize-y' : ''}`}
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-ink-muted mb-1 block">French</label>
        <Input
          className={`${inputClass} ${multiline ? 'min-h-28 resize-y' : ''}`}
          value={valueFr}
          onChange={(e) => onChangeFr(e.target.value)}
        />
      </div>
    </div>
  );
}

interface LocalizedListEditorProps {
  label: string;
  items: Array<{ en: string; fr: string }>;
  onChange: (items: Array<{ en: string; fr: string }>) => void;
}

export function LocalizedListEditor({ label, items, onChange }: LocalizedListEditorProps) {
  const updateItem = (index: number, locale: 'en' | 'fr', value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [locale]: value } : item));
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className={labelClass}>{label}</p>
        <button
          type="button"
          onClick={() => onChange([...items, { en: '', fr: '' }])}
          className="font-syne text-[10px] tracking-[0.14em] uppercase text-gold hover:text-gold-light"
        >
          + Add item
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="border border-rule/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-faint">Item {index + 1}</span>
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            className={inputClass}
            placeholder="English"
            value={item.en}
            onChange={(e) => updateItem(index, 'en', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="French"
            value={item.fr}
            onChange={(e) => updateItem(index, 'fr', e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

interface FaqEditorProps {
  items: Array<{ question: { en: string; fr: string }; answer: { en: string; fr: string } }>;
  onChange: (
    items: Array<{ question: { en: string; fr: string }; answer: { en: string; fr: string } }>,
  ) => void;
}

export function FaqEditor({ items, onChange }: FaqEditorProps) {
  const updateFaq = (
    index: number,
    field: 'question' | 'answer',
    locale: 'en' | 'fr',
    value: string,
  ) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: { ...item[field], [locale]: value } } : item,
    );
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className={labelClass}>FAQs</p>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                question: { en: '', fr: '' },
                answer: { en: '', fr: '' },
              },
            ])
          }
          className="font-syne text-[10px] tracking-[0.14em] uppercase text-gold hover:text-gold-light"
        >
          + Add FAQ
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="border border-rule/20 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-faint">FAQ {index + 1}</span>
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            ) : null}
          </div>
          <LocalizedField
            label="Question"
            valueEn={item.question.en}
            valueFr={item.question.fr}
            onChangeEn={(value) => updateFaq(index, 'question', 'en', value)}
            onChangeFr={(value) => updateFaq(index, 'question', 'fr', value)}
          />
          <LocalizedField
            label="Answer"
            valueEn={item.answer.en}
            valueFr={item.answer.fr}
            onChangeEn={(value) => updateFaq(index, 'answer', 'en', value)}
            onChangeFr={(value) => updateFaq(index, 'answer', 'fr', value)}
            multiline
          />
        </div>
      ))}
    </div>
  );
}

type AdminButtonProps = {
  variant?: AdminButtonVariant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export function AdminButton({
  children,
  variant = 'primary',
  href,
  className,
  type = 'button',
  ...props
}: AdminButtonProps) {
  const classes = adminButtonClass(variant, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export function AdminAlert({ message, type = 'error' }: { message: string; type?: 'error' | 'success' }) {
  return (
    <div
      className={`border px-4 py-3 text-sm ${
        type === 'error'
          ? 'border-red-500/40 text-red-300 bg-red-500/5'
          : 'border-gold/40 text-gold bg-gold/5'
      }`}
    >
      {message}
    </div>
  );
}

export function useAdminMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const run = async (url: string, options: RequestInit, successMessage?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers ?? {}),
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Request failed');
      }

      if (successMessage) setSuccess(successMessage);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, run, setError, setSuccess };
}

export { inputClass, labelClass };
