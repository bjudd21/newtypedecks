/**
 * Search Validation Functions
 *
 * Utilities for validating search parameters and ranges
 */

import { NextResponse } from 'next/server';
import type { CardSearchFilters } from '@/lib/types/card';

/**
 * Validates that min/max range filters are logically valid
 * Returns a NextResponse with error if validation fails, null if valid
 */
export function validateRanges(
  filters: CardSearchFilters
): NextResponse | null {
  const ranges = [
    { min: filters.levelMin, max: filters.levelMax, field: 'level' },
    { min: filters.costMin, max: filters.costMax, field: 'cost' },
    {
      min: filters.clashPointsMin,
      max: filters.clashPointsMax,
      field: 'clashPoints',
    },
    { min: filters.priceMin, max: filters.priceMax, field: 'price' },
    {
      min: filters.hitPointsMin,
      max: filters.hitPointsMax,
      field: 'hitPoints',
    },
    {
      min: filters.attackPointsMin,
      max: filters.attackPointsMax,
      field: 'attackPoints',
    },
  ];

  for (const range of ranges) {
    if (
      range.min !== undefined &&
      range.max !== undefined &&
      range.min > range.max
    ) {
      return NextResponse.json(
        {
          error: 'Invalid range',
          message: `${range.field}Min cannot be greater than ${range.field}Max`,
          field: range.field,
        },
        { status: 400 }
      );
    }
  }

  return null;
}
