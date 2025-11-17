/**
 * URL length estimation and sharing validation
 */

import { ShareableDeck } from './types';
import { MAX_URL_LENGTH } from './constants';
import { generateShareURL } from './urlGeneration';

/**
 * Get estimated URL length for deck
 */
export function getEstimatedURLLength(deck: ShareableDeck): number {
  try {
    const shareURL = generateShareURL(deck);
    return shareURL.length;
  } catch {
    return MAX_URL_LENGTH + 1; // Return over limit if encoding fails
  }
}

/**
 * Check if deck is suitable for URL sharing
 */
export function canShareDeckViaURL(deck: ShareableDeck): {
  canShare: boolean;
  reason?: string;
} {
  try {
    if (!deck.cards || deck.cards.length === 0) {
      return { canShare: false, reason: 'Deck is empty' };
    }

    const estimatedLength = getEstimatedURLLength(deck);
    if (estimatedLength > MAX_URL_LENGTH) {
      return {
        canShare: false,
        reason: `Deck too large for URL sharing (${estimatedLength} characters). Try reducing the number of cards or use export instead.`,
      };
    }

    return { canShare: true };
  } catch (_error) {
    return { canShare: false, reason: 'Failed to analyze deck for sharing' };
  }
}
