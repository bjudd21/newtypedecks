/**
 * Card keyword extraction utilities
 */

/**
 * Extract keywords from card text
 */
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];

  // Common Gundam Card Game keywords
  const commonKeywords = [
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

  const foundKeywords: string[] = [];
  const lowerText = text.toLowerCase();

  for (const keyword of commonKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }

  return Array.from(new Set(foundKeywords)); // Remove duplicates
}
