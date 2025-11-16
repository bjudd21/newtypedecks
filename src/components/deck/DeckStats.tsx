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
        className="rounded-xl border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050] p-5 text-center shadow-lg transition-all duration-300 hover:shadow-[#8b7aaa]/20"
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="bg-gradient-to-r from-[#8b7aaa] to-[#a89ec7] bg-clip-text text-3xl font-bold text-transparent">
          {totalCards}
        </div>
        <div className="mt-2 text-sm font-medium text-gray-400">
          Total Cards
        </div>
      </motion.div>

      <motion.div
        className="rounded-xl border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050] p-5 text-center shadow-lg transition-all duration-300 hover:shadow-[#8b7aaa]/20"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ delay: 0.05 }}
      >
        <div className="bg-gradient-to-r from-[#8b7aaa] to-[#a89ec7] bg-clip-text text-3xl font-bold text-transparent">
          {uniqueCards}
        </div>
        <div className="mt-2 text-sm font-medium text-gray-400">
          Unique Cards
        </div>
      </motion.div>

      <motion.div
        className="rounded-xl border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050] p-5 text-center shadow-lg transition-all duration-300 hover:shadow-[#8b7aaa]/20"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-[#8b7aaa] to-[#a89ec7] bg-clip-text text-3xl font-bold text-transparent">
          {totalCost}
        </div>
        <div className="mt-2 text-sm font-medium text-gray-400">Total Cost</div>
      </motion.div>
    </motion.div>
  );
};
