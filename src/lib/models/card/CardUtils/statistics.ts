/**
 * Card statistics calculation utilities
 */

import type { CardWithRelations } from '../../../types/card';

/**
 * Calculate category distributions (type, rarity, faction, series)
 */
function calculateCategoryDistributions(cards: CardWithRelations[]) {
  const byType: Record<string, number> = {};
  const byRarity: Record<string, number> = {};
  const byFaction: Record<string, number> = {};
  const bySeries: Record<string, number> = {};

  for (const card of cards) {
    // Count by type
    const typeName = card.type.name;
    byType[typeName] = (byType[typeName] || 0) + 1;

    // Count by rarity
    const rarityName = card.rarity.name;
    byRarity[rarityName] = (byRarity[rarityName] || 0) + 1;

    // Count by faction
    if (card.faction) {
      byFaction[card.faction] = (byFaction[card.faction] || 0) + 1;
    }

    // Count by series
    if (card.series) {
      bySeries[card.series] = (bySeries[card.series] || 0) + 1;
    }
  }

  return { byType, byRarity, byFaction, bySeries };
}

/**
 * Accumulate numeric values for a specific field
 */
function accumulateNumericField(
  cards: CardWithRelations[],
  fieldName: keyof CardWithRelations
): { sum: number; count: number } {
  let sum = 0;
  let count = 0;

  for (const card of cards) {
    const value = card[fieldName];
    if (value !== null && value !== undefined && typeof value === 'number') {
      sum += value;
      count++;
    }
  }

  return { sum, count };
}

/**
 * Calculate average from sum and count
 */
function calculateAverage(sum: number, count: number): number {
  return count > 0 ? Math.round((sum / count) * 100) / 100 : 0;
}

/**
 * Calculate numeric field averages
 */
function calculateNumericAverages(cards: CardWithRelations[]) {
  const level = accumulateNumericField(cards, 'level');
  const cost = accumulateNumericField(cards, 'cost');
  const clashPoints = accumulateNumericField(cards, 'clashPoints');
  const price = accumulateNumericField(cards, 'price');
  const hitPoints = accumulateNumericField(cards, 'hitPoints');
  const attackPoints = accumulateNumericField(cards, 'attackPoints');

  return {
    averageLevel: calculateAverage(level.sum, level.count),
    averageCost: calculateAverage(cost.sum, cost.count),
    averageClashPoints: calculateAverage(clashPoints.sum, clashPoints.count),
    averagePrice: calculateAverage(price.sum, price.count),
    averageHitPoints: calculateAverage(hitPoints.sum, hitPoints.count),
    averageAttackPoints: calculateAverage(attackPoints.sum, attackPoints.count),
  };
}

/**
 * Calculate card statistics
 */
export function calculateStats(cards: CardWithRelations[]) {
  const distributions = calculateCategoryDistributions(cards);
  const averages = calculateNumericAverages(cards);

  return {
    total: cards.length,
    ...distributions,
    ...averages,
  };
}
