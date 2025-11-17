/**
 * Accessible form validation and field utilities
 */

import { generateId } from './idGenerator';

/**
 * Accessible form field configuration
 */
export interface AccessibleFormField {
  id: string;
  labelId?: string;
  errorId?: string;
  describedBy?: string[];
}

/**
 * Create accessible form field with generated IDs
 */
export function createAccessibleFormField(
  fieldName: string
): AccessibleFormField {
  const baseId = generateId(fieldName);
  return {
    id: baseId,
    labelId: `${baseId}-label`,
    errorId: `${baseId}-error`,
    describedBy: [],
  };
}

/**
 * Get aria-describedby attribute value
 */
export function getAriaDescribedBy(
  field: AccessibleFormField,
  hasError?: boolean
): string | undefined {
  const describedBy = field.describedBy ? [...field.describedBy] : [];

  if (hasError && field.errorId) {
    describedBy.push(field.errorId);
  }

  return describedBy.length > 0 ? describedBy.join(' ') : undefined;
}
