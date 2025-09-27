import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  (req) => {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin-only routes
    const adminRoutes = ['/admin'];
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth/signin?error=AdminRequired', req.url));
      }
    }

    // Moderator+ routes
    const moderatorRoutes = ['/moderation'];
    if (moderatorRoutes.some(route => pathname.startsWith(route))) {
      if (!token || (token.role !== 'MODERATOR' && token.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/auth/signin?error=ModeratorRequired', req.url));
      }
    }

    // User-only routes (authenticated user required)
    const authRoutes = [
      '/dashboard',
      '/profile',
      '/decks/create',
      '/decks/edit',
      '/collection',
      '/settings'
    ];

    if (authRoutes.some(route => pathname.startsWith(route))) {
      if (!token) {
        return NextResponse.redirect(
          new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        const publicRoutes = [
          '/',
          '/cards',
          '/decks',
          '/about',
          '/auth',
          '/api/cards',
          '/api/public'
        ];

        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // For protected routes, require token
        return !!token;
      },
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