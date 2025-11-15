/**
 * Faction Consistency Validator
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Faction consistency validation
 */
export function validateFactionConsistency(
  rule: ValidationRule,
  cards: DeckCard[]
): ValidationResult {
  const factionCounts: Record<string, number> = {};
  let totalCards = 0;

  for (const deckCard of cards) {
    const faction = deckCard.card.faction || 'Neutral';
    factionCounts[faction] =
      (factionCounts[faction] || 0) + deckCard.quantity;
    totalCards += deckCard.quantity;
  }

  const factions = Object.keys(factionCounts);
  const primaryFactions = factions
    .map((faction) => ({
      faction,
      count: factionCounts[faction],
      percent: (factionCounts[faction] / totalCards) * 100,
    }))
    .filter((f) => f.percent >= 20)
    .sort((a, b) => b.count - a.count);

  const isFocused =
    primaryFactions.length <= 2 || primaryFactions[0].percent >= 60;

  return {
    rule,
    isValid: isFocused,
    message: isFocused
      ? `Good faction focus (${primaryFactions.map((f) => `${f.faction}: ${f.percent.toFixed(1)}%`).join(', ')})`
      : 'Consider focusing on fewer factions for better synergy',
    details: isFocused
      ? undefined
      : `Current factions: ${Object.entries(factionCounts)
          .map(([f, c]) => `${f} (${c})`)
          .join(', ')}`,
  };
}
