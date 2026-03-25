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
      <h4 className="text-primary/80 text-sm font-semibold tracking-wide uppercase">
        Suggestions
      </h4>
      <div className="border-border bg-background/50 rounded-lg border p-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="text-foreground flex items-start gap-2 py-1 text-sm"
          >
            <span className="text-primary mt-0.5">💡</span>
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
