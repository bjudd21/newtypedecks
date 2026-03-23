/**
 * Card keyword extraction utilities
 */

// Default keywords for Gundam (used when no game config is available)
const GUNDAM_DEFAULT_KEYWORDS = [
  'Pilot',
  'Mobile Suit',
  'Battleship',
  'Support',
  'Command',
  'Newtype',
  'Cyber',
  'Generation',
  'Strike',
  'Quick',
  'Rush',
  'Shield',
  'Armor',
  'Beam',
  'Physical',
  'Range',
  'Close',
  'Long',
  'All Range',
];

/**
 * Extract keywords from card text.
 * Pass game config keywords via the optional parameter to support multiple TCGs.
 */
export function extractKeywordsFromText(
  text: string,
  gameKeywords?: string[]
): string[] {
  if (!text) return [];

  const commonKeywords = gameKeywords ?? GUNDAM_DEFAULT_KEYWORDS;

  const foundKeywords: string[] = [];
  const lowerText = text.toLowerCase();

  for (const keyword of commonKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }

  return Array.from(new Set(foundKeywords)); // Remove duplicates
}
