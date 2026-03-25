/**
 * EmptyDeckState Component
 * Displays animated empty state when deck has no cards
 */

import React from 'react';
import { motion } from 'framer-motion';

export const EmptyDeckState: React.FC = () => {
  return (
    <motion.div
      className="py-12 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.svg
        className="text-primary/30 mx-auto mb-4 h-20 w-20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </motion.svg>
      <p className="text-primary/80 mb-2 text-xl font-semibold">
        Your deck is empty
      </p>
      <p className="text-muted-foreground">
        Start by searching for cards to add
      </p>
    </motion.div>
  );
};
