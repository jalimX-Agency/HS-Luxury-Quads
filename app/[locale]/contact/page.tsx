import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
import { tours } from '@/content/tours';
import { contactContent } from '@/content/ui';
import { seoConfig } from '@/content/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';

interface PageProps {
  params: {
    locale: string;
  };
}

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

export default function ContactPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';

  if (locale !== 'en' && locale !== 'fr') {
    notFound();
  }

  const content = contactContent;

  return (
    <>
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-container-max mx-auto px-gutter">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
            <span className="text-primary font-accent text-lg italic block mb-3">
              {locale === 'en' ? 'Bespoke Booking' : 'Réservation Privée'}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-6 leading-tight">
              {content.heading[locale]}
            </h1>
            <p className="text-base text-on-surface-variant leading-[1.7]">
              {content.subheading[locale]}
            </p>
          </div>

          {/* Form */}
          <div className="max-w-3xl mx-auto">
            <BookingForm locale={locale} toursList={tours} />
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
