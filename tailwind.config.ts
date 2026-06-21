import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        'bg-subtle': 'oklch(var(--background-subtle) / <alpha-value>)',
        'bg-sunken': 'oklch(var(--background-sunken) / <alpha-value>)',
        ink: 'oklch(var(--ink) / <alpha-value>)',
        'ink-muted': 'oklch(var(--ink-muted) / <alpha-value>)',
        'ink-faint': 'oklch(var(--ink-faint) / <alpha-value>)',
        gold: 'oklch(var(--gold) / <alpha-value>)',
        'gold-light': 'oklch(var(--gold-light) / <alpha-value>)',
        'gold-faint': 'oklch(var(--gold-faint) / <alpha-value>)',
        rule: 'oklch(var(--rule) / <alpha-value>)',
        white: 'oklch(var(--white) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
        md: '4px',
        lg: '8px',
        full: '9999px',
      },
      spacing: {
        xl: '80px',
        gutter: '24px',
        xs: '4px',
        base: '8px',
        sm: '12px',
        'container-max': '1440px',
        lg: '48px',
        md: '24px',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
        accent: ['var(--font-cormorant)', 'serif'],
      },
      backgroundImage: {
        'hero-overlay-dark': 'linear-gradient(160deg, oklch(9% 0.01 75 / 0.5) 0%, oklch(9% 0.01 75 / 0.75) 60%, oklch(9% 0.01 75 / 0.95) 100%)',
        'hero-overlay-light': 'linear-gradient(160deg, oklch(9% 0.01 75 / 0.25) 0%, oklch(9% 0.01 75 / 0.55) 60%, oklch(9% 0.01 75 / 0.80) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

