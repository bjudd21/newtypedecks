/**
 * Validation results list component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import { getSeverityDisplay } from '../utils';
import type { ValidationResult } from '@/lib/services/deckValidationService';

interface ValidationResultsListProps {
  results: ValidationResult[];
  onlyErrors: boolean;
}

export const ValidationResultsList: React.FC<ValidationResultsListProps> = ({
  results,
  onlyErrors,
}) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-primary/80 text-sm font-semibold tracking-wide uppercase">
        {onlyErrors ? 'Errors' : 'Validation Results'}
      </h4>

      {results.map((result, index) => {
        const { icon, color } = getSeverityDisplay(result.rule.severity);

        return (
          <motion.div
            key={result.rule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-lg border p-3 ${color}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{result.rule.name}</div>
                <div className="mt-1 text-sm">{result.message}</div>
                {result.details && (
                  <div className="mt-2 text-xs opacity-75">
                    {result.details}
                  </div>
                )}
              </div>
              <Badge
                variant="secondary"
                className="border-primary/30 bg-primary/20 text-primary/80 ml-2 text-xs"
              >
                {result.rule.category}
              </Badge>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
