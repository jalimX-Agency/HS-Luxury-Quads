export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { homepageContent, aboutContent } from '@/content/ui';
import { seoConfig } from '@/content/seo';
import { getReviews, getTours } from '@/lib/api-client';
import { toTour } from '@/lib/tours';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FadeIn } from '@/components/ui/FadeIn';

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};
  const seo = seoConfig.home;
  return {
    title: seo.title[locale],
    description: seo.description[locale],
    keywords: seo.keywords.map((k) => k[locale]),
  };
}


export default async function HomePage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') notFound();

  const [apiTours, apiReviews, mediaRows, galleryItems] = await Promise.all([
    getTours(),
    getReviews(),
    prisma.siteSettings.findMany({
      where: { key: { in: ['hero_image_url', 'hero_video_url'] } },
    }),
    prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      take: 5,
    }),
  ]);
  const tours = apiTours.map(toTour);

  const media = Object.fromEntries(mediaRows.map((r) => [r.key, r.value]));
  const heroImageUrl: string | null = media.hero_image_url ?? null;
  const heroVideoUrl: string | null = media.hero_video_url ?? null;

  const content = homepageContent;
  const t = {
    heroTagline: locale === 'en' ? 'Agafay Desert · Marrakech' : 'Désert d\'Agafay · Marrakech',
    heroTitle1: locale === 'en' ? 'The Desert,' : 'Le Désert,',
    heroTitle2: locale === 'en' ? 'Uncompromised.' : 'Sans Compromis.',
    heroSub: content.heroSubheadline[locale],
    primaryCta: content.primaryCta[locale],
    secondaryCta: content.secondaryCta[locale],
    statsLabel1: locale === 'en' ? 'Guests Hosted' : 'Invités',
    statsLabel2: locale === 'en' ? 'Private Only' : 'Privé Seulement',
    statsLabel3: locale === 'en' ? 'TripAdvisor' : 'TripAdvisor',
    statsLabel4: locale === 'en' ? 'Premium Quads' : 'Quads Premium',
    signaturesLabel: locale === 'en' ? 'Signature Experiences' : 'Expériences Signatures',
    signaturesTitle: locale === 'en'
      ? 'Three itineraries. Each designed to be complete on its own.'
      : 'Trois itinéraires. Chacun pensé pour être une immersion complète.',
    fromLabel: locale === 'en' ? 'From' : 'À partir de',
    perGuest: locale === 'en' ? '/ guest' : '/ pers.',
    viewDetails: locale === 'en' ? 'View Experience →' : 'Voir l\'Expérience →',
    philosophyLabel: locale === 'en' ? 'Our Philosophy' : 'Notre Philosophie',
    quoteText: locale === 'en'
      ? '"We know Agafay as a living landscape — mineral, open, quiet, and dramatic in the late light."'
      : '"Nous voyons Agafay comme un paysage vivant — minéral, ouvert, silencieux et spectaculaire dans la lumière du soir."',
    galleryLabel: locale === 'en' ? 'The Desert in Frame' : 'Le Désert en Images',
    ctaLabel: locale === 'en' ? 'Plan Your Private Experience' : 'Planifiez Votre Expérience',
    ctaTitle: locale === 'en' ? 'The desert is ready.' : 'Le désert vous attend.',
    ctaAccent: locale === 'en' ? 'Are you?' : 'Et vous ?',
    ctaSub: locale === 'en'
      ? 'Tell us your date, group size, and preference. We confirm availability, arrange private transfer, and handle every detail.'
      : 'Indiquez votre date, taille du groupe et préférence. Nous confirmons la disponibilité, organisons le transfert privé et gérons chaque détail.',
    enquiry: locale === 'en' ? 'Send an Enquiry' : 'Envoyer une Demande',
    whatsapp: 'WhatsApp',
    reviewsLabel: locale === 'en' ? 'Guest Voices' : 'Témoignages',
  };

  const reviews = apiReviews.slice(0, 3).map((review) => ({
    text: `"${review.text[locale]}"`,
    author: review.name,
    origin: review.country,
    tour: review.tourTitle?.[locale] ?? '',
  }));

  const fallbackReviews = [
    {
      text: locale === 'en'
        ? '"Absolutely the most breathtaking experience of our entire trip to Morocco. The private guide was exceptional."'
        : '"Absolument l\'expérience la plus époustouflante de tout notre voyage au Maroc. Le guide privé était exceptionnel."',
      author: 'Sarah & James M.',
      origin: locale === 'en' ? 'London, UK' : 'Londres, Royaume-Uni',
      tour: locale === 'en' ? 'Sunset Dinner Ride' : 'Balade Coucher de Soleil',
    },
    {
      text: locale === 'en'
        ? '"Worth every euro. The desert at sunset with a private chef dinner afterward — unforgettable. Book this."'
        : '"Vaut chaque euro. Le désert au coucher du soleil avec un dîner privé — inoubliable. Réservez ça."',
      author: 'Antoine D.',
      origin: locale === 'en' ? 'Paris, France' : 'Paris, France',
      tour: locale === 'en' ? 'Private Luxury Tour' : 'Tour Privé de Luxe',
    },
    {
      text: locale === 'en'
        ? '"Perfect organization from start to finish. The hotel pickup was on time, the quads were top-quality, and the landscape was unlike anything."'
        : '"Organisation parfaite du début à la fin. Le transfert hôtel était ponctuel, les quads de haute qualité, et le paysage incomparable."',
      author: 'Claudia R.',
      origin: locale === 'en' ? 'Milan, Italy' : 'Milan, Italie',
      tour: locale === 'en' ? '2-Hour Desert Ride' : 'Balade Désert 2 Heures',
    },
  ];

  const displayedReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <>
      <Navbar locale={locale} />

      {/* ═══════════════════════════════════════════════════════
          HERO — Full-bleed editorial with massive display type
      ═══════════════════════════════════════════════════════ */}
      <header className="relative w-full h-[100svh] min-h-[720px] flex items-end overflow-hidden">
        {/* Full-bleed background video — autoplay, muted, loop for cinematic effect */}
        <div className="absolute inset-0 z-0">
          {heroVideoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={heroImageUrl ?? undefined}
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt="Agafay Desert"
              fill
              priority
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'oklch(8% 0.01 75)' }} />
          )}
          {/* Cinematic gradient — bottom-heavy for readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, oklch(8% 0.01 75 / 0.15) 0%, oklch(8% 0.01 75 / 0.30) 35%, oklch(8% 0.01 75 / 0.70) 65%, oklch(8% 0.01 75 / 0.97) 100%)',
            }}
          />
          {/* Subtle left vignette for text contrast */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, oklch(8% 0.01 75 / 0.55) 0%, transparent 55%)',
            }}
          />
        </div>

        {/* Hero content — bottom left, editorial */}
        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pb-20 md:pb-28 max-w-[1440px] mx-auto">
          {/* Location tag */}
          <p className="section-label text-[oklch(74%_0.130_72)] mb-6 animate-fadeUp delay-200">
            {t.heroTagline}
          </p>

          {/* Main headline — cinematic scale */}
          <h1 className="font-display font-light leading-[0.92] tracking-tight text-white mb-8 animate-fadeUp delay-300">
            <span className="block text-[clamp(3.5rem,9vw,8rem)] italic">
              {t.heroTitle1}
            </span>
            <span
              className="block text-[clamp(3.5rem,9vw,8rem)] font-semibold not-italic"
              style={{ color: 'oklch(74% 0.130 72)' }}
            >
              {t.heroTitle2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans font-light text-white/75 text-sm md:text-base max-w-sm leading-[1.8] mb-10 animate-fadeUp delay-400">
            {t.heroSub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fadeUp delay-500">
            <Link href={`/${locale}/contact`} className="btn-gold inline-block text-center">
              <span>{t.primaryCta}</span>
            </Link>
            <Link href={`/${locale}/tours`} className="btn-outline inline-block text-center">
              {t.secondaryCta}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 z-10 hidden md:flex flex-col items-center gap-3">
          <span
            className="writing-vertical font-syne text-[9px] font-medium tracking-[0.25em] uppercase animate-pulse-gold"
            style={{ color: 'oklch(74% 0.130 72)' }}
          >
            SCROLL
          </span>
          <span
            className="w-[1px] h-16 block"
            style={{ background: 'linear-gradient(to bottom, oklch(74% 0.130 72), transparent)' }}
          />
        </div>

        {/* Bottom marquee bar */}
        <div className="absolute bottom-0 left-0 w-full z-10 overflow-hidden border-t border-white/10">
          <div className="marquee-track py-3">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 px-12 font-syne text-[9px] tracking-[0.2em] uppercase text-white/35 whitespace-nowrap">
                <span style={{ color: 'oklch(74% 0.130 72)' }}>✦</span>
                {locale === 'en' ? 'Private Desert Experiences' : 'Expériences Privées dans le Désert'}
                <span style={{ color: 'oklch(74% 0.130 72)' }}>✦</span>
                {locale === 'en' ? 'Agafay · Marrakech' : 'Agafay · Marrakech'}
                <span style={{ color: 'oklch(74% 0.130 72)' }}>✦</span>
                {locale === 'en' ? 'Since 2018' : 'Depuis 2018'}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          STATS STRIP — Understated numbers
      ═══════════════════════════════════════════════════════ */}
      <section className="border-b" style={{ borderColor: 'oklch(var(--rule) / 0.2)' }}>
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {[
              { stat: '5,000+', label: t.statsLabel1 },
              { stat: '100%', label: t.statsLabel2 },
              { stat: '4.9★', label: t.statsLabel3 },
              { stat: '50+', label: t.statsLabel4 },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="text-center md:text-left px-0 md:px-12 first:pl-0 last:pr-0 relative">
                {i > 0 && (
                  <div
                    className="absolute left-0 top-0 h-full w-[1px] hidden md:block"
                    style={{ background: 'oklch(var(--rule) / 0.2)' }}
                  />
                )}
                <p
                  className="font-display font-light text-4xl md:text-5xl leading-none mb-2"
                  style={{ color: 'oklch(var(--gold))' }}
                >
                  {item.stat}
                </p>
                <p className="font-syne text-[9px] font-medium tracking-[0.22em] uppercase" style={{ color: 'oklch(var(--ink-faint))' }}>
                  {item.label}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TOURS — Editorial list with full-width image hover
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36" id="tours">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
            <div>
              <p className="section-label mb-5">{t.signaturesLabel}</p>
              <h2
                className="font-display font-light italic text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] max-w-2xl"
                style={{ color: 'oklch(var(--ink))' }}
              >
                {t.signaturesTitle}
              </h2>
            </div>
            <Link
              href={`/${locale}/tours`}
              className="link-underline font-syne text-[10px] font-semibold tracking-[0.20em] uppercase self-start md:self-end pb-0.5"
              style={{ color: 'oklch(var(--gold))' }}
            >
              {locale === 'en' ? 'View All Experiences' : 'Voir Toutes les Expériences'}
            </Link>
          </div>

          {/* Tour list — editorial stacked layout */}
          <div className="flex flex-col">
            {tours.map((tour, index) => (
              <FadeIn key={tour.slug} delay={index * 0.12}>
              <div
                className="tour-list-item group relative"
              >
                <Link href={`/${locale}/tours/${tour.slug}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 py-10 md:py-14 items-start">
                    {/* Number */}
                    <div className="lg:col-span-1 hidden lg:flex items-start pt-1">
                      <span
                        className="tour-list-number font-display italic font-light text-5xl leading-none"
                        style={{ color: 'oklch(var(--ink-faint))' }}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    {/* Image — hidden by default, slides in on hover */}
                    <div className="lg:col-span-3 relative h-52 lg:h-44 overflow-hidden mb-6 lg:mb-0">
                      {tour.images?.[0] ? (
                        <Image
                          alt={tour.title[locale]}
                          src={tour.images[0]}
                          fill
                          className="object-cover tour-card__image filter saturate-[0.85]"
                          sizes="(max-width: 1024px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0" style={{ background: 'oklch(12% 0.03 72)' }} />
                      )}
                      {/* Duration badge */}
                      <div
                        className="absolute top-3 left-3 font-syne text-[8px] font-bold tracking-widest uppercase px-2.5 py-1"
                        style={{
                          background: 'oklch(8% 0.01 75 / 0.85)',
                          color: 'oklch(74% 0.130 72)',
                          border: '1px solid oklch(74% 0.130 72 / 0.4)',
                        }}
                      >
                        {tour.duration[locale].split(',')[0]}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-6 lg:px-10">
                      <h3
                        className="font-display font-semibold text-2xl md:text-3xl mb-3 leading-tight"
                        style={{ color: 'oklch(var(--ink))' }}
                      >
                        {tour.title[locale]}
                      </h3>
                      <p
                        className="font-sans font-light text-sm leading-[1.8] mb-6 max-w-prose"
                        style={{ color: 'oklch(var(--ink-muted))' }}
                      >
                        {tour.shortDescription[locale]}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {tour.includes.slice(0, 3).map((inc, i) => (
                          <span key={i} className="flex items-center gap-2 font-syne text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'oklch(var(--ink-faint))' }}>
                            <span style={{ color: 'oklch(var(--gold))' }}>—</span>
                            {inc[locale]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-between pt-4 lg:pt-0 gap-4">
                      <div>
                        <p
                          className="font-syne text-[8px] font-medium tracking-widest uppercase mb-1"
                          style={{ color: 'oklch(var(--ink-faint))' }}
                        >
                          {t.fromLabel}
                        </p>
                        <p
                          className="font-display italic font-light text-3xl leading-none"
                          style={{ color: 'oklch(var(--gold))' }}
                        >
                          {tour.price.amount} Dh
                          <span
                            className="font-sans not-italic text-xs ml-1"
                            style={{ color: 'oklch(var(--ink-faint))' }}
                          >
                            {t.perGuest}
                          </span>
                        </p>
                      </div>
                      <span
                        className="tour-list-cta font-syne text-[9px] font-semibold tracking-[0.18em] uppercase"
                        style={{ color: 'oklch(var(--gold))' }}
                      >
                        {t.viewDetails}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PHILOSOPHY — Quote + values, side-by-side
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 md:py-36 border-t"
        style={{ borderColor: 'oklch(var(--rule) / 0.15)', background: 'oklch(var(--background-sunken))' }}
        id="about"
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Left: sticky quote */}
            <FadeIn direction="left" className="lg:col-span-4 lg:sticky lg:top-32">
              <p className="section-label mb-8">{t.philosophyLabel}</p>
              <blockquote
                className="font-display italic font-light text-2xl lg:text-[1.6rem] leading-[1.4]"
                style={{
                  color: 'oklch(var(--ink))',
                  borderLeft: '2px solid oklch(var(--gold))',
                  paddingLeft: '1.5rem',
                }}
              >
                {t.quoteText}
              </blockquote>
            </FadeIn>

            {/* Right: story + values */}
            <FadeIn direction="right" className="lg:col-span-8">
              <p
                className="font-sans font-light text-base leading-[1.9] mb-16"
                style={{ color: 'oklch(var(--ink-muted))' }}
              >
                {aboutContent.story[locale]}
              </p>

              <div className="flex flex-col">
                {aboutContent.values.map((val, idx) => (
                  <div
                    key={idx}
                    className="group py-8 border-t grid grid-cols-12 gap-6 items-start hover:bg-white/[0.015] transition-colors duration-300 -mx-4 px-4"
                    style={{ borderColor: 'oklch(var(--rule) / 0.2)' }}
                  >
                    <div className="col-span-1">
                      <span
                        className="font-display italic font-light text-lg"
                        style={{ color: 'oklch(var(--gold) / 0.5)' }}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <div className="col-span-11">
                      <h4
                        className="font-syne text-[10px] font-semibold tracking-[0.2em] uppercase mb-2.5 group-hover:text-[oklch(var(--gold))] transition-colors duration-300"
                        style={{ color: 'oklch(var(--gold))' }}
                      >
                        {val.title[locale]}
                      </h4>
                      <p
                        className="font-sans font-light text-sm leading-[1.75]"
                        style={{ color: 'oklch(var(--ink-muted))' }}
                      >
                        {val.text[locale]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GALLERY — Asymmetric 5-image grid, edge-to-edge
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" id="gallery">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 mb-10">
          <p className="section-label">{t.galleryLabel}</p>
        </div>
        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-12 grid-rows-2 gap-1" style={{ height: 'clamp(400px, 55vw, 700px)' }}>
            <div className="col-span-5 row-span-2 gallery-item relative">
              <Image
                alt={(galleryItems[0]?.alt as { en: string })?.en ?? ''}
                src={galleryItems[0]!.url}
                fill
                className="object-cover filter saturate-[0.8]"
                sizes="42vw"
              />
            </div>
            {galleryItems[1] && (
              <div className="col-span-4 row-span-1 gallery-item relative">
                <Image alt={(galleryItems[1].alt as { en: string })?.en ?? ''} src={galleryItems[1].url} fill className="object-cover filter saturate-[0.8]" sizes="33vw" />
              </div>
            )}
            {galleryItems[2] && (
              <div className="col-span-3 row-span-1 gallery-item relative">
                <Image alt={(galleryItems[2].alt as { en: string })?.en ?? ''} src={galleryItems[2].url} fill className="object-cover filter saturate-[0.8]" sizes="25vw" />
              </div>
            )}
            {galleryItems[3] && (
              <div className="col-span-4 row-span-1 gallery-item relative">
                <Image alt={(galleryItems[3].alt as { en: string })?.en ?? ''} src={galleryItems[3].url} fill className="object-cover filter saturate-[0.8]" sizes="33vw" />
              </div>
            )}
            {galleryItems[4] && (
              <div className="col-span-3 row-span-1 gallery-item relative">
                <Image alt={(galleryItems[4].alt as { en: string })?.en ?? ''} src={galleryItems[4].url} fill className="object-cover filter saturate-[0.8]" sizes="25vw" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border border-dashed border-rule/30">
            <p className="text-xs text-ink-faint">Gallery images will appear here once uploaded.</p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          GUEST REVIEWS — Minimal editorial quotes
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 border-t"
        style={{ borderColor: 'oklch(var(--rule) / 0.15)' }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <p className="section-label mb-16">{t.reviewsLabel}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {displayedReviews.map((review, i) => (
              <FadeIn key={i} delay={i * 0.12} className="review-card">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="oklch(74% 0.130 72)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p
                  className="font-display italic font-light text-lg md:text-xl leading-[1.6] mb-6"
                  style={{ color: 'oklch(var(--ink))' }}
                >
                  {review.text}
                </p>
                <div>
                  <p className="font-syne text-[11px] font-semibold tracking-wider" style={{ color: 'oklch(var(--ink))' }}>
                    {review.author}
                  </p>
                  <p className="font-syne text-[9px] tracking-[0.15em] uppercase mt-1" style={{ color: 'oklch(var(--ink-faint))' }}>
                    {review.origin} · {review.tour}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SOCIAL MEDIA — Follow our adventures
      ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 border-t"
        style={{ borderColor: 'oklch(var(--rule) / 0.15)' }}
        id="social"
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="mb-12">
            <p className="section-label mb-5">
              {locale === 'en' ? 'Follow Our Adventures' : 'Suivez Nos Aventures'}
            </p>
            <h2
              className="font-display font-light italic text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] mb-3"
              style={{ color: 'oklch(var(--ink))' }}
            >
              {locale === 'en' ? 'See The Desert Come Alive' : 'Voyez le Désert Prendre Vie'}
            </h2>
            <p className="font-sans font-light text-sm" style={{ color: 'oklch(var(--ink-muted))' }}>
              {locale === 'en'
                ? 'Join thousands of adventurers sharing their Agafay experience'
                : 'Rejoignez des milliers d\'aventuriers partageant leur expérience à Agafay'}
            </p>
          </div>

          {/* 6 placeholder cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {[
              'from oklch(15% 0.03 75) to oklch(10% 0.02 60)',
              'from oklch(12% 0.04 72) to oklch(18% 0.02 80)',
              'from oklch(16% 0.02 65) to oklch(11% 0.03 70)',
              'from oklch(11% 0.03 68) to oklch(16% 0.02 75)',
              'from oklch(14% 0.04 70) to oklch(10% 0.02 65)',
              'from oklch(13% 0.02 72) to oklch(17% 0.03 68)',
            ].map((gradient, i) => (
              <a
                key={i}
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/luxury_quads_morrocco'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${gradient})` }}
              >
                {/* Desert texture overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at ${20 + i * 15}% ${30 + i * 10}%, oklch(74% 0.130 72 / 0.15) 0%, transparent 60%)`,
                  }}
                />
                {/* Gold geometric accent */}
                <div
                  className="absolute bottom-4 right-4 w-8 h-8 opacity-20"
                  style={{ border: '1px solid oklch(74% 0.130 72)', borderRadius: '2px', transform: 'rotate(45deg)' }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="font-syne text-[9px] font-semibold tracking-[0.15em] uppercase text-white/80">
                    {locale === 'en' ? 'View on Instagram' : 'Voir sur Instagram'}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Social follow buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Instagram */}
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/luxury_quads_morrocco'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-syne font-semibold text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-80"
              style={{
                border: '1px solid transparent',
                borderRadius: '999px',
                background: 'linear-gradient(oklch(var(--background)), oklch(var(--background))) padding-box, linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888) border-box',
                color: 'oklch(var(--ink))',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>

            {/* TikTok */}
            <a
              href={process.env.NEXT_PUBLIC_TIKTOK_URL ?? 'https://www.tiktok.com/@hsquadsluxurymorocco'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-syne font-semibold text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-80"
              style={{
                border: '1px solid oklch(var(--rule) / 0.4)',
                borderRadius: '999px',
                color: 'oklch(var(--ink))',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.25 8.25 0 004.82 1.56V6.86a4.85 4.85 0 01-1.05-.17z" />
              </svg>
              TikTok
            </a>

            {/* Facebook */}
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/share/1BeADmBxvj/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-syne font-semibold text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-80"
              style={{
                border: '1px solid #1877F2',
                borderRadius: '999px',
                color: '#1877F2',
              }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA BANNER — Full-bleed cinematic
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(500px, 60vw, 780px)' }} id="contact">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {heroImageUrl && (
            <Image
              alt="Agafay desert sunset panorama"
              src={heroImageUrl}
              fill
              className="object-cover filter saturate-[0.6]"
              sizes="100vw"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'oklch(8% 0.01 75 / 0.72)' }}
          />
          {/* Decorative cross-hair lines */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 hidden lg:block"
            style={{ background: 'oklch(74% 0.13 72 / 0.08)' }}
          />
          <div
            className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 hidden lg:block"
            style={{ background: 'oklch(74% 0.13 72 / 0.08)' }}
          />
        </div>

        {/* Content */}
        <FadeIn className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 md:px-16">
          <p className="section-label justify-center mb-8 text-white/60">
            {t.ctaLabel}
          </p>
          <h2
            className="font-display font-light italic text-[clamp(2.8rem,7vw,6rem)] leading-[1.0] mb-6 text-white"
          >
            {t.ctaTitle}<br />
            <span style={{ color: 'oklch(74% 0.130 72)' }} className="not-italic font-semibold">
              {t.ctaAccent}
            </span>
          </h2>
          <p
            className="font-sans font-light text-sm leading-[1.8] max-w-md mb-12 text-white/65"
          >
            {t.ctaSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/contact`} className="btn-gold text-center">
              <span>{t.enquiry}</span>
            </Link>
            <a
              href="https://wa.me/212634857515"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center justify-center gap-2.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.whatsapp}
            </a>
          </div>
        </FadeIn>
      </section>

      <Footer locale={locale} />
    </>
  );
}
