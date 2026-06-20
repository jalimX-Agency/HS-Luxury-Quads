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

  const jsonLd = tourSeoConfig[params.slug as keyof typeof tourSeoConfig]?.jsonLd ?? [];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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
            <div className="bg-bg-subtle p-6 border border-rule/35 flex flex-col gap-5">
              <div className="text-center">
                <p className="font-syne text-[9px] font-semibold tracking-[0.18em] uppercase text-ink-faint mb-2">
                  {locale === 'en' ? 'Reserve via WhatsApp' : 'Réserver par WhatsApp'}
                </p>
                <p className="font-display italic text-2xl text-gold font-light mb-1">
                  €{tour.price.amount}
                  <span className="font-sans not-italic text-xs text-ink-faint ml-1">
                    {locale === 'en' ? '/ rider' : '/ pers.'}
                  </span>
                </p>
                <p className="font-sans text-xs text-ink-faint">{tour.duration[locale]}</p>
              </div>
              <p className="font-sans text-xs text-ink-muted text-center leading-relaxed">
                {locale === 'en'
                  ? 'Message us to check availability and confirm your booking. We reply within 1 hour.'
                  : 'Écrivez-nous pour vérifier les disponibilités et confirmer votre réservation. Réponse sous 1 heure.'}
              </p>
              <a
                href={`https://wa.me/212634857515?text=${encodeURIComponent(
                  tour.whatsappMsg ??
                    (locale === 'en'
                      ? `Hi, I'd like to book the "${tour.title.en}" experience`
                      : `Bonjour, je souhaite réserver l'expérience "${tour.title.fr}"`)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-syne font-semibold text-[10px] tracking-wider uppercase px-4 py-3.5 transition-opacity hover:opacity-90"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {locale === 'en' ? 'Book on WhatsApp' : 'Réserver sur WhatsApp'}
              </a>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-[#25D366] text-xs">⚡</span>
                <p className="font-sans text-[11px] text-ink-faint">
                  {locale === 'en' ? 'Usually replies within 1 hour' : 'Répond généralement sous 1 heure'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
