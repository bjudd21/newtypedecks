/**
 * Statistics Calculation for Decks
 *
 * The `colors` field is derived from `gameAttributes.faction` — the primary
 * grouping field for Gundam. For other games the same key would be whatever
 * their grouping concept is (e.g. One Piece uses `color`). Both are stored in
 * `gameAttributes` JSONB. `faction` is used here as the grouping key because
 * it is the first customField for Gundam; the deck statistics endpoint can be
 * extended to accept a `groupingField` param per game if needed in the future.
 */

interface DeckCard {
  quantity: number;
  card: {
    cost?: number | null;
    gameAttributes?: unknown;
  };
}

/**
 * Extract the primary grouping value (faction/color) from a card's
 * gameAttributes JSONB. Tries `faction` first (Gundam), then `color`
 * (One Piece), so the `colors` summary works for both games without requiring
 * the caller to know which game is active.
 */
function extractGroupingValue(attrs: unknown): string | undefined {
  if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs))
    return undefined;
  const obj = attrs as Record<string, unknown>;
  const value = obj.faction ?? obj.color;
  return typeof value === 'string' ? value : undefined;
}

export function calculateDeckStatistics(cards: DeckCard[]) {
  const totalCards = cards.reduce((sum, dc) => sum + dc.quantity, 0);
  const uniqueCards = cards.length;
  const totalCost = cards.reduce(
    (sum, dc) => sum + (dc.card.cost || 0) * dc.quantity,
    0
  );
  const averageCost = totalCards > 0 ? totalCost / totalCards : 0;

  return {
    totalCards,
    uniqueCards,
    totalCost,
    averageCost: Math.round(averageCost * 100) / 100,
    colors: [
      ...new Set(
        cards
          .map((dc) => extractGroupingValue(dc.card.gameAttributes))
          .filter(Boolean)
      ),
    ],
  };
}
