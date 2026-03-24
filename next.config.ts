import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // External packages for server components
  serverExternalPackages: ['@prisma/client'],

  // Image optimization configuration
  images: {
    // CDN domains for external providers and local development
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      // Production domains
      {
        protocol: 'https',
        hostname: 'gundam-gcg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.gundam-gcg.com',
      },
      // External CDN providers
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
    // Supported formats (in order of preference)
    formats: ['image/avif', 'image/webp'],
    // Device breakpoints for responsive images
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Icon and small image sizes
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    // Optimization settings
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days cache
    dangerouslyAllowSVG: false, // Security: disable SVG processing
    contentDispositionType: 'attachment', // Security: force download for unknown types
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Output configuration for Docker deployment
  output: 'standalone',

  // Compression and optimization
  compress: true,

  // Security and CORS headers
  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      // CORS + cache headers on API routes
      // CORS_ORIGINS defaults to * until a production domain is set.
      // Lock down to your domain via the CORS_ORIGINS env var before going live.
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.CORS_ORIGINS ?? '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          // API responses must not be cached by browsers or CDNs
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  generateEtags: true, // Enable ETags for caching

  // Bundle analyzer (only in development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),

  // Redirects for SEO and user experience
  // Old unscoped game paths redirect to /gundam/* for backward compatibility
  async redirects() {
    const gameScoped = [
      'cards',
      'decks',
      'collection',
      'analytics',
      'templates',
      'favorites',
    ];
    return gameScoped.flatMap((path) => [
      {
        source: `/${path}`,
        destination: `/gundam/${path}`,
        permanent: false,
      },
      {
        source: `/${path}/:rest*`,
        destination: `/gundam/${path}/:rest*`,
        permanent: false,
      },
    ]);
  },

  // Performance monitoring
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
};

export default nextConfig;
