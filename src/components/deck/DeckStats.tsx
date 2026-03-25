/**
 * DeckStats Component
 * Displays deck statistics (total cards, unique cards, total cost)
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DeckStatsProps {
  totalCards: number;
  uniqueCards: number;
  totalCost: number;
}

export const DeckStats: React.FC<DeckStatsProps> = ({
  totalCards,
  uniqueCards,
  totalCost,
}) => {
  return (
    <motion.div
      className="mt-6 grid grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        className="border-border from-card to-accent hover:shadow-primary/20 rounded-xl border bg-gradient-to-br p-5 text-center shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="text-foreground text-2xl font-semibold">
          {totalCards}
        </div>
        <div className="text-muted-foreground mt-2 text-sm font-medium">
          Total Cards
        </div>
      </motion.div>

      <motion.div
        className="border-border from-card to-accent hover:shadow-primary/20 rounded-xl border bg-gradient-to-br p-5 text-center shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ delay: 0.05 }}
      >
        <div className="text-foreground text-2xl font-semibold">
          {uniqueCards}
        </div>
        <div className="text-muted-foreground mt-2 text-sm font-medium">
          Unique Cards
        </div>
      </motion.div>

      <motion.div
        className="border-border from-card to-accent hover:shadow-primary/20 rounded-xl border bg-gradient-to-br p-5 text-center shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-foreground text-2xl font-semibold">
          {totalCost}
        </div>
        <div className="text-muted-foreground mt-2 text-sm font-medium">
          Total Cost
        </div>
      </motion.div>
    </motion.div>
  );
};
