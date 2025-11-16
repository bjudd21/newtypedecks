/**
 * Custom hook for drag state management
 */

import { useState } from 'react';

export function useDragState() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedCardName, setDraggedCardName] = useState<string>('');

  return {
    isDragOver,
    setIsDragOver,
    draggedCardName,
    setDraggedCardName,
  };
}
