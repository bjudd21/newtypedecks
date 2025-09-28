import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // External packages for server components
  serverExternalPackages: ['@prisma/client'],

  // Image optimization configuration
  images: {
    // Local and production domains
    domains: [
      'localhost',
      '127.0.0.1',
      'gundam-gcg.com',
      'cdn.gundam-gcg.com',
    ],
    // CDN domains for external providers
    remotePatterns: [
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
      {
        protocol: 'https',
        hostname: 'cdn.gundam-gcg.com',
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

  // Security headers
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
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
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
  async redirects() {
    return [
      {
        source: '/cards',
        destination: '/cards/search',
        permanent: false,
      },
    ];
  },

  // Performance monitoring
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
};

export default nextConfig;
