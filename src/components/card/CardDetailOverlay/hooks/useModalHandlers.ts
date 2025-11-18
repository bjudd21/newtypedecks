'use client';
/**
 * Custom hook for modal event handlers
 */

import { useCallback } from 'react';

interface UseModalHandlersOptions {
  onClose: () => void;
}

export function useModalHandlers({ onClose }: UseModalHandlersOptions) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  return {
    handleBackdropClick,
    handleKeyDown,
  };
}
