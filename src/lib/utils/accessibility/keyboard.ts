/**
 * Keyboard navigation utilities
 */

import { KEYBOARD_CODES } from './constants';

/**
 * Handle keyboard navigation for interactive elements
 */
export function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void,
  keys: string[] = [KEYBOARD_CODES.ENTER, KEYBOARD_CODES.SPACE]
): void {
  if (keys.includes(event.code) || keys.includes(event.key)) {
    event.preventDefault();
    callback();
  }
}
