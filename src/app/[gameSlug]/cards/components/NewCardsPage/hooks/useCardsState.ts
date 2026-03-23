'use client';
/**
 * Custom hook for cards page state management
 */

import { useState } from 'react';
import type { CardWithRelations, CardSortField } from '@/lib/types/card';

export function useCardsState() {
  const [cards, setCards] = useState<CardWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardWithRelations | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<CardSortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  return {
    cards,
    setCards,
    loading,
    setLoading,
    selectedCard,
    setSelectedCard,
    searchQuery,
    setSearchQuery,
    totalResults,
    setTotalResults,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
}
