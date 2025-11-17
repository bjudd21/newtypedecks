/**
 * Deck decoding from URL parameter
 */

import { EncodedDeckData } from './types';

/**
 * Decode deck data from URL parameter
 */
export function decodeDeckFromURL(encodedData: string): EncodedDeckData {
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
