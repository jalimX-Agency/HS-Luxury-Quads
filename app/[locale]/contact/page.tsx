import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Mail, MapPin, Clock, Globe } from 'lucide-react';
import type { Locale } from '@/content/tours';
import { contactContent } from '@/content/ui';
import { seoConfig } from '@/content/seo';
import { getTours } from '@/lib/api-client';
import { toTour } from '@/lib/tours';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';
import FaqAccordion from '@/components/contact/FaqAccordion';

interface PageProps {
  params: {
    locale: string;
  };
}

const WHATSAPP_NUMBER = '212634857515';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};
  const seo = seoConfig.contact;
  return {
    title: seo.title[locale],
    description: seo.description[locale],
    keywords: seo.keywords.map((k) => k[locale]),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';

  if (locale !== 'en' && locale !== 'fr') {
    notFound();
  }

  const apiTours = await getTours();
  const tours = apiTours.map(toTour);
  const content = contactContent;

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/luxury_quads_morrocco';
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL ?? 'https://www.tiktok.com/@hsquadsluxurymorocco';
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/share/1BeADmBxvj/';

  return (
    <>
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">

          {/* Page heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="section-label justify-center mb-4">
              {locale === 'en' ? 'Bespoke Booking' : 'Réservation Privée'}
            </p>
            <h1
              className="font-display font-light italic text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] mb-5"
              style={{ color: 'oklch(var(--ink))' }}
            >
              {content.heading[locale]}
            </h1>
            <p className="font-sans font-light text-sm leading-[1.8]" style={{ color: 'oklch(var(--ink-muted))' }}>
              {content.subheading[locale]}
            </p>
          </div>

          {/* ── Quick Contact Cards ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {/* WhatsApp */}
            <div
              className="p-6 border flex flex-col gap-4"
              style={{ borderColor: 'oklch(var(--rule) / 0.3)', background: 'oklch(var(--bg-subtle))' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366]/10">
                <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p
                  className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase mb-1"
                  style={{ color: 'oklch(var(--ink-faint))' }}
                >
                  {locale === 'en' ? 'Chat with us' : 'Chattez avec nous'}
                </p>
                <p className="font-sans text-sm font-medium" style={{ color: 'oklch(var(--ink))' }}>
                  +212 634 857 515
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#25D366] text-white font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-2.5 transition-opacity hover:opacity-90"
              >
                {locale === 'en' ? 'Open WhatsApp' : 'Ouvrir WhatsApp'}
              </a>
            </div>

            {/* Email */}
            <div
              className="p-6 border flex flex-col gap-4"
              style={{ borderColor: 'oklch(var(--rule) / 0.3)', background: 'oklch(var(--bg-subtle))' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(var(--gold) / 0.1)' }}
              >
                <Mail className="w-5 h-5" style={{ color: 'oklch(var(--gold))' }} />
              </div>
              <div>
                <p
                  className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase mb-1"
                  style={{ color: 'oklch(var(--ink-faint))' }}
                >
                  {locale === 'en' ? 'Send us an email' : 'Envoyez-nous un e-mail'}
                </p>
                <p className="font-sans text-sm font-medium" style={{ color: 'oklch(var(--ink))' }}>
                  info@hsluxuryquads.com
                </p>
              </div>
              <a
                href="mailto:info@hsluxuryquads.com"
                className="inline-flex items-center justify-center border font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-2.5 transition-all hover:opacity-80"
                style={{ borderColor: 'oklch(var(--gold) / 0.4)', color: 'oklch(var(--gold))' }}
              >
                {locale === 'en' ? 'Send Email' : 'Envoyer un e-mail'}
              </a>
            </div>

            {/* Location */}
            <div
              className="p-6 border flex flex-col gap-4"
              style={{ borderColor: 'oklch(var(--rule) / 0.3)', background: 'oklch(var(--bg-subtle))' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(var(--gold) / 0.1)' }}
              >
                <MapPin className="w-5 h-5" style={{ color: 'oklch(var(--gold))' }} />
              </div>
              <div>
                <p
                  className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase mb-1"
                  style={{ color: 'oklch(var(--ink-faint))' }}
                >
                  {locale === 'en' ? 'Meeting point' : 'Point de rendez-vous'}
                </p>
                <p className="font-sans text-sm font-medium" style={{ color: 'oklch(var(--ink))' }}>
                  {locale === 'en'
                    ? 'Agafay Desert, 30km from Marrakech'
                    : "Désert d'Agafay, 30km de Marrakech"}
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=31.5200,-8.1200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-2.5 transition-all hover:opacity-80"
                style={{ borderColor: 'oklch(var(--gold) / 0.4)', color: 'oklch(var(--gold))' }}
              >
                {locale === 'en' ? 'Get Directions' : "Obtenir l'itinéraire"}
              </a>
            </div>
          </section>

          {/* ── Form + Info ── */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
            <div className="lg:col-span-3">
              <BookingForm locale={locale} toursList={tours} />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Business hours */}
              <div
                className="p-6 border"
                style={{ borderColor: 'oklch(var(--rule) / 0.3)', background: 'oklch(var(--bg-subtle))' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" style={{ color: 'oklch(var(--gold))' }} />
                  <p
                    className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'oklch(var(--gold))' }}
                  >
                    {locale === 'en' ? 'Business Hours' : 'Horaires'}
                  </p>
                </div>
                <p className="font-sans text-sm mb-1" style={{ color: 'oklch(var(--ink))' }}>
                  {locale === 'en' ? 'Mon – Sun: 06:00 – 20:00' : 'Lun – Dim : 06h00 – 20h00'}
                </p>
                <p className="font-sans text-xs" style={{ color: 'oklch(var(--ink-faint))' }}>
                  {locale === 'en' ? 'We operate 7 days a week' : 'Nous opérons 7 jours sur 7'}
                </p>
              </div>

              {/* Response time */}
              <div
                className="p-4 flex items-center gap-3"
                style={{
                  background: 'oklch(var(--gold) / 0.06)',
                  border: '1px solid oklch(var(--gold) / 0.2)',
                }}
              >
                <span className="text-lg">⚡</span>
                <p className="font-sans text-xs leading-[1.6]" style={{ color: 'oklch(var(--ink-muted))' }}>
                  {locale === 'en'
                    ? 'Usually replies within 1 hour'
                    : 'Répond généralement sous 1 heure'}
                </p>
              </div>

              {/* Languages */}
              <div
                className="p-6 border"
                style={{ borderColor: 'oklch(var(--rule) / 0.3)', background: 'oklch(var(--bg-subtle))' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4" style={{ color: 'oklch(var(--gold))' }} />
                  <p
                    className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'oklch(var(--gold))' }}
                  >
                    {locale === 'en' ? 'Languages' : 'Langues'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['🇬🇧 English', '🇫🇷 Français', '🇩🇪 Deutsch', '🇲🇦 العربية'].map((lang) => (
                    <span
                      key={lang}
                      className="font-syne text-[10px] px-3 py-1 border"
                      style={{
                        borderColor: 'oklch(var(--rule) / 0.3)',
                        color: 'oklch(var(--ink-muted))',
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div
                className="p-6 border"
                style={{ borderColor: 'oklch(var(--rule) / 0.3)', background: 'oklch(var(--bg-subtle))' }}
              >
                <p
                  className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase mb-4"
                  style={{ color: 'oklch(var(--gold))' }}
                >
                  {locale === 'en' ? 'Follow Us' : 'Suivez-nous'}
                </p>
                <div className="flex gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[#E1306C] hover:text-[#E1306C]"
                    style={{ borderColor: 'oklch(var(--rule) / 0.4)', color: 'oklch(var(--ink-faint))' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-white hover:text-white"
                    style={{ borderColor: 'oklch(var(--rule) / 0.4)', color: 'oklch(var(--ink-faint))' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.25 8.25 0 004.82 1.56V6.86a4.85 4.85 0 01-1.05-.17z" />
                    </svg>
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 flex items-center justify-center border transition-colors hover:border-[#1877F2] hover:text-[#1877F2]"
                    style={{ borderColor: 'oklch(var(--rule) / 0.4)', color: 'oklch(var(--ink-faint))' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── Google Maps ── */}
          <section className="mb-20">
            <iframe
              src="https://maps.google.com/maps?q=31.5200,-8.1200&z=13&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Agafay Desert Meeting Point"
            />
            <p className="mt-4 font-sans text-xs text-center" style={{ color: 'oklch(var(--ink-faint))' }}>
              📍{' '}
              {locale === 'en'
                ? 'Agafay Desert Meeting Point — We also offer hotel pickup from Marrakech city center (+30 min transfer)'
                : "Point de rendez-vous — Désert d'Agafay — Nous proposons également le transfert depuis le centre-ville de Marrakech (+30 min)"}
            </p>
          </section>

          {/* ── FAQ ── */}
          <section className="max-w-2xl mx-auto mb-8">
            <p className="section-label justify-center mb-8">
              {locale === 'en' ? 'Frequently Asked' : 'Questions Fréquentes'}
            </p>
            <FaqAccordion locale={locale} />
          </section>

        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
