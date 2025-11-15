/**
 * Synergy Score Metric
 */

import type { DeckCard } from '../types';
import {
  calculateFactionDistribution,
  calculateTypeDistribution,
} from '../statistics/distributions';

export function calculateSynergyScore(deckCards: DeckCard[]): number {
  const factionDist = calculateFactionDistribution(deckCards);
  const typeDist = calculateTypeDistribution(deckCards);

  // Faction synergy: higher score for consistent faction choices
  const factionEntries = Object.values(factionDist);
  const dominantFaction = Math.max(
    ...factionEntries.map((f) => f.percentage)
  );
  const factionSynergy = dominantFaction >= 60 ? 0.8 : dominantFaction / 100;

  // Type synergy: bonus for good type distribution
  const hasUnits = 'Unit' in typeDist && typeDist.Unit.percentage >= 30;
  const hasCommands =
    'Command' in typeDist && typeDist.Command.percentage >= 15;
  const hasPilots = 'Pilot' in typeDist && typeDist.Pilot.percentage >= 10;

  let typeSynergy = 0.5;
  if (hasUnits) typeSynergy += 0.2;
  if (hasCommands) typeSynergy += 0.15;
  if (hasPilots) typeSynergy += 0.15;

  return Math.round(((factionSynergy + typeSynergy) / 2) * 100);
}
