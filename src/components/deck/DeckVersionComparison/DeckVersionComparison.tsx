/**
 * Deck version comparison component - main orchestrator
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useVersionComparison } from './hooks/useVersionComparison';
import { ComparisonHeader } from './components/ComparisonHeader';
import { SummaryStatistics } from './components/SummaryStatistics';
import { ChangeSection } from './components/ChangeSection';
import { UnchangedCardsSection } from './components/UnchangedCardsSection';
import type { DeckVersionComparisonProps } from './types';

export const DeckVersionComparison: React.FC<DeckVersionComparisonProps> = ({
  versionA,
  versionB,
  className,
}) => {
  const { changes, addedCards, removedCards, modifiedCards, unchangedCards } =
    useVersionComparison(versionA, versionB);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Version Comparison</CardTitle>
          <ComparisonHeader versionA={versionA} versionB={versionB} />
        </CardHeader>
        <CardContent>
          {/* Summary Statistics */}
          <SummaryStatistics
            addedCount={addedCards.length}
            removedCount={removedCards.length}
            modifiedCount={modifiedCards.length}
            unchangedCount={unchangedCards.length}
          />

          {/* Detailed Changes */}
          {changes.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No changes between these versions.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Added Cards */}
              <ChangeSection
                title="Added Cards"
                icon="➕"
                titleColor="text-green-700"
                changes={addedCards}
              />

              {/* Removed Cards */}
              <ChangeSection
                title="Removed Cards"
                icon="➖"
                titleColor="text-red-700"
                changes={removedCards}
              />

              {/* Modified Cards */}
              <ChangeSection
                title="Modified Cards"
                icon="🔄"
                titleColor="text-yellow-700"
                changes={modifiedCards}
                showModifiedQuantities={true}
              />

              {/* Unchanged Cards */}
              <UnchangedCardsSection unchangedCards={unchangedCards} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckVersionComparison;
