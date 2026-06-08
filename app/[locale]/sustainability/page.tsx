import type { Metadata } from 'next';
import Image from 'next/image';
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
      ? 'Sustainability | HS Luxury Quads'
      : 'Durabilité | HS Luxury Quads',
    description: locale === 'en'
      ? 'How HS Luxury Quads Morocco protects the Agafay Desert environment and supports local communities.'
      : 'Comment HS Luxury Quads Morocco protège l\'environnement du désert d\'Agafay et soutient les communautés locales.',
  };
}

export default function SustainabilityPage({ params }: PageProps) {
  const locale = (params.locale as Locale) || 'en';
  if (locale !== 'en' && locale !== 'fr') notFound();

  const t = {
    title: locale === 'en' ? 'Sustainability' : 'Durabilité',
    subtitle: locale === 'en'
      ? 'Protecting the Agafay Desert for future generations'
      : 'Protéger le désert d\'Agafay pour les générations futures',
    intro: locale === 'en'
      ? 'The Agafay Desert is a fragile stone plain — not sand dunes, but a living mineral landscape that deserves respect. At HS Luxury Quads Morocco, we believe luxury and responsibility can coexist. Our sustainability practices are designed to minimize our environmental footprint while maximizing positive impact on local communities.'
      : 'Le désert d\'Agafay est une plaine de pierre fragile — pas des dunes de sable, mais un paysage minéral vivant qui mérite le respect. Chez HS Luxury Quads Morocco, nous croyons que le luxe et la responsabilité peuvent coexister. Nos pratiques de durabilité sont conçues pour minimiser notre empreinte environnementale tout en maximisant l\'impact positif sur les communautés locales.',
    pillars: [
      {
        number: '01',
        heading: locale === 'en' ? 'Low-Impact Routes' : 'Itinéraires à faible impact',
        text: locale === 'en'
          ? 'We follow established tracks and avoid sensitive vegetation zones. Our guides are trained to recognize fragile areas and adjust routes to prevent erosion and habitat disturbance. We never ride off-track in protected or regenerating areas.'
          : 'Nous suivons des pistes établies et évitons les zones de végétation sensibles. Nos guides sont formés pour reconnaître les zones fragiles et ajuster les itinéraires afin de prévenir l\'érosion et la perturbation des habitats. Nous ne roulons jamais hors piste dans des zones protégées ou en régénération.',
      },
      {
        number: '02',
        heading: locale === 'en' ? 'Local Employment' : 'Emploi local',
        text: locale === 'en'
          ? 'Every guide, driver, and hospitality partner we work with is from the Marrakech-Agafay region. We prioritize fair wages, safe working conditions, and long-term partnerships with local families and cooperatives.'
          : 'Chaque guide, chauffeur et partenaire d\'hospitalité avec lequel nous travaillons est originaire de la région Marrakech-Agafay. Nous privilégions des salaires équitables, des conditions de travail sûres et des partenariats à long terme avec des familles et coopératives locales.',
      },
      {
        number: '03',
        heading: locale === 'en' ? 'Waste-Free Hospitality' : 'Hospitalité sans déchet',
        text: locale === 'en'
          ? 'Our desert tea stops and dinner setups use reusable materials. We carry all waste back to Marrakech for proper disposal. Single-use plastics are avoided wherever possible, and we encourage guests to bring reusable water bottles.'
          : 'Nos pauses thé dans le désert et nos installations de dîner utilisent des matériaux réutilisables. Nous ramenons tous les déchets à Marrakech pour une élimination appropriée. Les plastiques à usage unique sont évités dans la mesure du possible, et nous encourageons les invités à apporter des gourdes réutilisables.',
      },
      {
        number: '04',
        heading: locale === 'en' ? 'Equipment Care' : 'Entretien de l\'équipement',
        text: locale === 'en'
          ? 'Our quad bikes are regularly maintained to ensure efficient fuel use and minimal emissions. Well-maintained vehicles are safer, quieter, and cleaner — reducing both noise pollution and air impact in the desert silence.'
          : 'Nos quads sont régulièrement entretenus pour assurer une consommation de carburant efficace et des émissions minimales. Des véhicules bien entretenus sont plus sûrs, plus silencieux et plus propres — réduisant à la fois la pollution sonore et l\'impact atmosphérique dans le silence du désert.',
      },
      {
        number: '05',
        heading: locale === 'en' ? 'Cultural Respect' : 'Respect culturel',
        text: locale === 'en'
          ? 'We respect the Berber communities and traditions of the Agafay region. Our guides share cultural context with guests, and we ensure that our presence supports rather than disrupts local life. Photography of people or private property is always done with consent.'
          : 'Nous respectons les communautés et traditions berbères de la région d\'Agafay. Nos guides partagent le contexte culturel avec les invités, et nous veillons à ce que notre présence soutienne plutôt qu\'elle ne perturbe la vie locale. La photographie de personnes ou de propriétés privées est toujours effectuée avec consentement.',
      },
    ],
    commitment: {
      heading: locale === 'en' ? 'Our Commitment' : 'Notre engagement',
      text: locale === 'en'
        ? 'We are committed to continuous improvement. Each season, we review our practices, listen to feedback from guests and local partners, and look for new ways to reduce our impact. Sustainability is not a marketing claim — it is a responsibility we take seriously every time we enter the desert.'
        : 'Nous nous engageons à une amélioration continue. Chaque saison, nous examinons nos pratiques, écoutons les retours des invités et des partenaires locaux, et cherchons de nouvelles façons de réduire notre impact. La durabilité n\'est pas une affirmation marketing — c\'est une responsabilité que nous prenons au sérieux chaque fois que nous entrons dans le désert.',
    },
  };

  return (
    <>
      <Navbar locale={locale} />

      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
            <p className="section-label justify-center mb-6">
              {locale === 'en' ? 'Our Responsibility' : 'Notre Responsabilité'}
            </p>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink mb-4 leading-tight">
              {t.title}
            </h1>
            <p className="font-sans font-light text-lg text-ink-muted leading-[1.7]">
              {t.subtitle}
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[50vh] min-h-[400px] mb-20 overflow-hidden border border-rule/20">
            <Image
              alt={locale === 'en' ? 'Agafay desert landscape' : 'Paysage du désert d\'Agafay'}
              src="/images/hero-agafay.png"
              fill
              className="object-cover filter saturate-[0.75]"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, oklch(var(--background) / 0.6), transparent 60%)' }}
            />
          </div>

          {/* Intro */}
          <div className="max-w-3xl mx-auto mb-20">
            <p className="font-sans font-light text-base text-ink-muted leading-[1.9]">
              {t.intro}
            </p>
          </div>

          {/* Pillars */}
          <div className="max-w-4xl mx-auto space-y-0 mb-20">
            {t.pillars.map((pillar, i) => (
              <div
                key={i}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-t border-rule/20 items-start hover:bg-white/[0.015] transition-colors duration-300 -mx-4 px-4"
              >
                <div className="md:col-span-2">
                  <span className="font-display italic font-light text-2xl text-gold/50">
                    {pillar.number}
                  </span>
                </div>
                <div className="md:col-span-10">
                  <h3 className="font-syne text-[11px] font-semibold tracking-[0.2em] uppercase text-gold mb-3">
                    {pillar.heading}
                  </h3>
                  <p className="font-sans font-light text-sm text-ink-muted leading-[1.8]">
                    {pillar.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Commitment */}
          <div className="max-w-3xl mx-auto border-t border-rule/20 pt-16 text-center">
            <blockquote
              className="font-display italic font-light text-2xl md:text-3xl text-ink leading-[1.4] mb-6"
              style={{
                borderLeft: '2px solid oklch(var(--gold))',
                paddingLeft: '1.5rem',
              }}
            >
              {t.commitment.heading}
            </blockquote>
            <p className="font-sans font-light text-sm text-ink-muted leading-[1.8]">
              {t.commitment.text}
            </p>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
