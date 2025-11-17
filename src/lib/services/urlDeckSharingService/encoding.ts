/**
 * Deck encoding for URL sharing
 */

import { ShareableDeck, EncodedDeckData } from './types';
import { MAX_URL_LENGTH, PARAM_NAME } from './constants';

/**
 * Encode deck data for URL sharing
 */
export function encodeDeckForURL(deck: ShareableDeck): string {
  try {
    // Create minimal deck data for URL
    const encodedData: EncodedDeckData = {
      name: deck.name,
      description: deck.description,
      format: deck.format,
      timestamp: Date.now(),
      cards: deck.cards.map((deckCard) => ({
        id: deckCard.card.id,
        quantity: deckCard.quantity,
        category: deckCard.category || 'main',
      })),
    };

    // Convert to JSON and encode
    const jsonString = JSON.stringify(encodedData);
    const encoded = btoa(jsonString); // Base64 encode

    // Check URL length
    const testURL = `${window.location.origin}${window.location.pathname}?${PARAM_NAME}=${encoded}`;
    if (testURL.length > MAX_URL_LENGTH) {
      throw new Error(
        'Deck data too large for URL sharing. Try removing some cards or export the deck instead.'
      );
    }

    return encoded;
  } catch (error) {
    console.error('Failed to encode deck for URL:', error);
    throw error;
  }
}
