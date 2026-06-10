'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'hs-admin-theme';

interface AdminThemeToggleProps {
  className?: string;
}

export default function AdminThemeToggle({ className }: AdminThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    const initial = saved === 'light' ? 'light' : 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'font-syne text-[11px] tracking-[0.14em] uppercase text-ink-faint hover:text-gold transition-colors',
        className ?? 'w-full text-left px-4 py-3',
      )}
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
