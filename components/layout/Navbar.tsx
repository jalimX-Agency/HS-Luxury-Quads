'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/content/tours';

interface NavbarProps {
  locale: Locale;
}

export default function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const el = document.documentElement;
    const currentTheme = el.getAttribute('data-theme') as 'dark' | 'light' || 'light';
    setTheme(currentTheme);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('hs-theme', nextTheme);
    setTheme(nextTheme);
  };

  const localeHref = (loc: Locale) => {
    const segments = pathname.split('/');
    segments[1] = loc;
    return segments.join('/');
  };

  const navLinks = [
    { href: `/${locale}/tours`, label: locale === 'en' ? 'Experiences' : 'Expériences' },
    { href: `/${locale}/about`, label: locale === 'en' ? 'About Us' : 'À Propos' },
    { href: `/${locale}/blog`, label: 'Blog' },
    { href: `/${locale}/gallery`, label: locale === 'en' ? 'Gallery' : 'Galerie' },
    { href: `/${locale}/contact`, label: 'Contact' },
  ];

  const themeIcon =
    theme === 'dark' ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="none" />
      </svg>
    );

  return (
    <>
      {/* ── Desktop Navigation ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-background/88 backdrop-blur-xl border-rule/20 py-4 shadow-2xl'
            : 'bg-transparent border-transparent py-6'
        } hidden md:flex`}
      >
        <div className="flex justify-between items-center w-full px-gutter py-0 max-w-container-max mx-auto">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-95 transition-opacity">
            <div className="relative w-9 h-9">
              <Image src="/logo.png" alt="HS Luxury Quads" fill sizes="36px" className="object-contain" priority />
            </div>
            <span className="font-display italic font-semibold text-lg tracking-wide text-gold">
              HS<span className="font-sans not-italic font-light text-ink ml-1.5 text-xs tracking-[0.05em] uppercase">Luxury Quads</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-syne text-[11px] font-medium tracking-[0.18em] uppercase transition-all duration-300 relative py-1 ${
                    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold animate-fadeIn" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-6">
            {/* Desktop locale switcher — inlined to avoid nested component hydration mismatch */}
            <div className="relative">
              {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 border border-rule/30 text-ink-muted text-[10px] font-syne font-semibold tracking-[0.15em] uppercase px-3 py-1.5 hover:border-gold hover:text-gold transition-all duration-200"
              >
                {locale.toUpperCase()}
                <svg
                  className={`w-2.5 h-2.5 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-1 right-0 bg-background border border-rule/30 shadow-xl z-50 min-w-[60px] py-1">
                  {(['en', 'fr'] as Locale[]).map((loc) => (
                    <Link
                      key={loc}
                      href={localeHref(loc)}
                      onClick={() => setLangOpen(false)}
                      className={`block w-full text-left px-3 py-1.5 text-[10px] font-syne font-semibold tracking-[0.15em] uppercase transition-all duration-150 ${
                        locale === loc ? 'text-gold bg-gold/5' : 'text-ink-muted hover:text-ink hover:bg-rule/10'
                      }`}
                    >
                      {loc.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Book CTA */}
            <Link
              href={`/${locale}/contact`}
              className="bg-gold text-background font-syne font-semibold text-[11px] tracking-[0.18em] uppercase px-6 py-3.5 transition-all duration-300 hover:bg-gold-light hover:-translate-y-[1px]"
            >
              {locale === 'en' ? 'Book Private Tour' : 'Réserver un Tour'}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-rule/10 py-4 px-6 flex justify-between items-center">
        <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <div className="relative w-7 h-7">
            <Image src="/logo.png" alt="HS Luxury Quads" fill sizes="28px" className="object-contain" priority />
          </div>
          <span className="font-display italic font-semibold text-[15px] tracking-wide text-gold">
            HS<span className="font-sans not-italic font-light text-ink ml-1.5 text-[9px] tracking-[0.05em] uppercase">Luxury Quads</span>
          </span>
        </Link>

        {/* Mobile locale switcher — inlined to avoid nested component hydration mismatch */}
        <div className="relative">
          {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1 border border-rule/30 text-ink-muted text-[9px] font-syne font-semibold tracking-[0.15em] uppercase px-2.5 py-1 hover:border-gold hover:text-gold transition-all duration-200"
          >
            {locale.toUpperCase()}
            <svg
              className={`w-2 h-2 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {langOpen && (
            <div className="absolute top-full mt-1 right-0 bg-background border border-rule/30 shadow-xl z-50 min-w-[56px] py-1">
              {(['en', 'fr'] as Locale[]).map((loc) => (
                <Link
                  key={loc}
                  href={localeHref(loc)}
                  onClick={() => setLangOpen(false)}
                  className={`block w-full text-left px-2.5 py-1 text-[9px] font-syne font-semibold tracking-[0.15em] uppercase transition-all duration-150 ${
                    locale === loc ? 'text-gold bg-gold/5' : 'text-ink-muted hover:text-ink hover:bg-rule/10'
                  }`}
                >
                  {loc.toUpperCase()}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile: theme + WhatsApp floating just above the tab bar ── */}
      <button
        onClick={toggleTheme}
        suppressHydrationWarning
        className="md:hidden fixed bottom-24 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full border border-rule/40 bg-background/90 backdrop-blur-sm text-ink-muted hover:border-gold hover:text-gold shadow-lg transition-all duration-200"
        aria-label="Toggle theme"
      >
        {mounted ? themeIcon : <span className="w-5 h-5" />}
      </button>
      <a
        href="https://wa.me/212634857515"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-24 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform duration-200"
        aria-label="WhatsApp"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.56 4.13 1.54 5.88L0 24l6.31-1.66A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.27-6.14-3.48-8.52zM12 22c-1.97 0-3.88-.53-5.55-1.44l-.4-.23-3.75 1 1-3.65-.24-.42A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.25-7.5c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.09-.17.18-.34.2-.62.07-.28-.14-1.18-.44-2.24-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.13.28-.34.42-.51.14-.17.19-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.64-1.55-.88-2.12-.23-.55-.46-.47-.64-.48-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.44 0 1.44 1.05 2.84 1.2 3.03.14.19 2.07 3.15 5.02 4.41.7.3 1.24.48 1.67.61.7.22 1.34.19 1.85.12.56-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.34z" />
        </svg>
      </a>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-bg-subtle/95 backdrop-blur-lg border-t border-rule/20 shadow-xl pb-safe">
        <div className="flex justify-around items-center p-4">
          <Link
            href={`/${locale}`}
            className={`flex flex-col items-center gap-1.5 transition-all ${pathname === `/${locale}` ? 'text-gold' : 'text-ink-muted'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6.75h-6V21H3.75A.75.75 0 013 21V9.75z" />
            </svg>
            <span className="font-syne text-[8px] tracking-widest uppercase font-semibold">
              {locale === 'en' ? 'Home' : 'Accueil'}
            </span>
          </Link>

          <Link
            href={`/${locale}/tours`}
            className={`flex flex-col items-center gap-1.5 transition-all ${pathname?.includes('/tours') ? 'text-gold' : 'text-ink-muted'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            <span className="font-syne text-[8px] tracking-widest uppercase font-semibold">Tours</span>
          </Link>

          <Link
            href={`/${locale}/contact`}
            className={`flex flex-col items-center gap-1.5 transition-all ${pathname === `/${locale}/contact` ? 'text-gold' : 'text-ink-muted'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="font-syne text-[8px] tracking-widest uppercase font-semibold">
              {locale === 'en' ? 'Book' : 'Réserver'}
            </span>
          </Link>

          <Link
            href={`/${locale}/about`}
            className={`flex flex-col items-center gap-1.5 transition-all ${pathname === `/${locale}/about` ? 'text-gold' : 'text-ink-muted'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="font-syne text-[8px] tracking-widest uppercase font-semibold">
              {locale === 'en' ? 'About' : 'À Propos'}
            </span>
          </Link>
        </div>
      </nav>

      {/* ── Desktop-only: Theme Toggle (hidden on mobile) ── */}
      <button
        onClick={toggleTheme}
        className="hidden md:flex fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full border border-rule/40 bg-background/90 backdrop-blur-sm items-center justify-center text-ink-muted hover:border-gold hover:text-gold shadow-lg transition-all duration-200"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        {mounted ? themeIcon : <span className="w-5 h-5" />}
      </button>

      {/* ── Desktop-only: WhatsApp Button (hidden on mobile) ── */}
      <a
        href="https://wa.me/212634857515"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#25D366] items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200"
        aria-label="Contact on WhatsApp"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.56 4.13 1.54 5.88L0 24l6.31-1.66A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.27-6.14-3.48-8.52zM12 22c-1.97 0-3.88-.53-5.55-1.44l-.4-.23-3.75 1 1-3.65-.24-.42A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.25-7.5c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.09-.17.18-.34.2-.62.07-.28-.14-1.18-.44-2.24-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.13.28-.34.42-.51.14-.17.19-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.64-1.55-.88-2.12-.23-.55-.46-.47-.64-.48-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.44 0 1.44 1.05 2.84 1.2 3.03.14.19 2.07 3.15 5.02 4.41.7.3 1.24.48 1.67.61.7.22 1.34.19 1.85.12.56-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.34z" />
        </svg>
      </a>
    </>
  );
}
