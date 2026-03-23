'use client';
/**
 * Card search state and handlers for proxy generator
 */

import { useState, useCallback } from 'react';
import type { CardWithRelations } from '@/lib/types/card';
import { searchProxyCards } from '../api';

export function useProxySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardWithRelations[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (query: string, page: number) => {
    setIsSearching(true);
    try {
      const result = await searchProxyCards(query, page);
      setSearchResults((result.cards as CardWithRelations[]) ?? []);
      setTotalPages(result.totalPages ?? 1);
      setHasSearched(true);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      setCurrentPage(1);
      await runSearch(query, 1);
    },
    [runSearch]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      await runSearch(searchQuery, page);
    },
    [runSearch, searchQuery]
  );

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    currentPage,
    totalPages,
    hasSearched,
    handleSearch,
    handlePageChange,
  };
}
