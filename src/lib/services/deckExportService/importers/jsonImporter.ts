/**
 * JSON Import Parser
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { ImportResult, ExportableDeck, DeckCard } from '../types';

/**
 * Import from JSON format
 */
export function importFromJSON(content: string): ImportResult {
  try {
    const data = JSON.parse(content);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.name) {
      errors.push('Deck name is required');
    }

    if (!data.cards || !Array.isArray(data.cards)) {
      errors.push('Cards array is required');
    }

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    // Convert imported card data back to DeckCard format
    const cards: DeckCard[] = data.cards.map((cardData: unknown) => {
      const card = cardData as Record<string, unknown>;
      return {
        card: {
          id: card.id,
          name: card.name,
          cost: card.cost,
          setNumber: card.setNumber,
          type: card.type ? { name: card.type as string } : null,
          rarity: card.rarity ? { name: card.rarity as string } : null,
          set: card.set ? { name: card.set as string } : null,
          faction: card.faction,
          pilot: card.pilot,
          model: card.model,
        } as CardWithRelations,
        quantity: card.quantity as number,
        category: card.category as string,
      };
    });

    const deck: ExportableDeck = {
      name: data.name,
      description: data.description,
      cards,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      metadata: data.metadata,
    };

    return { success: true, deck, errors, warnings };
  } catch (_error) {
    return {
      success: false,
      errors: ['Invalid JSON format'],
      warnings: [],
    };
  }
}
