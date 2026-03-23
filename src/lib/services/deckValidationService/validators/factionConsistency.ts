/**
 * Faction Consistency Validator
 *
 * Reads the primary grouping field from `card.gameAttributes` JSONB.
 * For Gundam the grouping field is `faction`; for One Piece it is `color`.
 * Both are tried in order so the validator works across all supported games
 * without requiring a game-config reference at this layer.
 */

import type { DeckCard, ValidationRule, ValidationResult } from '../types';

/**
 * Extract the primary grouping value (faction for Gundam, color for One Piece)
 * from a card's gameAttributes JSONB. Falls back to 'Neutral' if absent.
 */
function getCardGroupingValue(
  gameAttributes: Record<string, unknown> | null | undefined
): string {
  if (!gameAttributes) return 'Neutral';
  const value = gameAttributes.faction ?? gameAttributes.color;
  return typeof value === 'string' && value.trim() !== '' ? value : 'Neutral';
}

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
    const attrs = deckCard.card.gameAttributes as
      | Record<string, unknown>
      | null
      | undefined;
    const faction = getCardGroupingValue(attrs);
    factionCounts[faction] = (factionCounts[faction] || 0) + deckCard.quantity;
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
