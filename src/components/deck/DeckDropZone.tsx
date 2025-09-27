'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DragData {
  cardId: string;
  cardName: string;
  action: 'move' | 'copy';
}

interface DeckDropZoneProps {
  onCardDrop: (cardId: string, action: 'move' | 'copy') => void;
  accept?: string[];
  title: string;
  description?: string;
  isActive?: boolean;
  children?: React.ReactNode;
  className?: string;
  minHeight?: number;
}

export const DeckDropZone: React.FC<DeckDropZoneProps> = ({
  onCardDrop,
  accept = ['application/json'],
  title,
  description,
  isActive = true,
  children,
  className = '',
  minHeight = 200
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedCardName, setDraggedCardName] = useState<string>('');

  // Handle drag enter
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (!isActive) return;

    e.preventDefault();
    e.stopPropagation();
  }, [isActive]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!isActive) return;

    e.preventDefault();
    e.stopPropagation();

    // Check if the dragged data is something we can accept
    const hasAcceptableType = accept.some(type =>
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
  }, [isActive, accept]);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
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
  }, [isActive]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, [isActive, onCardDrop]);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-all duration-200',
        {
          'border-blue-300 bg-blue-50': isDragOver && isActive,
          'border-gray-300': !isDragOver && isActive,
          'border-gray-200 opacity-50': !isActive,
        },
        className
      )}
      style={{ minHeight: `${minHeight}px` }}
    >
      {/* Drop zone content */}
      <div className="p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          {title}
        </div>

        {description && (
          <div className="text-xs text-gray-500 mb-4">
            {description}
          </div>
        )}

        {children}
      </div>

      {/* Drag overlay */}
      {isDragOver && isActive && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-blue-600 font-medium">
              Drop {draggedCardName && `"${draggedCardName}"`} here
            </div>
            <div className="text-blue-500 text-sm mt-1">
              Add to {title.toLowerCase()}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!children && !isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-sm">
              Drag cards here or use search
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckDropZone;