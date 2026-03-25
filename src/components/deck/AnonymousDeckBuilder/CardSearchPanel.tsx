/**
 * CardSearchPanel Component
 * Card search interface with instructions
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DeckCardSearch } from '../DeckCardSearch';
import type { CardWithRelations } from '@/lib/types/card';

interface CardSearchPanelProps {
  onCardSelect: (card: CardWithRelations) => void;
  onSearchResults: (cards: CardWithRelations[]) => void;
}

export const CardSearchPanel: React.FC<CardSearchPanelProps> = ({
  onCardSelect,
  onSearchResults,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80 text-lg">ADD CARDS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DeckCardSearch
            onCardSelect={onCardSelect}
            onSearchResults={onSearchResults}
            placeholder="Search cards to add to deck..."
            showFilters={false}
            limit={10}
          />
          <div className="border-border/30 bg-background/50 text-muted-foreground rounded-lg border p-3 text-sm">
            Click or drag cards to add them to your deck. All changes are saved
            automatically to your browser.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
