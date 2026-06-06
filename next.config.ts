import type { NextConfig } from 'next';

/**
 * HS Luxury Quads Morocco — Next.js 14 configuration
 *
 * Performance targets (Core Web Vitals):
 *   LCP < 2.5s  — Largest Contentful Paint
 *   CLS < 0.1   — Cumulative Layout Shift
 *   FID < 100ms — First Input Delay
 *
 * Image optimization strategy:
 *   • Use next/image for all images (auto WebP/AVIF conversion, lazy loading)
 *   • Explicitly sized images to eliminate CLS from late-loading media
 *   • Blur placeholders via blurDataURL for below-the-fold images
 *   • Prefer static imports over CDN URLs where possible
 *   • Instagram / Cloudinary CDN domains whitelisted below
 *
 * Font loading strategy:
 *   • Use next/font (Google Fonts / local) — zero layout shift, self-hosted automatically
 *   • font-display: swap via next/font presets
 *   • Subset to Latin + Arabic characters only (reduce woff2 size)
 *   • Preload critical fonts with next/font preload: true
 */

const nextConfig: NextConfig = {
  // ─── i18n ────────────────────────────────────────────────────────────────
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    // routing: { localePrefix: 'as-needed' }, // uncomment for clean URLs
  },

  // ─── Image optimization ─────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Instagram CDN
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        pathname: '/**',
      },
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Unsplash (if used in marketing images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Modern formats first, quality tuning
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ─── Headers (security + performance) ───────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS protection (legacy but still useful for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy (disable unnecessary browser features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow Google Analytics + Vercel analytics
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              // Allow Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Allow Instagram / Cloudinary / Unsplash images
              "img-src 'self' data: blob: https://scontent.cdninstagram.com https://res.cloudinary.com https://images.unsplash.com https://*.google-analytics.com https://*.googletagmanager.com",
              // Allow Vercel edge network
              "connect-src 'self' https://vercel.app https://*.vercel.app https://www.google-analytics.com https://analytics.google.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ─── Redirects ──────────────────────────────────────────────────────────
  async redirects() {
    return [
      // www → non-www (handled by vercel.json for edge routing, but keeping here too)
      // Force trailing slash normalization
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // ─── Experimental features ───────────────────────────────────────────────
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', 'lucide-react'],
  },

  // ─── Compiler options ───────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;