'use client';

import { useState } from 'react';
import type { Locale, Tour } from '@/content/tours';
import { contactContent } from '@/content/ui';
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';

interface BookingFormProps {
  locale: Locale;
  toursList: Tour[];
  defaultTourSlug?: string;
}

export default function BookingForm({ locale, toursList, defaultTourSlug }: BookingFormProps) {
  const labels = contactContent.formLabels;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourSlug: defaultTourSlug || toursList[0]?.slug || '',
    date: '',
    guests: '2',
    pickup: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [startedTracking, setStartedTracking] = useState(false);

  const handleInteraction = () => {
    if (!startedTracking) {
      setStartedTracking(true);
      const selectedTour = toursList.find((t) => t.slug === formData.tourSlug);
      trackBookingStarted({
        tour_id: formData.tourSlug,
        tour_name: selectedTour?.title[locale] || formData.tourSlug,
        visitors_count: parseInt(formData.guests, 10) || 1,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleInteraction();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      setErrorMessage(contactContent.errors.required[locale]);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          tourSlug: formData.tourSlug,
          date: formData.date,
          guests: parseInt(formData.guests, 10) || 1,
          pickup: formData.pickup,
          message: formData.message,
          locale,
        }),
      });

      const result = await response.json();

      if (response.status === 502) {
        setStatus('success');
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || contactContent.errors.unavailable[locale]);
        setStatus('error');
        return;
      }

      setStatus('success');

      const selectedTour = toursList.find((t) => t.slug === formData.tourSlug);
      const booking = result.data?.booking;
      trackBookingCompleted({
        booking_id: booking?.reference || 'unknown',
        tour_id: formData.tourSlug,
        tour_name: selectedTour?.title[locale] || formData.tourSlug,
        total_amount: booking?.totalAmount ?? (selectedTour?.price.amount || 0) * (parseInt(formData.guests, 10) || 1),
        visitors_count: parseInt(formData.guests, 10) || 1,
        customer_email: formData.email,
      });
    } catch {
      setErrorMessage(contactContent.errors.unavailable[locale]);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-bg-subtle p-8 border border-gold/40 text-center max-w-xl mx-auto my-8 animate-fadeIn">
        <span className="font-display italic text-2xl text-gold block mb-4">01</span>
        <h3 className="font-display font-semibold text-2xl text-ink mb-4">
          {contactContent.success.title[locale]}
        </h3>
        <p className="font-sans font-light text-sm text-ink-muted leading-[1.7]">
          {contactContent.success.message[locale]}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-subtle p-8 md:p-12 border border-rule/30 max-w-2xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {labels.name[locale]} *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {labels.email[locale]} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div className="flex flex-col">
          <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {labels.phone[locale]} *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 234 567 890"
            className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors"
          />
        </div>

        {/* Preferred Experience */}
        <div className="flex flex-col">
          <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {labels.tour[locale]} *
          </label>
          <select
            name="tourSlug"
            value={formData.tourSlug}
            onChange={handleChange}
            className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors cursor-pointer"
          >
            {toursList.map((t) => (
              <option key={t.slug} value={t.slug} className="bg-bg-subtle text-ink">
                {t.title[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferred Date */}
        <div className="flex flex-col">
          <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {labels.date[locale]} *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors cursor-pointer"
          />
        </div>

        {/* Number of guests */}
        <div className="flex flex-col">
          <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {labels.guests[locale]} *
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max="20"
            required
            className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors"
          />
        </div>
      </div>

      {/* Pickup address */}
      <div className="flex flex-col">
        <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
          {labels.pickup[locale]}
        </label>
        <input
          type="text"
          name="pickup"
          value={formData.pickup}
          onChange={handleChange}
          placeholder="Hotel name or address in Marrakech"
          className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors"
        />
      </div>

      {/* Occasion / special requests */}
      <div className="flex flex-col">
        <label className="font-syne text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
          {labels.message[locale]}
        </label>
        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Dietary requirements, birthday celebration, proposal arrangements..."
          className="bg-background border border-rule/30 focus:border-gold px-4 py-3 text-sm text-ink outline-none transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage || contactContent.errors.required[locale]}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-gold text-background font-syne font-semibold text-[11px] tracking-[0.18em] uppercase py-4.5 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gold-light disabled:opacity-55"
      >
        {status === 'loading' ? (
          <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
        ) : (
          labels.submit[locale]
        )}
      </button>
    </form>
  );
}
