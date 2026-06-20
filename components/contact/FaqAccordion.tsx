'use client';

import { useState } from 'react';
import type { Locale } from '@/content/tours';

const faqs = [
  {
    q: { en: 'Where exactly do we meet?', fr: 'Où exactement nous retrouvons-nous ?' },
    a: {
      en: "Our base is in Agafay Desert, 30km from Marrakech. We also offer hotel pickup — just let us know your location.",
      fr: "Notre base se situe dans le désert d'Agafay, à 30 km de Marrakech. Nous proposons aussi le transfert depuis votre hôtel — indiquez-nous simplement votre adresse.",
    },
  },
  {
    q: { en: 'How do I confirm my booking?', fr: 'Comment confirmer ma réservation ?' },
    a: {
      en: "After submitting the form, we'll confirm within 1 hour via WhatsApp or email.",
      fr: "Après envoi du formulaire, nous confirmons sous 1 heure par WhatsApp ou e-mail.",
    },
  },
  {
    q: { en: 'What should I wear?', fr: 'Que dois-je porter ?' },
    a: {
      en: "We provide full gear (helmet, goggles, suit). Wear comfortable clothes and closed-toe shoes.",
      fr: "Nous fournissons l'équipement complet (casque, lunettes, combinaison). Portez des vêtements confortables et des chaussures fermées.",
    },
  },
  {
    q: { en: 'Can I book on Viator?', fr: 'Puis-je réserver sur Viator ?' },
    a: {
      en: "Yes! You can also book securely through Viator with instant confirmation and free cancellation.",
      fr: "Oui ! Vous pouvez aussi réserver en toute sécurité via Viator avec confirmation immédiate et annulation gratuite.",
    },
  },
];

export default function FaqAccordion({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col">
      {faqs.map((faq, i) => (
        <div key={i} className="border-t" style={{ borderColor: 'oklch(var(--rule) / 0.2)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-5 flex justify-between items-center gap-4"
          >
            <span className="font-syne font-semibold text-sm" style={{ color: 'oklch(var(--ink))' }}>
              {faq.q[locale]}
            </span>
            <span style={{ color: 'oklch(var(--gold))' }} className="text-lg leading-none flex-shrink-0">
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <p className="pb-5 font-sans font-light text-sm leading-[1.8]" style={{ color: 'oklch(var(--ink-muted))' }}>
              {faq.a[locale]}
            </p>
          )}
        </div>
      ))}
      <div className="border-t" style={{ borderColor: 'oklch(var(--rule) / 0.2)' }} />
    </div>
  );
}
