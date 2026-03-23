/**
 * Next.js middleware — protects game-scoped routes that require authentication.
 *
 * Routes protected: /[gameSlug]/collection, /[gameSlug]/favorites
 * Unauthenticated users are redirected to /auth/signin with a callbackUrl.
 *
 * Game slug validation (invalid slugs → 404) is handled by the [gameSlug]/layout
 * via notFound(), not here, to avoid DB calls in the edge runtime.
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Routes (relative to a gameSlug prefix) that require authentication.
// Matches /[gameSlug]/<segment> and /[gameSlug]/<segment>/**
const AUTH_REQUIRED_SEGMENTS = [
  'collection',
  'favorites',
  'decks/create',
  'decks/edit',
];

export default withAuth(
  () => {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Match /[gameSlug]/<protected-segment> or /[gameSlug]/<segment>/**
        const isProtected = AUTH_REQUIRED_SEGMENTS.some((segment) => {
          // Escape slashes in the segment for use in a regex
          const escaped = segment.replace('/', '\\/');
          return new RegExp(`^/[^/]+/${escaped}(/|$)`).test(pathname);
        });

        if (isProtected) return !!token;

        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  // Run on all page routes; skip API, static, image, and asset requests
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)', '/'],
};
