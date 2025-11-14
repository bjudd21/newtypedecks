'use client';

import { useState, useEffect, useCallback } from 'react';
import { CardTable } from '@/components/admin/cards/CardTable';
import { CardFormModal } from '@/components/admin/cards/CardFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';

interface Card {
  id: string;
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  level?: number | null;
  cost?: number | null;
  imageUrl?: string | null;
  setNumber?: string | null;
  type?: { name: string } | null;
  rarity?: { name: string; color: string } | null;
  set?: { name: string; code: string } | null;
  description?: string | null;
  officialText?: string | null;
  clashPoints?: number | null;
  price?: number | null;
  hitPoints?: number | null;
  attackPoints?: number | null;
  faction?: string | null;
  pilot?: string | null;
  model?: string | null;
  series?: string | null;
  createdAt?: Date | string;
  nation?: string | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  isFoil?: boolean | null;
  isPromo?: boolean | null;
  isAlternate?: boolean | null;
  language?: string | null;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

export function CardsPageClient() {
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Load cards
  const loadCards = useCallback(async (page: number, searchQuery: string) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/cards?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCards(data.cards || []);
        setPagination({
          currentPage: data.pagination?.page || 1,
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0,
          hasMore: data.pagination?.hasMore || false,
        });
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cards when search or page changes
  useEffect(() => {
    loadCards(pagination.currentPage, debouncedSearch);
  }, [pagination.currentPage, debouncedSearch, loadCards]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleCreateClick = () => {
    setSelectedCard(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (card: Card) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (card: Card) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Reload cards after successful create/edit/delete
    loadCards(pagination.currentPage, debouncedSearch);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Card Management</h1>
          <p className="mt-1 text-gray-400">
            Manage your Gundam card database (
            {pagination.totalCount.toLocaleString()} cards)
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateClick}>
          Create Card
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards by name..."
          className="w-full"
        />
      </div>

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
      <CardFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
        mode="create"
      />

      {selectedCard && (
        <>
          <CardFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleModalSuccess}
            card={selectedCard}
            mode="edit"
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onSuccess={handleModalSuccess}
            itemType="card"
            itemName={selectedCard.name}
            _itemId={selectedCard.id}
            apiEndpoint={`/api/cards/${selectedCard.id}`}
          />
        </>
      )}
    </div>
  );
}
