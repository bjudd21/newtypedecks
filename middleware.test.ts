/**
 * Middleware route-matching logic tests.
 *
 * These tests verify the regex patterns and route classification
 * used in middleware.ts without invoking the Edge runtime.
 */

// --- Route classification helpers (mirrored from middleware.ts) ---

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

function isModeratorRoute(pathname: string): boolean {
  return pathname.startsWith('/moderation');
}

function requiresAuth(pathname: string): boolean {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname.startsWith('/settings/') ||
    /^\/[^/]+\/collection(\/|$)/.test(pathname) ||
    /^\/[^/]+\/favorites(\/|$)/.test(pathname) ||
    /^\/[^/]+\/decks\/create(\/|$)/.test(pathname) ||
    /^\/[^/]+\/decks\/edit(\/|$)/.test(pathname)
  );
}

// --- Tests ---

describe('middleware route classification', () => {
  describe('admin routes', () => {
    it('matches /admin frontend routes', () => {
      expect(isAdminRoute('/admin')).toBe(true);
      expect(isAdminRoute('/admin/cards')).toBe(true);
      expect(isAdminRoute('/admin/users')).toBe(true);
    });

    it('matches /api/admin routes', () => {
      expect(isAdminRoute('/api/admin')).toBe(true);
      expect(isAdminRoute('/api/admin/cards')).toBe(true);
      expect(isAdminRoute('/api/admin/users/123')).toBe(true);
    });

    it('does not match non-admin routes', () => {
      expect(isAdminRoute('/dashboard')).toBe(false);
      expect(isAdminRoute('/api/cards')).toBe(false);
      expect(isAdminRoute('/gundam/decks')).toBe(false);
    });
  });

  describe('moderator routes', () => {
    it('matches /moderation routes', () => {
      expect(isModeratorRoute('/moderation')).toBe(true);
      expect(isModeratorRoute('/moderation/reports')).toBe(true);
    });

    it('does not match other routes', () => {
      expect(isModeratorRoute('/admin')).toBe(false);
      expect(isModeratorRoute('/dashboard')).toBe(false);
    });
  });

  describe('auth-required routes', () => {
    it('matches /dashboard and sub-routes', () => {
      expect(requiresAuth('/dashboard')).toBe(true);
      expect(requiresAuth('/dashboard/decks')).toBe(true);
    });

    it('matches /profile and sub-routes', () => {
      expect(requiresAuth('/profile')).toBe(true);
      expect(requiresAuth('/profile/settings')).toBe(true);
    });

    it('matches /settings/ sub-routes', () => {
      expect(requiresAuth('/settings/pwa')).toBe(true);
      expect(requiresAuth('/settings/notifications')).toBe(true);
    });

    it('matches /{gameSlug}/collection', () => {
      expect(requiresAuth('/gundam/collection')).toBe(true);
      expect(requiresAuth('/onepiece/collection')).toBe(true);
      expect(requiresAuth('/gundam/collection/cards')).toBe(true);
    });

    it('matches /{gameSlug}/favorites', () => {
      expect(requiresAuth('/gundam/favorites')).toBe(true);
      expect(requiresAuth('/onepiece/favorites')).toBe(true);
    });

    it('matches /{gameSlug}/decks/create', () => {
      expect(requiresAuth('/gundam/decks/create')).toBe(true);
      expect(requiresAuth('/onepiece/decks/create')).toBe(true);
    });

    it('matches /{gameSlug}/decks/edit', () => {
      expect(requiresAuth('/gundam/decks/edit')).toBe(true);
      expect(requiresAuth('/gundam/decks/edit/abc123')).toBe(true);
    });

    it('does NOT match public game routes', () => {
      expect(requiresAuth('/gundam')).toBe(false);
      expect(requiresAuth('/gundam/cards')).toBe(false);
      expect(requiresAuth('/gundam/cards/ST01-001')).toBe(false);
      expect(requiresAuth('/gundam/decks')).toBe(false);
      expect(requiresAuth('/gundam/decks/abc123')).toBe(false);
      expect(requiresAuth('/gundam/proxies')).toBe(false);
      expect(requiresAuth('/gundam/templates')).toBe(false);
    });

    it('does NOT match public top-level routes', () => {
      expect(requiresAuth('/')).toBe(false);
      expect(requiresAuth('/auth/signin')).toBe(false);
      expect(requiresAuth('/auth/signup')).toBe(false);
      expect(requiresAuth('/privacy')).toBe(false);
      expect(requiresAuth('/terms')).toBe(false);
      expect(requiresAuth('/offline')).toBe(false);
    });

    it('does NOT match API routes (handled separately)', () => {
      expect(requiresAuth('/api/cards')).toBe(false);
      expect(requiresAuth('/api/decks')).toBe(false);
    });
  });
});
