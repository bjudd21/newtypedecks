'use client';
/**
 * Hook for managing CollectionManager state
 */

import { useState } from 'react';
import type { CollectionData, CollectionFilters } from '../types';
import type { TabType } from '../';
import { DEFAULT_FILTERS, DEFAULT_CONDITION } from '../constants';

export function useCollectionState() {
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [filters, setFilters] = useState<CollectionFilters>(DEFAULT_FILTERS);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editCondition, setEditCondition] = useState<string>(DEFAULT_CONDITION);
  const [currentTab, setCurrentTab] = useState<TabType>('view');

  return {
    collection,
    setCollection,
    filters,
    setFilters,
    editingCard,
    setEditingCard,
    editQuantity,
    setEditQuantity,
    editCondition,
    setEditCondition,
    currentTab,
    setCurrentTab,
  };
}
