/**
 * DragOverlay - Animated overlay shown during drag over
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DragOverlayProps {
  isDragOver: boolean;
  isActive: boolean;
  draggedCardName: string;
  title: string;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({
  isDragOver,
  isActive,
  draggedCardName,
  title,
}) => {
  return (
    <AnimatePresence>
      {isDragOver && isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="border-primary from-primary/20 to-primary/10 absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed bg-gradient-to-br backdrop-blur-sm"
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
            <div className="text-primary/80 text-lg font-semibold">
              Drop {draggedCardName && `'${draggedCardName}'`} here
            </div>
            <div className="text-primary mt-2 text-sm">
              Add to {title.toLowerCase()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
