'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/tours', label: 'Tours' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-rule/30 bg-bg-subtle">
        <div>
          <p className="font-syne text-[9px] font-semibold tracking-[0.22em] uppercase text-gold">HS Luxury Quads</p>
          <p className="font-display text-lg text-ink">Admin</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-ink-muted hover:text-gold transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          lg:flex lg:flex-col lg:w-64 lg:min-h-screen
          border-b lg:border-b-0 lg:border-r border-rule/30 bg-bg-subtle
          ${open ? 'flex flex-col' : 'hidden lg:flex'}
        `}
      >
        {/* Desktop header */}
        <div className="hidden lg:block p-6 border-b border-rule/20">
          <p className="font-syne text-[10px] font-semibold tracking-[0.22em] uppercase text-gold">
            HS Luxury Quads
          </p>
          <h1 className="font-display text-2xl text-ink mt-1">Admin</h1>
        </div>

        <nav className="p-3 flex-1 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-syne text-[11px] tracking-[0.14em] uppercase transition-colors rounded-sm ${
                isActive(item.href, item.exact)
                  ? 'bg-gold text-[oklch(8%_0.01_75)]'
                  : 'text-ink-muted hover:text-gold hover:bg-bg-sunken'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-rule/20 space-y-0.5">
          <Link
            href="/en"
            target="_blank"
            className="flex items-center gap-2 px-4 py-3 font-syne text-[11px] tracking-[0.14em] uppercase text-ink-faint hover:text-gold transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            View site
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-2 px-4 py-3 font-syne text-[11px] tracking-[0.14em] uppercase text-ink-faint hover:text-red-400 transition-colors"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
      Log out
    </button>
  );
}
