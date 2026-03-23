/**
 * useDeckExport Hook
 * Manages deck export functionality for multiple formats
 */

import { useCallback } from 'react';
import { deckExporter } from '@/lib/services/deckExportService';
import { useGame } from '@/contexts/GameContext';
import type { CardWithRelations } from '@/lib/types/card';

interface ExportableDeck {
  name: string;
  description: string;
  cards: Array<{
    card: CardWithRelations;
    quantity: number;
    category: string;
  }>;
  createdAt: Date;
}

type ExportFormat = 'json' | 'text' | 'csv' | 'mtga';

export function useDeckExport() {
  const game = useGame();
  const handleExport = useCallback(
    (
      currentDeck: {
        cards: Array<{
          card: CardWithRelations;
          quantity: number;
          category: string | null;
        }>;
      } | null,
      deckName: string,
      format: ExportFormat
    ) => {
      if (!currentDeck || currentDeck.cards.length === 0) return;

      const exportableDeck: ExportableDeck = {
        name: deckName,
        description: `Anonymous deck from ${game.name} Builder`,
        cards: currentDeck.cards.map((deckCard) => ({
          card: deckCard.card,
          quantity: deckCard.quantity,
          category: deckCard.category || 'main',
        })),
        createdAt: new Date(),
      };

      const options = {
        format,
        includeMetadata: true,
        includeStats: format === 'text',
        groupByType: format === 'text',
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
        gameName: game.name,
      };

      try {
        deckExporter.downloadDeck(exportableDeck, options);
      } catch (error) {
        console.error('Export failed:', error);
        console.warn(
          'TODO: Replace with proper UI notification - Export failed. Please try again.'
        );
      }
    },
    [game]
  );

  return { handleExport };
}
