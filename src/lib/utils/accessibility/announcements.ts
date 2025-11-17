/**
 * Screen reader announcements and related utilities
 */

import { SCREEN_READER_ONLY } from './constants';

/**
 * ARIA live region announcements
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = SCREEN_READER_ONLY;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Skip link functionality
 */
export function createSkipLink(
  targetId: string,
  text: string = 'Skip to main content'
): HTMLElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = `
    ${SCREEN_READER_ONLY}
    focus:not-sr-only focus:absolute focus:top-4 focus:left-4
    focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white
    focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2
    focus:ring-blue-500 focus:ring-offset-2
  `
    .replace(/\s+/g, ' ')
    .trim();

  return skipLink;
}

/**
 * Color contrast helpers
 */
export function getContrastRatio(
  _foreground: string,
  _background: string
): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd convert hex/rgb to luminance values
  // This is a placeholder for demonstration
  return 4.5; // WCAG AA compliant ratio
}
