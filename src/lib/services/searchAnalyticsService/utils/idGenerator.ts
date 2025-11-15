/**
 * ID Generation Utilities
 */

/**
 * Generate a unique event ID
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
