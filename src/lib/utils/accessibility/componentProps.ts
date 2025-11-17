/**
 * Component-specific ARIA props generators
 */

import { generateId } from './idGenerator';

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
export function getNavItemProps(
  href: string,
  isActive: boolean,
  label?: string
) {
  return {
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-label': label,
  };
}

/**
 * Accessible list and table props
 */
export function getListProps(label: string, description?: string) {
  const props: Record<string, unknown> = {
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
export function getCardImageProps(
  cardName: string,
  size?: string,
  isInteractive?: boolean
) {
  const alt = `${cardName} card image${size ? ` (${size})` : ''}`;

  const props: Record<string, unknown> = {
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
