/**
 * Custom hook for admin cards page event handlers
 */

import { useCallback } from 'react';
import { loadCards as loadCardsAPI } from '../api';
import type { Card, PaginationData } from '../types';

interface UseCardsPageHandlersOptions {
  currentPage: number;
  debouncedSearch: string;
  setCards: (cards: Card[]) => void;
  setPagination: (pagination: PaginationData | ((prev: PaginationData) => PaginationData)) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedCard: (card: Card | undefined) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
}

export function useCardsPageHandlers({
  currentPage,
  debouncedSearch,
  setCards,
  setPagination,
  setIsLoading,
  setSelectedCard,
  setIsCreateModalOpen,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
}: UseCardsPageHandlersOptions) {
  const loadCards = useCallback(
    async (page: number, searchQuery: string) => {
      setIsLoading(true);

      const result = await loadCardsAPI(page, searchQuery);

      if (result) {
        setCards(result.cards);
        setPagination(result.pagination);
      }

      setIsLoading(false);
    },
    [setCards, setPagination, setIsLoading]
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
