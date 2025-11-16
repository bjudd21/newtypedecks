/**
 * Validation header with score
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CardTitle } from '@/components/ui';
import { getScoreColor } from '../utils';
import type { DeckValidationSummary } from '@/lib/services/deckValidationService';

interface ValidationHeaderProps {
  validationSummary: DeckValidationSummary;
}

export const ValidationHeader: React.FC<ValidationHeaderProps> = ({
  validationSummary,
}) => {
  return (
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {validationSummary.isValid ? '✅' : '❌'}
        </motion.span>
        <span className="text-base tracking-wide text-[#a89ec7] uppercase">
          Deck Validation
        </span>
      </div>
      <motion.div
        className={`rounded-full px-3 py-1 text-sm font-bold ${getScoreColor(validationSummary.score)}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.3,
        }}
      >
        {validationSummary.score}/100
      </motion.div>
    </CardTitle>
  );
};
