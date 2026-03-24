/**
 * JSON Import Parser
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { CardSchemaCustomField } from '@/lib/types/game';
import type { ImportResult, ExportableDeck, DeckCard } from '../types';

/**
 * Import from JSON format.
 *
 * Pass `customFields` from the active game's config so that game-specific
 * properties (e.g. One Piece's color/power/counter or Gundam's faction/pilot/model)
 * are routed into `card.gameAttributes` instead of deprecated flat columns.
 */
export function importFromJSON(
  content: string,
  customFields: CardSchemaCustomField[] = []
): ImportResult {
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

      // Route game-specific fields into gameAttributes based on the game config.
      // Also carry through any gameAttributes already present in the JSON.
      const existingAttrs =
        (card.gameAttributes as Record<string, unknown>) ?? {};
      const derivedAttrs: Record<string, unknown> = {};
      for (const field of customFields) {
        if (card[field.key] !== undefined) {
          derivedAttrs[field.key] = card[field.key];
        }
      }
      const mergedAttrs = { ...existingAttrs, ...derivedAttrs };

      return {
        card: {
          id: card.id,
          name: card.name,
          cost: card.cost,
          setNumber: card.setNumber,
          type: card.type ? { name: card.type as string } : null,
          rarity: card.rarity ? { name: card.rarity as string } : null,
          set: card.set ? { name: card.set as string } : null,
          gameAttributes:
            Object.keys(mergedAttrs).length > 0 ? mergedAttrs : null,
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
