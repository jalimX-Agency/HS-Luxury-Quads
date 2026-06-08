import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/tours';
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
  return {
    title: locale === 'en'
      ? 'Privacy Policy | HS Luxury Quads'
      : 'Politique de Confidentialité | HS Luxury Quads',
    description: locale === 'en'
      ? 'Learn how HS Luxury Quads Morocco collects, uses, and protects your personal information.'
      : 'Découvrez comment HS Luxury Quads Morocco collecte, utilise et protège vos informations personnelles.',
  };
}

export default function PrivacyPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') notFound();

  const t = {
    title: locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité',
    updated: locale === 'en' ? 'Last updated: June 2025' : 'Dernière mise à jour : Juin 2025',
    intro: locale === 'en'
      ? 'HS Luxury Quads Morocco respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our website and services.'
      : 'HS Luxury Quads Morocco respecte votre vie privée et s\'engage à protéger vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site et nos services.',
    sections: [
      {
        heading: locale === 'en' ? '1. Information We Collect' : '1. Informations que nous collectons',
        content: locale === 'en'
          ? 'We collect information you provide directly to us, such as your name, email address, phone number, pickup location, and booking preferences when you fill out our enquiry or booking forms. We also collect technical data including your IP address, browser type, and device information through cookies and analytics tools.'
          : 'Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse e-mail, numéro de téléphone, lieu de prise en charge et préférences de réservation lorsque vous remplissez nos formulaires de demande ou de réservation. Nous collectons également des données techniques, y compris votre adresse IP, le type de navigateur et les informations sur votre appareil via des cookies et des outils d\'analyse.',
      },
      {
        heading: locale === 'en' ? '2. How We Use Your Information' : '2. Comment nous utilisons vos informations',
        content: locale === 'en'
          ? 'Your information is used to process bookings, coordinate private transfers, communicate availability, and provide customer support. We may also use your data to improve our services, send booking confirmations, and respond to enquiries via WhatsApp or email.'
          : 'Vos informations sont utilisées pour traiter les réservations, coordonner les transferts privés, communiquer les disponibilités et fournir une assistance client. Nous pouvons également utiliser vos données pour améliorer nos services, envoyer des confirmations de réservation et répondre aux demandes via WhatsApp ou e-mail.',
      },
      {
        heading: locale === 'en' ? '3. Data Sharing & Third Parties' : '3. Partage de données et tiers',
        content: locale === 'en'
          ? 'We do not sell or rent your personal data. We only share information with trusted partners necessary to deliver your experience — such as drivers, desert camp operators, and payment processors. All partners are bound by confidentiality obligations.'
          : 'Nous ne vendons ni ne louons vos données personnelles. Nous partageons les informations uniquement avec des partenaires de confiance nécessaires pour délivrer votre expérience — tels que les chauffeurs, les opérateurs de camps désertiques et les processeurs de paiement. Tous les partenaires sont liés par des obligations de confidentialité.',
      },
      {
        heading: locale === 'en' ? '4. Cookies & Analytics' : '4. Cookies et analyses',
        content: locale === 'en'
          ? 'Our website uses cookies to enhance your browsing experience and Google Analytics to understand how visitors interact with our site. You can disable cookies through your browser settings. Analytics data is anonymized and used solely for improving our website performance.'
          : 'Notre site utilise des cookies pour améliorer votre expérience de navigation et Google Analytics pour comprendre comment les visiteurs interagissent avec notre site. Vous pouvez désactiver les cookies via les paramètres de votre navigateur. Les données d\'analyse sont anonymisées et utilisées uniquement pour améliorer les performances de notre site.',
      },
      {
        heading: locale === 'en' ? '5. Data Security' : '5. Sécurité des données',
        content: locale === 'en'
          ? 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Booking data is stored securely and retained only as long as necessary for legal and operational purposes.'
          : 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation ou destruction. Les données de réservation sont stockées en toute sécurité et conservées uniquement aussi longtemps que nécessaire à des fins légales et opérationnelles.',
      },
      {
        heading: locale === 'en' ? '6. Your Rights' : '6. Vos droits',
        content: locale === 'en'
          ? 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us via WhatsApp or email. We will respond to all requests within 30 days.'
          : 'Vous avez le droit d\'accéder à vos données personnelles, de les corriger ou de les supprimer. Pour exercer ces droits, contactez-nous via WhatsApp ou e-mail. Nous répondrons à toutes les demandes dans un délai de 30 jours.',
      },
      {
        heading: locale === 'en' ? '7. Contact' : '7. Contact',
        content: locale === 'en'
          ? 'If you have any questions about this Privacy Policy, please reach out to us through our Contact page or message us directly on WhatsApp.'
          : 'Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter via notre page Contact ou nous envoyer un message directement sur WhatsApp.',
      },
    ],
  };

  return (
    <>
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
            <p className="section-label justify-center mb-6">
              {locale === 'en' ? 'Legal' : 'Mentions Légales'}
            </p>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink mb-4 leading-tight">
              {t.title}
            </h1>
            <p className="font-syne text-[10px] tracking-widest uppercase text-ink-faint">
              {t.updated}
            </p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto space-y-12">
            <p className="font-sans font-light text-base text-ink-muted leading-[1.8]">
              {t.intro}
            </p>

            {t.sections.map((section, i) => (
              <section key={i} className="border-t border-rule/20 pt-8">
                <h2 className="font-syne text-[10px] font-semibold tracking-[0.2em] uppercase text-gold mb-4">
                  {section.heading}
                </h2>
                <p className="font-sans font-light text-sm text-ink-muted leading-[1.8]">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
