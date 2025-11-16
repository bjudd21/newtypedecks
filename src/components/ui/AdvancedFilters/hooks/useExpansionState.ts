/**
 * Hook for managing expansion state
 */

import { useState } from 'react';

export function useExpansionState(initialExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggle = () => setIsExpanded(!isExpanded);

  return {
    isExpanded,
    setIsExpanded,
    toggle,
  };
}
