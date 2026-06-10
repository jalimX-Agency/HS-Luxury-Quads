import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond, Syne } from 'next/font/google';
import '../globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin | HS Luxury Quads',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('hs-admin-theme');
                var theme = saved === 'light' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${cormorant.variable} ${syne.variable} bg-background text-ink font-sans antialiased transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
