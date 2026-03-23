'use client';
/**
 * useViewMode — persists the deck builder view mode in localStorage.
 */

import { useState, useEffect } from 'react';
import type { ViewMode } from '../ViewModeToggle';

const STORAGE_KEY = 'deckBuilderViewMode';
const VALID_MODES: ViewMode[] = ['image', 'text', 'spreadsheet'];

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>('image');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (saved && VALID_MODES.includes(saved)) {
      setViewModeState(saved);
    }
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return { viewMode, setViewMode };
}
