import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/Provider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AuthStatus } from '@/components/auth/AuthStatus';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { Navbar, MobileMenu } from '@/components/navigation';
import { LegalComplianceFooter } from '@/components/layout';
import { MonitoringProvider, MonitoringErrorBoundary } from '@/components/monitoring/MonitoringProvider';
import { PWAInstallPrompt, PWAStatus } from '@/components/pwa';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Gundam Card Game Database',
  description:
    'A comprehensive database and deck building platform for the Gundam Card Game',
  keywords: ['gundam', 'card game', 'database', 'deck building', 'collection'],
  authors: [{ name: 'Gundam Card Game Community' }],
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GCG Database',
    startupImage: [
      {
        url: '/icons/apple-splash-2048-2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/apple-splash-1668-2388.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/apple-splash-1536-2048.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/apple-splash-1125-2436.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/icons/apple-splash-1242-2688.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/icons/apple-splash-828-1792.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/apple-splash-1170-2532.png',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/icons/apple-splash-1284-2778.png',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/icons/apple-splash-750-1334.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/apple-splash-640-1136.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      }
    ]
  },
  openGraph: {
    title: 'Gundam Card Game Database',
    description:
      'A comprehensive database and deck building platform for the Gundam Card Game',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* PWA meta tags */}
        <meta name="application-name" content="GCG Database" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GCG Database" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <AuthProvider>
          <ReduxProvider>
            <div className="flex min-h-screen flex-col">
              <header className="border-b bg-white relative">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Gundam Card Game
                    </h1>
                    <div className="hidden md:flex items-center space-x-6">
                      <Navbar />
                      <div className="flex items-center gap-4">
                        <PWAStatus />
                        <AuthStatus />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:hidden">
                      <PWAStatus />
                      <MobileMenu />
                    </div>
                  </div>
                </div>
              </header>

              <EmailVerificationBanner />

              {/* PWA Install Prompt */}
              <div className="container mx-auto px-4 pt-4">
                <PWAInstallPrompt />
              </div>

              <main className="flex-1">{children}</main>

              <LegalComplianceFooter variant="full" />
            </div>
          </ReduxProvider>
        </AuthProvider>

        {/* Service Worker Registration Script */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />

        {/* PWA Utilities Script */}
        <Script
          id="pwa-utils"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent zoom on iOS Safari
              document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
              });

              // Handle viewport changes for iOS
              window.addEventListener('orientationchange', function() {
                setTimeout(function() {
                  window.scrollTo(0, 1);
                }, 500);
              });

              // Disable pull-to-refresh on iOS
              let lastTouchY = 0;
              let preventPullToRefresh = false;

              document.addEventListener('touchstart', function(e) {
                if (e.touches.length !== 1) return;
                lastTouchY = e.touches[0].clientY;
                preventPullToRefresh = window.pageYOffset === 0;
              });

              document.addEventListener('touchmove', function(e) {
                const touchY = e.touches[0].clientY;
                const touchYDelta = touchY - lastTouchY;
                lastTouchY = touchY;

                if (preventPullToRefresh) {
                  preventPullToRefresh = false;
                  if (touchYDelta > 0) {
                    e.preventDefault();
                    return;
                  }
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
