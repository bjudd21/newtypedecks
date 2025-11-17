/**
 * Focus management utilities
 */

/**
 * Trap focus within an element (useful for modals and dialogs)
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
 * Add focus-visible polyfill support
 */
export function addFocusVisibleSupport(): void {
  // Add focus-visible polyfill support
  let hadKeyboardEvent = true;
  const _keyboardThrottleTimeout = 100; // Reserved for future throttle implementation

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
    if (
      hadKeyboardEvent ||
      (e.target as HTMLElement).matches(':focus-visible')
    ) {
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
