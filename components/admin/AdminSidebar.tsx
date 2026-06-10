'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminThemeToggle from '@/components/admin/AdminThemeToggle';

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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-rule/30 bg-bg-subtle">
      <div className="p-6 border-b border-rule/20">
        <p className="font-syne text-[10px] font-semibold tracking-[0.22em] uppercase text-gold">
          HS Luxury Quads
        </p>
        <h1 className="font-display text-2xl text-ink mt-1">Admin</h1>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 font-syne text-[11px] tracking-[0.14em] uppercase transition-colors ${
              isActive(item.href, item.exact)
                ? 'bg-gold text-[oklch(8%_0.01_75)]'
                : 'text-ink-muted hover:text-gold hover:bg-bg-sunken'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-rule/20 space-y-1">
        <AdminThemeToggle />
        <Link
          href="/en"
          className="block px-4 py-3 font-syne text-[11px] tracking-[0.14em] uppercase text-ink-faint hover:text-gold"
        >
          View website
        </Link>
        <LogoutButton />
      </div>
    </aside>
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
      className="w-full text-left px-4 py-3 font-syne text-[11px] tracking-[0.14em] uppercase text-ink-faint hover:text-red-400"
    >
      Log out
    </button>
  );
}
