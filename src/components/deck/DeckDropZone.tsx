'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  minHeight = 200,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedCardName, setDraggedCardName] = useState<string>('');

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
    [isActive, accept]
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
    [isActive]
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
    [isActive, onCardDrop]
  );

  return (
    <motion.div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed transition-all duration-300',
        {
          'border-[#8b7aaa] bg-[#8b7aaa]/10 shadow-lg shadow-[#8b7aaa]/20':
            isDragOver && isActive,
          'border-[#443a5c] hover:border-[#8b7aaa]/50': !isDragOver && isActive,
          'border-[#443a5c]/30 opacity-50': !isActive,
        },
        className
      )}
      style={{ minHeight: `${minHeight}px` }}
      animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Drop zone content */}
      <div className="p-4">
        <div className="mb-2 text-sm font-semibold tracking-wide text-gray-400 uppercase">
          {title}
        </div>

        {description && (
          <div className="mb-4 text-xs text-gray-500">{description}</div>
        )}

        {children}
      </div>

      {/* Drag overlay */}
      <AnimatePresence>
        {isDragOver && isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-[#8b7aaa] bg-gradient-to-br from-[#8b7aaa]/20 to-[#6b5a8a]/20 backdrop-blur-sm"
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="mb-3 text-5xl"
              >
                📥
              </motion.div>
              <div className="text-lg font-semibold text-[#a89ec7]">
                Drop {draggedCardName && `'${draggedCardName}'`} here
              </div>
              <div className="mt-2 text-sm text-[#8b7aaa]">
                Add to {title.toLowerCase()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!children && !isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.svg
              className="mx-auto mb-3 h-16 w-16 text-[#8b7aaa]/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </motion.svg>
            <div className="text-sm font-medium text-gray-400">
              Drag cards here or use search
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DeckDropZone;
