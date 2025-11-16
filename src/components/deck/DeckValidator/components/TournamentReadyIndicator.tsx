/**
 * Tournament ready indicator component
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { DeckValidationSummary } from '@/lib/services/deckValidationService';

interface TournamentReadyIndicatorProps {
  validationSummary: DeckValidationSummary;
}

export const TournamentReadyIndicator: React.FC<
  TournamentReadyIndicatorProps
> = ({ validationSummary }) => {
  if (!validationSummary.isValid || validationSummary.score < 80) {
    return null;
  }

  return (
    <motion.div
      className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-900/20 to-green-800/20 p-4 text-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="mb-1 text-sm font-bold text-green-300"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        🏆 Tournament Ready!
      </motion.div>
      <div className="text-xs text-green-400">
        Your deck meets all major requirements for competitive play
      </div>
    </motion.div>
  );
};
