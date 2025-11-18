'use client';
/**
 * Hook for handling click outside
 */

import { useEffect, RefObject } from 'react';

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, onOutsideClick]);
}
