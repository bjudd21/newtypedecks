'use client';
/**
 * Hook for handling image interactions
 */

import { useCallback } from 'react';
import { handleKeyboardActivation } from '@/lib/utils/accessibility';

interface UseImageHandlersOptions {
  onClick?: () => void;
  clickToZoom: boolean;
  hasError: boolean;
  openZoom: () => void;
}

export function useImageHandlers({
  onClick,
  clickToZoom,
  hasError,
  openZoom,
}: UseImageHandlersOptions) {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (clickToZoom && !hasError) {
      openZoom();
    }
  }, [onClick, clickToZoom, hasError, openZoom]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      handleKeyboardActivation(event, handleClick);
    },
    [handleClick]
  );

  return {
    handleClick,
    handleKeyDown,
  };
}
