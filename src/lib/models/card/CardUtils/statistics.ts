/**
 * Card statistics calculation utilities
 */

import type { CardWithRelations } from '../../../types/card';

/**
 * Calculate card statistics
 */
export function calculateStats(cards: CardWithRelations[]) {
  const stats = {
    total: cards.length,
    byType: {} as Record<string, number>,
    byRarity: {} as Record<string, number>,
    byFaction: {} as Record<string, number>,
    bySeries: {} as Record<string, number>,
    averageLevel: 0,
    averageCost: 0,
    averageClashPoints: 0,
    averagePrice: 0,
    averageHitPoints: 0,
    averageAttackPoints: 0,
  };

  let levelSum = 0,
    levelCount = 0;
  let costSum = 0,
    costCount = 0;
  let clashPointsSum = 0,
    clashPointsCount = 0;
  let priceSum = 0,
    priceCount = 0;
  let hitPointsSum = 0,
    hitPointsCount = 0;
  let attackPointsSum = 0,
    attackPointsCount = 0;

  for (const card of cards) {
    // Count by type
    const typeName = card.type.name;
    stats.byType[typeName] = (stats.byType[typeName] || 0) + 1;

    // Count by rarity
    const rarityName = card.rarity.name;
    stats.byRarity[rarityName] = (stats.byRarity[rarityName] || 0) + 1;

    // Count by faction
    if (card.faction) {
      stats.byFaction[card.faction] =
        (stats.byFaction[card.faction] || 0) + 1;
    }

    // Count by series
    if (card.series) {
      stats.bySeries[card.series] = (stats.bySeries[card.series] || 0) + 1;
    }

    // Sum numeric values for averages
    if (card.level !== null && card.level !== undefined) {
      levelSum += card.level;
      levelCount++;
    }
    if (card.cost !== null && card.cost !== undefined) {
      costSum += card.cost;
      costCount++;
    }
    if (card.clashPoints !== null && card.clashPoints !== undefined) {
      clashPointsSum += card.clashPoints;
      clashPointsCount++;
    }
    if (card.price !== null && card.price !== undefined) {
      priceSum += card.price;
      priceCount++;
    }
    if (card.hitPoints !== null && card.hitPoints !== undefined) {
      hitPointsSum += card.hitPoints;
      hitPointsCount++;
    }
    if (card.attackPoints !== null && card.attackPoints !== undefined) {
      attackPointsSum += card.attackPoints;
      attackPointsCount++;
    }
  }

  // Calculate averages
  stats.averageLevel =
    levelCount > 0 ? Math.round((levelSum / levelCount) * 100) / 100 : 0;
  stats.averageCost =
    costCount > 0 ? Math.round((costSum / costCount) * 100) / 100 : 0;
  stats.averageClashPoints =
    clashPointsCount > 0
      ? Math.round((clashPointsSum / clashPointsCount) * 100) / 100
      : 0;
  stats.averagePrice =
    priceCount > 0 ? Math.round((priceSum / priceCount) * 100) / 100 : 0;
  stats.averageHitPoints =
    hitPointsCount > 0
      ? Math.round((hitPointsSum / hitPointsCount) * 100) / 100
      : 0;
  stats.averageAttackPoints =
    attackPointsCount > 0
      ? Math.round((attackPointsSum / attackPointsCount) * 100) / 100
      : 0;

  return stats;
}
