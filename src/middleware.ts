/**
 * Next.js middleware — protects routes that require authentication or admin access.
 *
 * Auth-required (game-scoped): /[gameSlug]/collection, /[gameSlug]/favorites,
 *   /[gameSlug]/decks/create, /[gameSlug]/decks/edit
 * Auth-required (platform): /dashboard, /profile, /settings/pwa
 * Admin-only (pages + API): /admin/*, /api/admin/*
 *
 * Unauthenticated users are redirected to /auth/signin with a callbackUrl.
 * Non-admin users hitting admin routes receive a 403.
 *
 * Game slug validation (invalid slugs → 404) is handled by the [gameSlug]/layout
 * via notFound(), not here, to avoid DB calls in the edge runtime.
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Regex patterns for game-scoped routes that require authentication.
// Each pattern matches /[gameSlug]/<segment> and /[gameSlug]/<segment>/**
const GAME_AUTH_ROUTES: RegExp[] = [
  /^\/[^/]+\/decks\/create(\/|$)/,
  /^\/[^/]+\/decks\/edit(\/|$)/,
  /^\/[^/]+\/collection(\/|$)/,
  /^\/[^/]+\/favorites(\/|$)/,
];

// Platform-level routes (no gameSlug prefix) that require authentication.
const PLATFORM_AUTH_ROUTES: string[] = [
  '/dashboard',
  '/profile',
  '/settings/pwa',
];

// Routes that require admin role (both page and API).
const ADMIN_ROUTES: string[] = ['/admin', '/api/admin'];

function matchesRoute(pathname: string, routes: (string | RegExp)[]): boolean {
  return routes.some((route) =>
    typeof route === 'string'
      ? pathname.startsWith(route)
      : route.test(pathname)
  );
}

export default withAuth(
  (req) => {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes: require authenticated admin; return 403 for authenticated non-admins.
    if (matchesRoute(pathname, ADMIN_ROUTES)) {
      if (!token) {
        // withAuth will redirect to signIn automatically when authorized() returns false,
        // but for API routes we want a 403 JSON response instead of a redirect.
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Page routes — fall through; withAuth redirects to signIn.
        return NextResponse.next();
      }
      if (token.role !== 'ADMIN') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Admin routes require a token (role check is done in the handler above).
        if (matchesRoute(pathname, ADMIN_ROUTES)) return !!token;

        // Game-scoped auth routes.
        if (matchesRoute(pathname, GAME_AUTH_ROUTES)) return !!token;

        // Platform-level auth routes.
        if (matchesRoute(pathname, PLATFORM_AUTH_ROUTES)) return !!token;

        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  // Run on all page routes and /api/admin; skip static, image, and other asset requests.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)',
    '/api/admin/:path*',
    '/',
  ],
};
