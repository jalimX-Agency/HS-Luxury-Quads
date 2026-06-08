import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { aboutContent } from '@/content/ui';
import { seoConfig } from '@/content/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') return {};
  const seo = seoConfig.about;
  return {
    title: seo.title[locale],
    description: seo.description[locale],
    keywords: seo.keywords.map((k) => k[locale]),
  };
}

export default function AboutPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';

  if (locale !== 'en' && locale !== 'fr') {
    notFound();
  }

  const content = aboutContent;

  return (
    <>
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-container-max mx-auto px-gutter space-y-24">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto animate-fadeIn">
            <span className="text-gold font-display italic text-lg block mb-3">
              {locale === 'en' ? 'Our Story' : 'Notre Histoire'}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-ink mb-6 leading-tight">
              {content.heading[locale]}
            </h1>
            <p className="font-sans font-light text-[15px] text-ink-muted leading-[1.8]">
              {content.story[locale]}
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.values.map((val, i) => (
              <div
                key={i}
                className="bg-bg-subtle p-8 border border-rule/30 flex flex-col justify-between hover:border-gold transition-all duration-300"
              >
                <div>
                  <span className="font-display italic text-xl text-gold/60 block mb-6">0{i + 1}</span>
                  <h3 className="font-syne text-[11px] font-semibold tracking-widest text-ink uppercase mb-3">
                    {val.title[locale]}
                  </h3>
                  <p className="font-sans font-light text-xs text-ink-muted leading-[1.75]">
                    {val.text[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Team and Philosophy section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-8">
            <div>
              <span className="text-gold font-display italic text-lg block mb-3">
                {locale === 'en' ? 'Professional Guidance' : 'Accompagnement Pro'}
              </span>
              <h2 className="text-3xl font-display font-semibold text-ink mb-6">
                {locale === 'en' ? 'Experience Desert Luxury' : 'L\'Expérience du Désert de Luxe'}
              </h2>
              <p className="font-sans font-light text-sm text-ink-muted leading-[1.8] mb-6">
                {content.teamIntro[locale]}
              </p>
            </div>
            <div className="relative h-96 border border-rule/30">
              <Image
                alt="Guides in Agafay Desert"
                src="/images/gallery-atlas.png"
                fill
                className="object-cover filter saturate-[0.85]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
