/**
 * Custom hook for admin cards page state management
 */

import { useState } from 'react';
import type { Card, PaginationData } from '../types';

export function useCardsPageState() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | undefined>();

  return {
    cards,
    setCards,
    isLoading,
    setIsLoading,
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    pagination,
    setPagination,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCard,
    setSelectedCard,
  };
}
