/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // ─── Image optimization ─────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
        pathname: '/**',
      },
    ],
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
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://scontent.cdninstagram.com https://res.cloudinary.com https://lh3.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com https://*.r2.dev",
              "media-src 'self' https://*.r2.dev",
              "connect-src 'self' https://vercel.app https://*.vercel.app https://www.google-analytics.com https://analytics.google.com https://*.r2.cloudflarestorage.com",
              "frame-src https://maps.google.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
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
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // ─── Experimental features ───────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', 'lucide-react'],
  },

  // ─── Compiler options ───────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;