/**
 * CardValidator type definitions
 */

// Faction and series are game-specific free-text fields; no fixed enum.
export type CardFaction = string;
export type CardSeries = string;

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};
