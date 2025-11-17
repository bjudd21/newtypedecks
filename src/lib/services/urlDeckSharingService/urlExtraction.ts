/**
 * Extract deck data from current URL
 */

import { EncodedDeckData } from './types';
import { PARAM_NAME } from './constants';
import { decodeDeckFromURL } from './decoding';

/**
 * Extract deck data from current URL parameters
 */
export function getDeckFromCurrentURL(): EncodedDeckData | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get(PARAM_NAME);

    if (!encodedData) {
      return null;
    }

    return decodeDeckFromURL(encodedData);
  } catch (error) {
    console.error('Failed to extract deck from URL:', error);
    return null;
  }
}
