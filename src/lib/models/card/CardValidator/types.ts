/**
 * CardValidator type definitions
 */

import { CARD_CONSTANTS } from '../../../types/card';

export type CardFaction = (typeof CARD_CONSTANTS.SUPPORTED_FACTIONS)[number];
export type CardSeries = (typeof CARD_CONSTANTS.SUPPORTED_SERIES)[number];

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};
