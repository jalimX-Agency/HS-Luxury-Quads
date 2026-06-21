import { cn } from '@/lib/utils';

export const adminButtonVariants = {
  primary:
    'bg-gold text-[oklch(8%_0.01_75)] hover:bg-gold-light border border-transparent',
  secondary:
    'bg-background border border-rule/30 text-ink hover:border-gold hover:text-gold',
  danger:
    'bg-background border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400',
} as const;

export type AdminButtonVariant = keyof typeof adminButtonVariants;

export function adminButtonClass(
  variant: AdminButtonVariant = 'primary',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-syne text-[11px] font-semibold tracking-[0.16em] uppercase px-5 py-3 transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
    adminButtonVariants[variant],
    className,
  );
}
