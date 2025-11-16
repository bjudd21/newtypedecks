/**
 * Suggestions section component
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SuggestionsSectionProps {
  suggestions: string[];
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  suggestions,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h4 className="text-sm font-semibold tracking-wide text-[#a89ec7] uppercase">
        Suggestions
      </h4>
      <div className="rounded-lg border border-[#443a5c] bg-[#1a1625]/50 p-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-start gap-2 py-1 text-sm text-gray-300"
          >
            <span className="mt-0.5 text-[#8b7aaa]">💡</span>
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
