'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/content/tours';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const brandName = 'HS LUXURY QUADS';
  const whatsappNumber = '+212600000000'; // Replace with real number later

  const footerLinks = [
    { href: `/${locale}/privacy`, label: locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité' },
    { href: `/${locale}/terms`, label: locale === 'en' ? 'Terms of Service' : 'Conditions d\'Utilisation' },
    { href: `/${locale}/sustainability`, label: locale === 'en' ? 'Sustainability' : 'Durabilité' },
    { href: `/${locale}/contact`, label: locale === 'en' ? 'Support' : 'Support' },
  ];

  return (
    <footer className="bg-bg-sunken border-t border-rule/15 w-full pt-20 pb-28 md:pb-20 relative z-10">
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-rule/20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="HS Luxury Quads"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-display italic font-semibold text-lg text-gold">
                HS<span className="font-sans not-italic font-light text-ink ml-1.5 text-xs tracking-[0.05em] uppercase">Luxury Quads</span>
              </span>
            </div>
            <p className="font-sans font-light text-sm text-ink-muted leading-[1.75] max-w-sm">
              {locale === 'en'
                ? 'Private desert quad biking experiences in the Agafay stone plains — from Marrakech, with precision and Moroccan hospitality.'
                : 'Expériences privées de quad dans les plaines de pierre d\'Agafay — depuis Marrakech, alliant précision et hospitalité marocaine.'}
            </p>
          </div>

          <div>
            <p className="font-syne text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-faint mb-6">
              {locale === 'en' ? 'Experiences' : 'Expériences'}
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href={`/${locale}/tours`} className="font-sans font-light text-sm text-ink-muted hover:text-gold transition-colors">
                  Agafay Discovery — 2h
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tours`} className="font-sans font-light text-sm text-ink-muted hover:text-gold transition-colors">
                  Sunset Dinner Ride
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tours`} className="font-sans font-light text-sm text-ink-muted hover:text-gold transition-colors">
                  Private Luxury Tour
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-syne text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-faint mb-6">
              {locale === 'en' ? 'Reserve Your Tour' : 'Réservation'}
            </p>
            <p className="font-sans font-light text-sm text-ink-muted leading-[1.7] mb-4">
              {locale === 'en'
                ? 'Available daily, subject to confirmation. We respond within 12 hours.'
                : 'Disponible tous les jours, sous réserve de confirmation. Réponse sous 12 heures.'}
            </p>
            <a
              className="inline-flex items-center gap-2.5 bg-gold text-background font-syne font-semibold text-[10px] tracking-[0.15em] uppercase px-5 py-3.5 transition-all duration-300 hover:bg-gold-light"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {locale === 'en' ? 'Message on WhatsApp' : 'Message WhatsApp'}
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-rule/10">
          <p className="font-syne text-[10px] tracking-widest text-ink-faint uppercase text-center md:text-left">
            &copy; {new Date().getFullYear()} {brandName}. {locale === 'en' ? 'ALL RIGHTS RESERVED.' : 'TOUS DROITS RÉSERVÉS.'}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-syne text-[10px] tracking-wider text-ink-faint hover:text-gold uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
