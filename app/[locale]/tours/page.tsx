import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { tours } from '@/content/tours';
import { seoConfig } from '@/content/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TourCard from '@/components/tours/TourCard';

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};
  const seo = seoConfig.tours;
  return {
    title: seo.title[locale],
    description: seo.description[locale],
    keywords: seo.keywords.map((k) => k[locale]),
  };
}

export default function ToursPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';

  if (locale !== 'en' && locale !== 'fr') {
    notFound();
  }


  return (
    <>
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-container-max mx-auto px-gutter">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
            <span className="text-primary font-accent text-lg italic block mb-3">
              {locale === 'en' ? 'Agafay Desert Expeditions' : 'Expéditions dans le Désert d\'Agafay'}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-6 leading-tight">
              {locale === 'en' ? 'Curated Quad Experiences' : 'Expériences Quad sur Mesure'}
            </h1>
            <p className="text-base text-on-surface-variant leading-[1.7]">
              {locale === 'en'
                ? 'Every tour is designed to combine the rugged thrill of off-road driving with the polished details of luxury hospitality. Private transfers, expert guidance, and custom routing are standard.'
                : 'Chaque parcours est pensé pour associer les sensations du tout-terrain aux exigences d\'un accueil haut de gamme. Transferts privés, accompagnement professionnel et itinéraires adaptés sont inclus.'}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} locale={locale} />
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
