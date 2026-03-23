/**
 * Game routing utilities for navigation components.
 *
 * Detects whether the current URL path is inside a game context and extracts
 * the game slug. Used by Navbar, MobileMenu, and GameBreadcrumb so they can
 * build game-scoped links without requiring the GameProvider context.
 */

// First path segments that are platform-level routes, NOT game slugs
const NON_GAME_ROUTE_PREFIXES = new Set([
  'auth',
  'dashboard',
  'admin',
  'profile',
  'settings',
  'api',
  'privacy',
  'terms',
  'cookies',
  'offline',
  'demo',
]);

/**
 * Returns the game slug if the pathname is inside a game context, else null.
 * Example: "/gundam-card-game/cards" → "gundam-card-game"
 */
export function getGameSlugFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const first = segments[0];
  if (NON_GAME_ROUTE_PREFIXES.has(first)) return null;
  return first;
}

/**
 * Build the standard game-scoped nav items for a given game slug.
 */
export function buildGameNavItems(gameSlug: string) {
  return [
    {
      name: 'Cards',
      href: `/${gameSlug}/cards`,
      description: 'Browse card database',
    },
    {
      name: 'Decks',
      href: `/${gameSlug}/decks`,
      description: 'Build and manage decks',
    },
    {
      name: 'Collection',
      href: `/${gameSlug}/collection`,
      description: 'Manage your card collection',
    },
  ];
}

/**
 * Platform-level nav items shown on non-game pages.
 */
export const PLATFORM_NAV_ITEMS = [
  {
    name: 'Browse Games',
    href: '/',
    description: 'View all supported games',
  },
];
