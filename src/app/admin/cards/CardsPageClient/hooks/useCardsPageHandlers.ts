'use client';
/**
 * Custom hook for admin cards page event handlers
 */

import { useCallback, useEffect } from 'react';
import { loadCards as loadCardsAPI } from '../api';
import type { Card, PaginationData } from '../types';

interface SimpleGame {
  id: string;
  slug: string;
  name: string;
}

interface UseCardsPageHandlersOptions {
  currentPage: number;
  debouncedSearch: string;
  selectedGameSlug: string;
  setCards: (cards: Card[]) => void;
  setPagination: (
    pagination: PaginationData | ((prev: PaginationData) => PaginationData)
  ) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedCard: (card: Card | undefined) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setGames: (games: SimpleGame[]) => void;
  setSelectedGameSlug: (slug: string) => void;
}

export function useCardsPageHandlers({
  currentPage,
  debouncedSearch,
  selectedGameSlug,
  setCards,
  setPagination,
  setIsLoading,
  setSelectedCard,
  setIsCreateModalOpen,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setGames,
  setSelectedGameSlug,
}: UseCardsPageHandlersOptions) {
  // Load game list on mount, auto-select first game
  useEffect(() => {
    fetch('/api/admin/games')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.games.length > 0) {
          const simplified = data.games.map((g: SimpleGame) => ({
            id: g.id,
            slug: g.slug,
            name: g.name,
          }));
          setGames(simplified);
          setSelectedGameSlug(simplified[0].slug);
        }
      })
      .catch(() => undefined);
  }, [setGames, setSelectedGameSlug]);

  const loadCards = useCallback(
    async (page: number, searchQuery: string) => {
      if (!selectedGameSlug) return;
      setIsLoading(true);

      const result = await loadCardsAPI(page, searchQuery, selectedGameSlug);

      if (result) {
        setCards(result.cards);
        setPagination(result.pagination);
      }

      setIsLoading(false);
    },
    [setCards, setPagination, setIsLoading, selectedGameSlug]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    },
    [setPagination]
  );

  const handleCreateClick = useCallback(() => {
    setSelectedCard(undefined);
    setIsCreateModalOpen(true);
  }, [setSelectedCard, setIsCreateModalOpen]);

  const handleEditClick = useCallback(
    (card: Card) => {
      setSelectedCard(card);
      setIsEditModalOpen(true);
    },
    [setSelectedCard, setIsEditModalOpen]
  );

  const handleDeleteClick = useCallback(
    (card: Card) => {
      setSelectedCard(card);
      setIsDeleteModalOpen(true);
    },
    [setSelectedCard, setIsDeleteModalOpen]
  );

  const handleModalSuccess = useCallback(() => {
    // Reload cards after successful create/edit/delete
    loadCards(currentPage, debouncedSearch);
  }, [loadCards, currentPage, debouncedSearch]);

  return {
    loadCards,
    handlePageChange,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleModalSuccess,
  };
}
