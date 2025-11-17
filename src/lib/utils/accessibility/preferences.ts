/**
 * User accessibility preferences detection
 */

/**
 * High contrast mode detection
 */
export function isHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for Windows high contrast mode
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    return true;
  }

  // Check for forced colors (Windows high contrast mode)
  if (window.matchMedia('(forced-colors: active)').matches) {
    return true;
  }

  return false;
}

/**
 * Reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
