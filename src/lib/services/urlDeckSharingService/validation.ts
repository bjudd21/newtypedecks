/**
 * URL deck validation
 */

import { PARAM_NAME } from './constants';
import { decodeDeckFromURL } from './decoding';

/**
 * Validate if URL contains deck data
 */
export function hasValidDeckInURL(): boolean {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get(PARAM_NAME);

    if (!encodedData) {
      return false;
    }

    // Try to decode to check validity
    decodeDeckFromURL(encodedData);
    return true;
  } catch {
    return false;
  }
}
