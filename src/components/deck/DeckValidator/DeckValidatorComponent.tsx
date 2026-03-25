/**
 * DeckValidator - Main component for deck validation
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { useValidation } from './hooks/useValidation';
import { EmptyState } from './components/EmptyState';
import { ValidationHeader } from './components/ValidationHeader';
import { SummaryBadges } from './components/SummaryBadges';
import { ValidationResultsList } from './components/ValidationResultsList';
import { SuggestionsSection } from './components/SuggestionsSection';
import { QuickStats } from './components/QuickStats';
import { TournamentReadyIndicator } from './components/TournamentReadyIndicator';
import type { DeckValidatorProps } from './types';

export const DeckValidatorComponent: React.FC<DeckValidatorProps> = ({
  cards,
  className = '',
  showDetails = true,
  onlyErrors = false,
  ruleset = 'COMPETITIVE',
}) => {
  const { validationSummary, suggestions, displayResults } = useValidation({
    cards,
    onlyErrors,
    ruleset,
  });

  // Empty state
  if (cards.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <Card className={`${className} border-border bg-card`}>
      <CardHeader>
        <ValidationHeader validationSummary={validationSummary} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <SummaryBadges validationSummary={validationSummary} />

          {/* Validation Results */}
          {showDetails && (
            <ValidationResultsList
              results={displayResults}
              onlyErrors={onlyErrors}
            />
          )}

          {/* Suggestions */}
          {showDetails && <SuggestionsSection suggestions={suggestions} />}

          {/* Quick Stats */}
          <QuickStats cards={cards} />

          {/* Tournament Ready / Casual Mode Indicator */}
          {ruleset === 'CASUAL' ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-900/20 p-4 text-center">
              <div className="text-sm font-bold text-amber-300">
                Casual Mode
              </div>
              <div className="text-xs text-amber-400">
                Validation issues are shown as warnings only — deck saves freely
              </div>
            </div>
          ) : (
            <TournamentReadyIndicator validationSummary={validationSummary} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckValidatorComponent;
