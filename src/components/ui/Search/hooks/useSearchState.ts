'use client';
/**
 * Hook for managing search state
 */

import { useState } from 'react';

export function useSearchState() {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const resetHighlight = () => setHighlightedIndex(-1);
  const closeDropdown = () => {
    setIsOpen(false);
    resetHighlight();
  };

  return {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    resetHighlight,
    closeDropdown,
  };
}
