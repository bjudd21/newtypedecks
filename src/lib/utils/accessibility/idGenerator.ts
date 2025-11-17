/**
 * ID generation utilities for form elements and ARIA relationships
 */

let idCounter = 0;

/**
 * Generate unique IDs for form elements and ARIA relationships
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}
