/**
 * Accessibility utilities and helpers
 * Provides functions and constants for improving website accessibility
 */

// Screen reader only class utility
export const SCREEN_READER_ONLY = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Generate unique IDs for form elements and ARIA relationships
 */
let idCounter = 0;
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

/**
 * Keyboard navigation helpers
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

/**
 * Focus management utilities
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);

  // Focus the first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * ARIA live region announcements
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
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
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = `
    ${SCREEN_READER_ONLY}
    focus:not-sr-only focus:absolute focus:top-4 focus:left-4
    focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white
    focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2
    focus:ring-blue-500 focus:ring-offset-2
  `.replace(/\s+/g, ' ').trim();

  return skipLink;
}

/**
 * Color contrast helpers
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd convert hex/rgb to luminance values
  // This is a placeholder for demonstration
  return 4.5; // WCAG AA compliant ratio
}

/**
 * Focus visible utilities
 */
export function addFocusVisibleSupport(): void {
  // Add focus-visible polyfill support
  let hadKeyboardEvent = true;
  const keyboardThrottleTimeout = 100;

  function onPointerDown() {
    hadKeyboardEvent = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }
    hadKeyboardEvent = true;
  }

  function onFocus(e: FocusEvent) {
    if (hadKeyboardEvent || (e.target as HTMLElement).matches(':focus-visible')) {
      (e.target as HTMLElement).classList.add('focus-visible');
    }
  }

  function onBlur(e: FocusEvent) {
    (e.target as HTMLElement).classList.remove('focus-visible');
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
}

/**
 * Accessible form validation messages
 */
export interface AccessibleFormField {
  id: string;
  labelId?: string;
  errorId?: string;
  describedBy?: string[];
}

export function createAccessibleFormField(fieldName: string): AccessibleFormField {
  const baseId = generateId(fieldName);
  return {
    id: baseId,
    labelId: `${baseId}-label`,
    errorId: `${baseId}-error`,
    describedBy: [],
  };
}

export function getAriaDescribedBy(field: AccessibleFormField, hasError?: boolean): string | undefined {
  const describedBy = field.describedBy ? [...field.describedBy] : [];

  if (hasError && field.errorId) {
    describedBy.push(field.errorId);
  }

  return describedBy.length > 0 ? describedBy.join(' ') : undefined;
}

/**
 * Accessible modal/dialog utilities
 */
export interface ModalA11yProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  descriptionId?: string;
  initialFocus?: React.RefObject<HTMLElement>;
}

export function getModalA11yProps(props: ModalA11yProps) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': props.titleId,
    'aria-describedby': props.descriptionId,
  };
}

/**
 * Accessible button props for icon-only buttons
 */
export function getIconButtonProps(label: string, description?: string) {
  const baseProps = {
    'aria-label': label,
  };

  if (description) {
    const descId = generateId('btn-desc');
    return {
      ...baseProps,
      'aria-describedby': descId,
      'data-description': description,
      'data-description-id': descId,
    };
  }

  return baseProps;
}

/**
 * Accessible navigation props
 */
export function getNavItemProps(href: string, isActive: boolean, label?: string) {
  return {
    'aria-current': isActive ? 'page' as const : undefined,
    'aria-label': label,
  };
}

/**
 * Accessible list and table props
 */
export function getListProps(label: string, description?: string) {
  const props: Record<string, any> = {
    role: 'list',
    'aria-label': label,
  };

  if (description) {
    const descId = generateId('list-desc');
    props['aria-describedby'] = descId;
    props['data-description'] = description;
    props['data-description-id'] = descId;
  }

  return props;
}

/**
 * Card image accessibility props
 */
export function getCardImageProps(cardName: string, size?: string, isInteractive?: boolean) {
  const alt = `${cardName} card image${size ? ` (${size})` : ''}`;

  const props: Record<string, any> = {
    alt,
    role: isInteractive ? 'button' : 'img',
  };

  if (isInteractive) {
    props['aria-label'] = `View ${cardName} card image in full size`;
    props['tabIndex'] = 0;
  }

  return props;
}

/**
 * Loading state accessibility
 */
export function getLoadingProps(label: string = 'Loading content') {
  return {
    'aria-live': 'polite' as const,
    'aria-label': label,
    role: 'status',
  };
}

/**
 * Error state accessibility
 */
export function getErrorProps(error: string) {
  return {
    'aria-live': 'assertive' as const,
    'aria-label': `Error: ${error}`,
    role: 'alert',
  };
}

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