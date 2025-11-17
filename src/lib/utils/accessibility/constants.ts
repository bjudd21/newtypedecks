/**
 * Accessibility constants
 */

// Screen reader only class utility
export const SCREEN_READER_ONLY =
  'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Keyboard navigation key codes
 */
export const KEYBOARD_CODES = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  TAB: 'Tab',
} as const;
