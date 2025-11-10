/**
 * URL Deck Sharing Service
 *
 * Handles encoding and decoding deck data for URL-based sharing
 * Used primarily for anonymous deck sharing without database persistence
 */

import { CardWithRelations } from '@/lib/types/card';

export interface ShareableDeck {
  id: string;
  name: string;
  description?: string;
  cards: Array<{
    cardId: string;
    card: CardWithRelations;
    quantity: number;
    category: string;
  }>;
  createdAt: Date;
  format?: string;
}

export interface EncodedDeckData {
  name: string;
  description?: string;
  cards: Array<{
    id: string;
    quantity: number;
    category: string;
  }>;
  format?: string;
  timestamp: number;
}

class URLDeckSharingService {
  private readonly MAX_URL_LENGTH = 2000; // Safe URL length limit
  private readonly PARAM_NAME = 'deck';

  /**
   * Encode deck data for URL sharing
   */
  encodeDeckForURL(deck: ShareableDeck): string {
    try {
      // Create minimal deck data for URL
      const encodedData: EncodedDeckData = {
        name: deck.name,
        description: deck.description,
        format: deck.format,
        timestamp: Date.now(),
        cards: deck.cards.map(deckCard => ({
          id: deckCard.card.id,
          quantity: deckCard.quantity,
          category: deckCard.category || 'main'
        }))
      };

      // Convert to JSON and encode
      const jsonString = JSON.stringify(encodedData);
      const encoded = btoa(jsonString); // Base64 encode

      // Check URL length
      const testURL = `${window.location.origin}${window.location.pathname}?${this.PARAM_NAME}=${encoded}`;
      if (testURL.length > this.MAX_URL_LENGTH) {
        throw new Error('Deck data too large for URL sharing. Try removing some cards or export the deck instead.');
      }

      return encoded;
    } catch (error) {
      console.error('Failed to encode deck for URL:', error);
      throw error;
    }
  }

  /**
   * Decode deck data from URL parameter
   */
  decodeDeckFromURL(encodedData: string): EncodedDeckData {
    try {
      const jsonString = atob(encodedData); // Base64 decode
      const decoded = JSON.parse(jsonString) as EncodedDeckData;

      // Validate decoded data
      if (!decoded.name || !Array.isArray(decoded.cards)) {
        throw new Error('Invalid deck data format');
      }

      return decoded;
    } catch (error) {
      console.error('Failed to decode deck from URL:', error);
      throw new Error('Invalid or corrupted deck sharing URL');
    }
  }

  /**
   * Generate shareable URL for deck
   */
  generateShareURL(deck: ShareableDeck): string {
    try {
      const encoded = this.encodeDeckForURL(deck);
      const baseURL = `${window.location.origin}/decks`;
      return `${baseURL}?${this.PARAM_NAME}=${encoded}`;
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      throw error;
    }
  }

  /**
   * Extract deck data from current URL parameters
   */
  getDeckFromCurrentURL(): EncodedDeckData | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get(this.PARAM_NAME);

      if (!encodedData) {
        return null;
      }

      return this.decodeDeckFromURL(encodedData);
    } catch (error) {
      console.error('Failed to extract deck from URL:', error);
      return null;
    }
  }

  /**
   * Copy URL to clipboard
   */
  async copyToClipboard(url: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
      throw new Error('Failed to copy URL. Please copy it manually.');
    }
  }

  /**
   * Clear deck parameter from URL without page reload
   */
  clearDeckFromURL(): void {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(this.PARAM_NAME);
      window.history.replaceState({}, '', url.pathname + url.search);
    } catch (error) {
      console.error('Failed to clear deck from URL:', error);
    }
  }

  /**
   * Validate if URL contains deck data
   */
  hasValidDeckInURL(): boolean {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get(this.PARAM_NAME);

      if (!encodedData) {
        return false;
      }

      // Try to decode to check validity
      this.decodeDeckFromURL(encodedData);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get estimated URL length for deck
   */
  getEstimatedURLLength(deck: ShareableDeck): number {
    try {
      const shareURL = this.generateShareURL(deck);
      return shareURL.length;
    } catch {
      return this.MAX_URL_LENGTH + 1; // Return over limit if encoding fails
    }
  }

  /**
   * Check if deck is suitable for URL sharing
   */
  canShareDeckViaURL(deck: ShareableDeck): { canShare: boolean; reason?: string } {
    try {
      if (!deck.cards || deck.cards.length === 0) {
        return { canShare: false, reason: 'Deck is empty' };
      }

      const estimatedLength = this.getEstimatedURLLength(deck);
      if (estimatedLength > this.MAX_URL_LENGTH) {
        return {
          canShare: false,
          reason: `Deck too large for URL sharing (${estimatedLength} characters). Try reducing the number of cards or use export instead.`
        };
      }

      return { canShare: true };
    } catch (_error) {
      return { canShare: false, reason: 'Failed to analyze deck for sharing' };
    }
  }
}

// Export singleton instance
export const urlDeckSharingService = new URLDeckSharingService();
export default urlDeckSharingService;