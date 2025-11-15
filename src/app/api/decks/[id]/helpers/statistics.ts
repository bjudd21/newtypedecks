/**
 * Statistics Calculation for Decks
 */

interface DeckCard {
  quantity: number;
  card: {
    cost?: number | null;
    faction?: string | null;
  };
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
    colors: [...new Set(cards.map((dc) => dc.card.faction).filter(Boolean))],
  };
}
