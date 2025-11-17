/**
 * Accessibility utilities and helpers
 * Main exports from modularized structure
 */

// Constants
export { SCREEN_READER_ONLY, KEYBOARD_CODES } from './constants';

// ID generation
export { generateId } from './idGenerator';

// Keyboard navigation
export { handleKeyboardActivation } from './keyboard';

// Focus management
export { trapFocus, addFocusVisibleSupport } from './focus';

// Screen reader announcements
export {
  announceToScreenReader,
  createSkipLink,
  getContrastRatio,
} from './announcements';

// Forms
export type { AccessibleFormField } from './forms';
export { createAccessibleFormField, getAriaDescribedBy } from './forms';

// Modals
export type { ModalA11yProps } from './modal';
export { getModalA11yProps } from './modal';

// Component props
export {
  getIconButtonProps,
  getNavItemProps,
  getListProps,
  getCardImageProps,
  getLoadingProps,
  getErrorProps,
} from './componentProps';

// User preferences
export { isHighContrastMode, prefersReducedMotion } from './preferences';
