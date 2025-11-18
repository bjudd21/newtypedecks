'use client';
/**
 * Custom hook for drag event handlers
 */

import { useCallback } from 'react';
import type { DragData } from '../types';

interface UseDragHandlersOptions {
  isActive: boolean;
  accept: string[];
  setIsDragOver: (value: boolean) => void;
  setDraggedCardName: (name: string) => void;
  onCardDrop: (cardId: string, action: 'move' | 'copy') => void;
}

export function useDragHandlers({
  isActive,
  accept,
  setIsDragOver,
  setDraggedCardName,
  onCardDrop,
}: UseDragHandlersOptions) {
  // Handle drag enter
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (!isActive) return;

      e.preventDefault();
      e.stopPropagation();
    },
    [isActive]
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!isActive) return;

      e.preventDefault();
      e.stopPropagation();

      // Check if the dragged data is something we can accept
      const hasAcceptableType = accept.some((type) =>
        e.dataTransfer.types.includes(type)
      );

      if (hasAcceptableType) {
        setIsDragOver(true);
        e.dataTransfer.dropEffect = 'move';

        // Try to get card name for visual feedback
        try {
          const data = e.dataTransfer.getData('application/json');
          if (data) {
            const dragData: DragData = JSON.parse(data);
            setDraggedCardName(dragData.cardName);
          }
        } catch {
          // Ignore parse errors during drag over
        }
      } else {
        e.dataTransfer.dropEffect = 'none';
      }
    },
    [isActive, accept, setIsDragOver, setDraggedCardName]
  );

  // Handle drag leave
  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (!isActive) return;

      e.preventDefault();
      e.stopPropagation();

      // Only set drag over to false if leaving the drop zone completely
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (
        x < rect.left ||
        x >= rect.right ||
        y < rect.top ||
        y >= rect.bottom
      ) {
        setIsDragOver(false);
        setDraggedCardName('');
      }
    },
    [isActive, setIsDragOver, setDraggedCardName]
  );

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (!isActive) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setDraggedCardName('');

      try {
        const data = e.dataTransfer.getData('application/json');
        if (data) {
          const dragData: DragData = JSON.parse(data);
          onCardDrop(dragData.cardId, dragData.action);
        }
      } catch (error) {
        console.error('Error processing dropped data:', error);
      }
    },
    [isActive, onCardDrop, setIsDragOver, setDraggedCardName]
  );

  return {
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
