import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { seoConfig } from '@/content/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Gallery from '@/components/ui/Gallery';

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};
  const seo = seoConfig.contact; // Fallback or standard config
  return {
    title: locale === 'en' ? 'Agafay Desert Photo Gallery | HS Luxury Quads' : 'Galerie Photo du Désert d\'Agafay | HS Luxury Quads',
    description: locale === 'en' ? 'Explore visual highlights of premium quad biking expeditions and sunset moments in Marrakech.' : 'Découvrez les clichés exclusifs de nos randonnées en quad et couchers de soleil à Marrakech.',
  };
}

export default function GalleryPage({ params }: PageProps) {
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
              {locale === 'en' ? 'Captured Moments' : 'Instants Capturés'}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-6 leading-tight">
              {locale === 'en' ? 'Expedition Gallery' : 'Galerie d\'Expédition'}
            </h1>
            <p className="text-base text-on-surface-variant leading-[1.7]">
              {locale === 'en'
                ? 'Get a glimpse of the rugged stone tracks, luxury sunset settings, and premium quads in the Agafay Desert.'
                : 'Un aperçu en images des pistes du désert d\'Agafay, des couchers de soleil et de nos quads haut de gamme.'}
            </p>
          </div>

          {/* Gallery Component */}
          <Gallery locale={locale} />
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
