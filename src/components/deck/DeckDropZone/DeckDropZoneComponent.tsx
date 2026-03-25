/**
 * DeckDropZoneComponent - Main component orchestrator
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDragState } from './hooks/useDragState';
import { useDragHandlers } from './hooks/useDragHandlers';
import { DropZoneContent } from './ui/DropZoneContent';
import { DragOverlay } from './ui/DragOverlay';
import { EmptyState } from './ui/EmptyState';
import type { DeckDropZoneProps } from './types';

export const DeckDropZoneComponent: React.FC<DeckDropZoneProps> = ({
  onCardDrop,
  accept = ['application/json'],
  title,
  description,
  isActive = true,
  children,
  className = '',
  minHeight = 200,
}) => {
  // State management
  const { isDragOver, setIsDragOver, draggedCardName, setDraggedCardName } =
    useDragState();

  // Drag handlers
  const { handleDragEnter, handleDragOver, handleDragLeave, handleDrop } =
    useDragHandlers({
      isActive,
      accept,
      setIsDragOver,
      setDraggedCardName,
      onCardDrop,
    });

  return (
    <motion.div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed transition-all duration-300',
        {
          'border-primary bg-primary/10 shadow-primary/20 shadow-lg':
            isDragOver && isActive,
          'border-border hover:border-primary/50': !isDragOver && isActive,
          'border-border/30 opacity-50': !isActive,
        },
        className
      )}
      style={{ minHeight: `${minHeight}px` }}
      animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Drop zone content */}
      <DropZoneContent title={title} description={description}>
        {children}
      </DropZoneContent>

      {/* Drag overlay */}
      <DragOverlay
        isDragOver={isDragOver}
        isActive={isActive}
        draggedCardName={draggedCardName}
        title={title}
      />

      {/* Empty state */}
      <EmptyState show={!children && !isDragOver} />
    </motion.div>
  );
};

export default DeckDropZoneComponent;
