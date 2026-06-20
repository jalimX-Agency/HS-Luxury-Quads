import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Cormorant_Garamond, Syne } from 'next/font/google';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Locale } from '@/content/tours';
import { seoConfig } from '@/content/seo';
import AnalyticsTracker from '@/components/layout/AnalyticsTracker';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HS Luxury Quads',
  description: 'Premium desert quad biking experiences in Marrakech, Morocco.',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (locale !== 'en' && locale !== 'fr') {
    redirect('/en');
  }

  return (
    <html lang={locale} className="scroll-smooth" data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('hs-theme');document.documentElement.setAttribute('data-theme',s||'light');})();`,
          }}
        />
        {seoConfig.home.jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${cormorant.variable} ${syne.variable} bg-background text-ink font-sans antialiased overflow-x-hidden pb-24 md:pb-0`}
      >
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}

