/**
 * EmptyState - Empty state display with animated icon
 */

import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  show: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="text-muted-foreground/70 absolute inset-0 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.svg
          className="text-primary/30 mx-auto mb-3 h-16 w-16"
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
        <div className="text-muted-foreground text-sm font-medium">
          Drag cards here or use search
        </div>
      </motion.div>
    </div>
  );
};
