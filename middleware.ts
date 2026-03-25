import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  (req) => {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin-only routes: frontend /admin/* and API /api/admin/*
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'ADMIN') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { success: false, error: 'Forbidden' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(
          new URL('/auth/signin?error=AdminRequired', req.url)
        );
      }
    }

    // Moderator+ routes
    if (pathname.startsWith('/moderation')) {
      if (!token || (token.role !== 'MODERATOR' && token.role !== 'ADMIN')) {
        return NextResponse.redirect(
          new URL('/auth/signin?error=ModeratorRequired', req.url)
        );
      }
    }

    // Auth-required paths — top-level and under any [gameSlug] prefix.
    // Regex patterns match /{anything}/collection, /{anything}/favorites, etc.
    const requiresAuth =
      pathname === '/dashboard' ||
      pathname.startsWith('/dashboard/') ||
      pathname === '/profile' ||
      pathname.startsWith('/profile/') ||
      pathname.startsWith('/settings/') ||
      /^\/[^/]+\/collection(\/|$)/.test(pathname) ||
      /^\/[^/]+\/favorites(\/|$)/.test(pathname) ||
      /^\/[^/]+\/decks\/create(\/|$)/.test(pathname) ||
      /^\/[^/]+\/decks\/edit(\/|$)/.test(pathname);

    if (requiresAuth && !token) {
      return NextResponse.redirect(
        new URL(
          `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`,
          req.url
        )
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Allow all requests through — the main function above handles all
      // auth and role checks. The old publicRoutes list was missing [gameSlug]
      // prefixes (/gundam/cards, /gundam/decks, etc.) which caused it to block
      // unauthenticated users from browsing card/deck content.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
