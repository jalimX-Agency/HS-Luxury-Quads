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
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-2 font-syne text-[10px] tracking-[0.14em] uppercase text-ink-faint hover:text-gold transition-colors',
        className,
      )}
    >
      {theme === 'dark' ? (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Light mode
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
          Dark mode
        </>
      )}
    </button>
  );
}
