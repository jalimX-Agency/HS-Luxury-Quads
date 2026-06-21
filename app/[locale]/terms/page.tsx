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
      ? 'Terms of Service | HS Luxury Quads'
      : 'Conditions d\'Utilisation | HS Luxury Quads',
    description: locale === 'en'
      ? 'Terms and conditions for booking and participating in HS Luxury Quads Morocco experiences.'
      : 'Conditions générales pour la réservation et la participation aux expériences HS Luxury Quads Morocco.',
  };
}

export default function TermsPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') notFound();

  const t = {
    title: locale === 'en' ? 'Terms of Service' : 'Conditions d\'Utilisation',
    updated: locale === 'en' ? 'Last updated: June 2025' : 'Dernière mise à jour : Juin 2025',
    intro: locale === 'en'
      ? 'These Terms of Service govern your use of the HS Luxury Quads Morocco website and the booking of our private quad biking experiences in the Agafay Desert. By accessing our site or making a booking, you agree to these terms.'
      : 'Les présentes conditions d\'utilisation régissent votre utilisation du site web de HS Luxury Quads Morocco et la réservation de nos expériences privées de quad dans le désert d\'Agafay. En accédant à notre site ou en effectuant une réservation, vous acceptez ces conditions.',
    sections: [
      {
        heading: locale === 'en' ? '1. Booking & Reservations' : '1. Réservation',
        content: locale === 'en'
          ? 'All bookings are subject to availability and confirmation. A booking is considered confirmed only after we have verified your preferred date, group size, and experience type, and sent you a confirmation via WhatsApp or email. We recommend booking at least 48 hours in advance, especially during peak travel seasons.'
          : 'Toutes les réservations sont soumises à disponibilité et confirmation. Une réservation est considérée comme confirmée uniquement après que nous avons vérifié votre date préférée, la taille du groupe et le type d\'expérience, et vous avons envoyé une confirmation via WhatsApp ou e-mail. Nous recommandons de réserver au moins 48 heures à l\'avance, en particulier pendant les hautes saisons touristiques.',
      },
      {
        heading: locale === 'en' ? '2. Pricing & Payment' : '2. Tarifs et paiement',
        content: locale === 'en'
          ? 'Prices are displayed in Moroccan Dirhams (Dh) per person unless otherwise stated. Final pricing may vary based on group size, custom requests, and seasonal adjustments. Payment terms will be communicated during the confirmation process. We accept cash on arrival, bank transfer, and secure online payment methods where applicable.'
          : 'Les prix sont affichés en dirhams marocains (Dh) par personne sauf indication contraire. Le prix final peut varier en fonction de la taille du groupe, des demandes personnalisées et des ajustements saisonniers. Les conditions de paiement vous seront communiquées lors du processus de confirmation. Nous acceptons les espèces à l\'arrivée, le virement bancaire et les méthodes de paiement en ligne sécurisées lorsque applicable.',
      },
      {
        heading: locale === 'en' ? '3. Cancellations & Refunds' : '3. Annulations et remboursements',
        content: locale === 'en'
          ? 'Cancellations made more than 24 hours before the scheduled experience receive a full refund. Cancellations within 24 hours may be subject to a cancellation fee. No-shows without prior notice are non-refundable. In the rare event that we must cancel due to weather or safety conditions, you will receive a full refund or the option to reschedule.'
          : 'Les annulations effectuées plus de 24 heures avant l\'expérience programmée donnent droit à un remboursement complet. Les annulations dans les 24 heures peuvent être soumises à des frais d\'annulation. Les absences sans préavis ne sont pas remboursables. Dans le rare cas où nous devrions annuler en raison des conditions météorologiques ou de sécurité, vous recevrez un remboursement complet ou la possibilité de reprogrammer.',
      },
      {
        heading: locale === 'en' ? '4. Participant Requirements' : '4. Conditions des participants',
        content: locale === 'en'
          ? 'Participants must be at least 16 years old to drive a quad bike. Passengers aged 10 and above may ride as passengers with parental consent. All participants must follow the safety briefing and guide instructions. We reserve the right to refuse participation to anyone under the influence of alcohol or drugs, or who poses a safety risk to themselves or others.'
          : 'Les participants doivent avoir au moins 16 ans pour conduire un quad. Les passagers âgés de 10 ans et plus peuvent monter comme passagers avec le consentement parental. Tous les participants doivent suivre le briefing de sécurité et les instructions du guide. Nous nous réservons le droit de refuser la participation à toute personne sous l\'emprise d\'alcool ou de drogues, ou qui présente un risque de sécurité pour elle-même ou pour autrui.',
      },
      {
        heading: locale === 'en' ? '5. Safety & Liability' : '5. Sécurité et responsabilité',
        content: locale === 'en'
          ? 'Quad biking involves inherent risks. HS Luxury Quads Morocco provides safety equipment including helmets and goggles, and conducts thorough pre-ride briefings. Participants ride at their own risk. We are not liable for personal injury, loss, or damage to personal property except where caused by our proven negligence. Travel insurance is strongly recommended.'
          : 'Le quad comporte des risques inhérents. HS Luxury Quads Morocco fournit un équipement de sécurité incluant casques et lunettes, et effectue des briefings approfondis avant le départ. Les participants roulent à leurs propres risques. Nous ne sommes pas responsables des blessures personnelles, des pertes ou des dommages aux biens personnels, sauf en cas de négligence avérée de notre part. Une assurance voyage est fortement recommandée.',
      },
      {
        heading: locale === 'en' ? '6. Private Transfers' : '6. Transferts privés',
        content: locale === 'en'
          ? 'Private round-trip transfers from Marrakech are included in all our experiences. Pickup times are coordinated via WhatsApp. Delays caused by traffic, road conditions, or guest readiness are managed flexibly. We are not responsible for missed flights or other travel connections due to transfer delays.'
          : 'Les transferts privés aller-retour depuis Marrakech sont inclus dans toutes nos expériences. Les horaires de prise en charge sont coordonnés via WhatsApp. Les retards causés par la circulation, les conditions routières ou la préparation des invités sont gérés avec flexibilité. Nous ne sommes pas responsables des vols manqués ou d\'autres correspondances de voyage en raison de retards de transfert.',
      },
      {
        heading: locale === 'en' ? '7. Intellectual Property' : '7. Propriété intellectuelle',
        content: locale === 'en'
          ? 'All content on this website — including text, images, logos, and design — is the property of HS Luxury Quads Morocco and protected by copyright laws. You may not reproduce, distribute, or use our content for commercial purposes without written permission.'
          : 'Tout le contenu de ce site — y compris les textes, images, logos et design — est la propriété de HS Luxury Quads Morocco et protégé par les lois sur le droit d\'auteur. Vous ne pouvez pas reproduire, distribuer ou utiliser notre contenu à des fins commerciales sans autorisation écrite.',
      },
      {
        heading: locale === 'en' ? '8. Changes to Terms' : '8. Modifications des conditions',
        content: locale === 'en'
          ? 'We may update these Terms of Service from time to time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the revised terms.'
          : 'Nous pouvons mettre à jour ces conditions d\'utilisation de temps à autre. Les modifications seront publiées sur cette page avec une date de mise à jour. L\'utilisation continue de nos services après les modifications constitue l\'acceptation des conditions révisées.',
      },
      {
        heading: locale === 'en' ? '9. Contact' : '9. Contact',
        content: locale === 'en'
          ? 'For questions about these Terms of Service, please contact us through our Contact page or message us on WhatsApp.'
          : 'Pour toute question concernant ces conditions d\'utilisation, veuillez nous contacter via notre page Contact ou nous envoyer un message sur WhatsApp.',
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
