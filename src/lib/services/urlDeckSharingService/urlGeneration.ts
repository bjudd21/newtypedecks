/**
 * URL generation for deck sharing
 */

import { ShareableDeck } from './types';
import { PARAM_NAME } from './constants';
import { encodeDeckForURL } from './encoding';

/**
 * Generate shareable URL for deck
 */
export function generateShareURL(deck: ShareableDeck): string {
  try {
    const encoded = encodeDeckForURL(deck);
    const baseURL = `${window.location.origin}/decks`;
    return `${baseURL}?${PARAM_NAME}=${encoded}`;
  } catch (error) {
    console.error('Failed to generate share URL:', error);
    throw error;
  }
}
