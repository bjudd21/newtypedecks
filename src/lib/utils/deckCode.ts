/**
 * Deck Code Utilities
 *
 * Generates compact, human-readable deck codes for Discord/chat sharing.
 * Format: NTDK-{GAMEPREFIX}-{8 random chars}
 * Examples: NTDK-GN-xK9mPqR2, NTDK-OP-mN4rQs7Y
 *
 * Codes are stored server-side in Deck.deckCode (unique, indexed).
 * Import by code looks up the deck from the code column.
 */

const GAME_PREFIXES: Record<string, string> = {
  gundam: 'GN',
  'one-piece': 'OP',
};

/** Exclude visually ambiguous chars (0/O, 1/I/l) */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function getGamePrefix(slug: string): string {
  return (
    GAME_PREFIXES[slug] ??
    slug
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, 2)
  );
}

/**
 * Generate a unique deck code for the given game slug.
 * Output is ~17 characters, safe for Discord and chat sharing.
 */
export function generateDeckCode(gameSlug: string): string {
  const prefix = getGamePrefix(gameSlug);
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `NTDK-${prefix}-${suffix}`;
}
