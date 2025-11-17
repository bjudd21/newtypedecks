/**
 * CardsPageContent - Main component orchestrator for admin cards page
 */

'use client';

import React from 'react';
import { CardTable } from '@/components/admin/cards/CardTable';
import { Pagination } from '@/components/ui/Pagination';
import { useCardsPageState } from './hooks/useCardsPageState';
import { useCardsPageHandlers } from './hooks/useCardsPageHandlers';
import { useCardsPageEffects } from './hooks/useCardsPageEffects';
import { CardsPageHeader } from './ui/CardsPageHeader';
import { CardsPageSearch } from './ui/CardsPageSearch';
import { CardsPageModals } from './ui/CardsPageModals';

export function CardsPageContent() {
  // State management
  const {
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
  } = useCardsPageState();

  // Event handlers
  const {
    loadCards,
    handlePageChange,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleModalSuccess,
  } = useCardsPageHandlers({
    currentPage: pagination.currentPage,
    debouncedSearch,
    setCards,
    setPagination,
    setIsLoading,
    setSelectedCard,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
  });

  // Effects
  useCardsPageEffects({
    search,
    debouncedSearch,
    currentPage: pagination.currentPage,
    setDebouncedSearch,
    setPagination,
    loadCards,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <CardsPageHeader
        totalCount={pagination.totalCount}
        onCreateClick={handleCreateClick}
      />

      {/* Search */}
      <CardsPageSearch search={search} onSearchChange={setSearch} />

      {/* Cards Table */}
      <CardTable
        cards={cards}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <CardsPageModals
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCard={selectedCard}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        onCloseEdit={() => setIsEditModalOpen(false)}
        onCloseDelete={() => setIsDeleteModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default CardsPageContent;
