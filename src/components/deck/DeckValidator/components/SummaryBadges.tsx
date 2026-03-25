/**
 * Summary badges for validation status
 */

import React from 'react';
import { Badge } from '@/components/ui';
import type { DeckValidationSummary } from '@/lib/services/deckValidationService';

interface SummaryBadgesProps {
  validationSummary: DeckValidationSummary;
}

export const SummaryBadges: React.FC<SummaryBadgesProps> = ({
  validationSummary,
}) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-primary/80 font-semibold">
          {validationSummary.isValid ? 'Valid' : 'Invalid'}
        </span>
        {validationSummary.errors.length > 0 && (
          <Badge
            variant="secondary"
            className="border-red-500/30 bg-red-500/20 text-red-300"
          >
            {validationSummary.errors.length} error
            {validationSummary.errors.length !== 1 ? 's' : ''}
          </Badge>
        )}
        {validationSummary.warnings.length > 0 && (
          <Badge
            variant="secondary"
            className="border-yellow-500/30 bg-yellow-500/20 text-yellow-300"
          >
            {validationSummary.warnings.length} warning
            {validationSummary.warnings.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    </div>
  );
};
