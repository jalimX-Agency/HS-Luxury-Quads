import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { tourSeoConfig } from '@/content/seo';
import { getTourBySlug } from '@/lib/api-client';
import { prisma } from '@/lib/prisma';
import { toTour } from '@/lib/tours';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';
import TourTracker from '@/components/tours/TourTracker';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}


export async function generateStaticParams() {
  const tours = await prisma.tour.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return tours.flatMap((tour) => [
    { locale: 'en', slug: tour.slug },
    { locale: 'fr', slug: tour.slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};

  const seo = tourSeoConfig[params.slug as keyof typeof tourSeoConfig];
  if (seo) {
    return {
      title: seo.title[locale],
      description: seo.description[locale],
    };
  }

  try {
    const { tour } = await getTourBySlug(params.slug);
    return {
      title: `${tour.title[locale]} | HS Luxury Quads`,
      description: tour.shortDescription[locale],
    };
  } catch {
    return {};
  }
}

export default async function TourDetailPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';

  if (locale !== 'en' && locale !== 'fr') {
    notFound();
  }

  let data;
  try {
    data = await getTourBySlug(params.slug);
  } catch {
    notFound();
  }

  const tour = toTour(data.tour);
  const heroImage = data.tour.images?.[0] ?? null;
  const toursList = [tour];

  return (
    <>
      <Navbar locale={locale} />
      <TourTracker tour={tour} locale={locale} />

      <header className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black z-0">
          {heroImage && (
            <Image
              alt={tour.title[locale]}
              src={heroImage}
              fill
              priority
              className="object-cover opacity-50 filter saturate-[0.85]"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-hero-overlay-dark dark:block hidden z-10" />
        <div className="absolute inset-0 bg-hero-overlay-light dark:hidden block z-10" />

        <div className="relative z-20 text-center px-gutter max-w-4xl mx-auto mt-12 animate-fadeIn">
          <span className="bg-background/80 backdrop-blur-md text-ink px-3 py-1 text-[10px] font-syne font-medium tracking-wider uppercase border border-rule/20">
            {tour.duration[locale]}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-white mt-6 mb-4 leading-tight">
            {tour.title[locale]}
          </h1>
          <p className="font-display italic text-2xl text-gold font-light">
            {tour.price.display[locale]}
          </p>
        </div>
      </header>

      <main className="py-20 px-gutter max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h2 className="font-display font-semibold text-2xl text-ink">
              {locale === 'en' ? 'Experience Details' : 'Détails de l\'Expérience'}
            </h2>
            <p className="font-sans font-light text-[15px] text-ink-muted leading-[1.8] whitespace-pre-line">
              {tour.fullDescription[locale]}
            </p>
          </section>

          <section className="space-y-6 bg-bg-subtle p-8 md:p-10 border border-rule/35">
            <h3 className="font-syne text-[10px] font-semibold tracking-widest text-gold uppercase">
              {locale === 'en' ? 'Highlights' : 'Points Forts'}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-[13.5px] font-sans font-light text-ink-muted">
                  <span className="text-gold mt-1 flex-shrink-0">✦</span>
                  <span>{h[locale]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <h3 className="font-syne text-[10px] font-semibold tracking-widest text-gold uppercase">
              {locale === 'en' ? 'What\'s Included' : 'Ce qui est Inclus'}
            </h3>
            <ul className="space-y-3.5">
              {tour.includes.map((inc, i) => (
                <li key={i} className="flex items-center gap-3 text-[13.5px] font-sans font-light text-ink-muted">
                  <span className="w-1.5 h-1.5 bg-gold transform rotate-45 flex-shrink-0" />
                  <span>{inc[locale]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <h3 className="font-syne text-[10px] font-semibold tracking-widest text-gold uppercase">
              {locale === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquentes'}
            </h3>
            <div className="space-y-4">
              {tour.faqs.map((faq, i) => (
                <div key={i} className="border border-rule/35 p-6 bg-bg-subtle/50">
                  <h4 className="font-display font-semibold text-lg text-ink mb-2">{faq.question[locale]}</h4>
                  <p className="font-sans font-light text-xs text-ink-muted leading-[1.7]">{faq.answer[locale]}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-bg-subtle p-6 border border-rule/35">
              <h3 className="font-syne text-[10px] font-semibold tracking-widest text-ink uppercase text-center mb-6">
                {locale === 'en' ? 'Request Availability' : 'Demander la Disponibilité'}
              </h3>
              <BookingForm locale={locale} toursList={toursList} defaultTourSlug={tour.slug} />
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
