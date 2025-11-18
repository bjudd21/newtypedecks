'use client';
/**
 * Custom hook for filter management
 */

import { useState, useCallback } from 'react';

export function useFilters() {
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleColorFilter = useCallback((color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }, []);

  const toggleTypeFilter = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedSets([]);
  }, []);

  return {
    selectedSets,
    selectedColors,
    selectedTypes,
    toggleColorFilter,
    toggleTypeFilter,
    clearAllFilters,
  };
}
