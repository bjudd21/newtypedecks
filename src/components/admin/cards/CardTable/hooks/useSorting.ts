'use client';
/**
 * Hook for managing table sorting with nested properties
 */

import { useState, useMemo } from 'react';
import type { Card, SortOrder } from '../types';

export function useSorting(cards: Card[]) {
  const [sortField, setSortField] = useState<keyof Card>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: keyof Card) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      let aVal: unknown = a[sortField];
      let bVal: unknown = b[sortField];

      // Handle nested properties
      if (sortField === 'type' && a.type && b.type) {
        aVal = a.type.name;
        bVal = b.type.name;
      }
      if (sortField === 'rarity' && a.rarity && b.rarity) {
        aVal = a.rarity.name;
        bVal = b.rarity.name;
      }
      if (sortField === 'set' && a.set && b.set) {
        aVal = a.set.name;
        bVal = b.set.name;
      }

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [cards, sortField, sortOrder]);

  return {
    sortField,
    sortOrder,
    sortedCards,
    handleSort,
  };
}
