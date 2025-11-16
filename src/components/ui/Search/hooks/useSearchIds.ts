/**
 * Hook for generating unique search IDs for accessibility
 */

import { useId } from 'react';

export function useSearchIds() {
  const baseId = useId();

  return {
    inputId: `search-input-${baseId}`,
    listboxId: `search-listbox-${baseId}`,
    labelId: `search-label-${baseId}`,
    errorId: `search-error-${baseId}`,
  };
}
