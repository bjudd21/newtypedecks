/**
 * Utility functions for DeckVersionComparison
 */

import type { CardChange, DeckVersion } from './types';

export const getChangeBadgeColor = (type: CardChange['type']): string => {
  switch (type) {
    case 'added':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'removed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'modified':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'unchanged':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export const calculateChanges = (
  versionA: DeckVersion,
  versionB: DeckVersion
): CardChange[] => {
  const changes: CardChange[] = [];
  const cardsA = new Map(versionA.cards.map((c) => [c.cardId, c]));
  const cardsB = new Map(versionB.cards.map((c) => [c.cardId, c]));

  // Find all unique card IDs
  const allCardIds = new Set([...cardsA.keys(), ...cardsB.keys()]);

  for (const cardId of allCardIds) {
    const cardA = cardsA.get(cardId);
    const cardB = cardsB.get(cardId);

    if (cardA && cardB) {
      // Card exists in both versions
      if (cardA.quantity !== cardB.quantity) {
        changes.push({
          type: 'modified',
          cardName: cardA.card.name,
          cardId,
          card: cardA.card,
          oldQuantity: cardA.quantity,
          newQuantity: cardB.quantity,
          category: cardB.category,
        });
      } else {
        changes.push({
          type: 'unchanged',
          cardName: cardA.card.name,
          cardId,
          card: cardA.card,
          oldQuantity: cardA.quantity,
          newQuantity: cardB.quantity,
          category: cardB.category,
        });
      }
    } else if (cardA && !cardB) {
      // Card removed in version B
      changes.push({
        type: 'removed',
        cardName: cardA.card.name,
        cardId,
        card: cardA.card,
        oldQuantity: cardA.quantity,
        category: cardA.category,
      });
    } else if (!cardA && cardB) {
      // Card added in version B
      changes.push({
        type: 'added',
        cardName: cardB.card.name,
        cardId,
        card: cardB.card,
        newQuantity: cardB.quantity,
        category: cardB.category,
      });
    }
  }

  // Sort by card name
  return changes.sort((a, b) => a.cardName.localeCompare(b.cardName));
};
