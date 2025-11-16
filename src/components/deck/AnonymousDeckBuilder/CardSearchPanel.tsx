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
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-lg text-[#a89ec7]">ADD CARDS</CardTitle>
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
          <div className="rounded-lg border border-[#443a5c]/30 bg-[#1a1625]/50 p-3 text-sm text-gray-400">
            Click or drag cards to add them to your deck. All changes are saved
            automatically to your browser.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
