/**
 * URL management operations
 */

import { PARAM_NAME } from './constants';

/**
 * Clear deck parameter from URL without page reload
 */
export function clearDeckFromURL(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM_NAME);
    window.history.replaceState({}, '', url.pathname + url.search);
  } catch (error) {
    console.error('Failed to clear deck from URL:', error);
  }
}
