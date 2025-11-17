/**
 * URL Deck Sharing Service
 *
 * Handles encoding and decoding deck data for URL-based sharing
 * Used primarily for anonymous deck sharing without database persistence
 */

// Export types
export type { ShareableDeck, EncodedDeckData } from './types';

// Export constants
export { MAX_URL_LENGTH, PARAM_NAME } from './constants';

// Import functional modules
import { encodeDeckForURL } from './encoding';
import { decodeDeckFromURL } from './decoding';
import { generateShareURL } from './urlGeneration';
import { getDeckFromCurrentURL } from './urlExtraction';
import { copyToClipboard } from './clipboard';
import { clearDeckFromURL } from './urlManagement';
import { hasValidDeckInURL } from './validation';
import { getEstimatedURLLength, canShareDeckViaURL } from './estimation';
import { ShareableDeck, EncodedDeckData } from './types';

/**
 * URL Deck Sharing Service
 *
 * Orchestrates all URL-based deck sharing operations through a class interface
 */
class URLDeckSharingService {
  private readonly MAX_URL_LENGTH = 2000; // Safe URL length limit
  private readonly PARAM_NAME = 'deck';

  /**
   * Encode deck data for URL sharing
   */
  encodeDeckForURL(deck: ShareableDeck): string {
    return encodeDeckForURL(deck);
  }

  /**
   * Decode deck data from URL parameter
   */
  decodeDeckFromURL(encodedData: string): EncodedDeckData {
    return decodeDeckFromURL(encodedData);
  }

  /**
   * Generate shareable URL for deck
   */
  generateShareURL(deck: ShareableDeck): string {
    return generateShareURL(deck);
  }

  /**
   * Extract deck data from current URL parameters
   */
  getDeckFromCurrentURL(): EncodedDeckData | null {
    return getDeckFromCurrentURL();
  }

  /**
   * Copy URL to clipboard
   */
  async copyToClipboard(url: string): Promise<void> {
    return copyToClipboard(url);
  }

  /**
   * Clear deck parameter from URL without page reload
   */
  clearDeckFromURL(): void {
    return clearDeckFromURL();
  }

  /**
   * Validate if URL contains deck data
   */
  hasValidDeckInURL(): boolean {
    return hasValidDeckInURL();
  }

  /**
   * Get estimated URL length for deck
   */
  getEstimatedURLLength(deck: ShareableDeck): number {
    return getEstimatedURLLength(deck);
  }

  /**
   * Check if deck is suitable for URL sharing
   */
  canShareDeckViaURL(deck: ShareableDeck): {
    canShare: boolean;
    reason?: string;
  } {
    return canShareDeckViaURL(deck);
  }
}

// Export singleton instance
export const urlDeckSharingService = new URLDeckSharingService();
export default urlDeckSharingService;
