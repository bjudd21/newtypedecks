'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useAuth, useCollection } from '@/hooks';
import { CollectionImporter } from './CollectionImporter';
import { AdvancedImporter } from './AdvancedImporter';
import { CollectionExporter } from './CollectionExporter';
import {
  CollectionStatistics,
  TabNavigation,
  CollectionFilters,
  CollectionCardItem,
  CollectionPagination,
  type TabType,
} from './CollectionManager/';
import type {
  Card as CardType,
  CollectionStatistics as CollectionStats,
  CollectionPagination as CollectionPaginationType,
} from '@/lib/types';

interface CollectionCard {
  cardId: string;
  card: CardType;
  quantity: number;
  condition: string;
  addedAt: Date | string;
  updatedAt: Date | string;
}

interface CollectionManagerProps {
  className?: string;
}

export const CollectionManager: React.FC<CollectionManagerProps> = ({
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const {
    getCollection,
    updateCollection,
    removeFromCollection,
    isLoading,
    error,
    clearError,
  } = useCollection();

  const [collection, setCollection] = useState<{
    userId: string;
    cards: CollectionCard[];
    statistics: CollectionStats;
    pagination?: CollectionPaginationType;
  } | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    rarity: '',
    type: '',
    faction: '',
    page: 1,
    limit: 20,
  });

  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editCondition, setEditCondition] = useState<string>('Near Mint');
  const [currentTab, setCurrentTab] = useState<TabType>('view');

  const conditions = [
    'Mint',
    'Near Mint',
    'Lightly Played',
    'Moderately Played',
    'Heavily Played',
    'Damaged',
  ];

  // Load collection on mount and filter changes
  const loadCollection = useCallback(async () => {
    if (!isAuthenticated) return;

    clearError();
    const collectionData = await getCollection(filters);
    if (collectionData) {
      setCollection(collectionData);
    }
  }, [isAuthenticated, getCollection, filters, clearError]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  const handleFilterChange = useCallback(
    (field: string, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
        page:
          field !== 'page'
            ? 1
            : typeof value === 'number'
              ? value
              : parseInt(value) || 1,
      }));
    },
    []
  );

  const handleUpdateCard = useCallback(
    async (cardId: string, quantity: number, condition: string) => {
      if (quantity <= 0) {
        // TODO: Replace with proper confirmation dialog component
        // eslint-disable-next-line no-alert
        const confirmed = window.confirm(
          'Are you sure you want to remove this card from your collection?'
        );
        if (confirmed) {
          const success = await removeFromCollection(cardId);
          if (success) {
            loadCollection();
          }
        }
      } else {
        const success = await updateCollection(cardId, quantity, condition);
        if (success) {
          loadCollection();
        }
      }
      setEditingCard(null);
    },
    [updateCollection, removeFromCollection, loadCollection]
  );

  const startEditing = useCallback((card: CollectionCard) => {
    setEditingCard(card.cardId);
    setEditQuantity(card.quantity);
    setEditCondition(card.condition);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingCard(null);
    setEditQuantity(0);
    setEditCondition('Near Mint');
  }, []);

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <Card className="border-[#443a5c] bg-[#2d2640]">
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-gray-400">
              Sign in to manage your card collection
            </p>
            <button
              onClick={() => (window.location.href = '/auth/signin')}
              className="rounded bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] px-4 py-2 text-white hover:from-[#a89ec7] hover:to-[#8b7aaa]"
            >
              Sign In
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Collection Statistics */}
      {collection && (
        <CollectionStatistics statistics={collection.statistics} />
      )}

      {/* Tab Navigation */}
      <TabNavigation currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Tab Content */}
      {currentTab === 'view' && (
        <>
          {/* Filters */}
          <CollectionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Error Display */}
          {error && (
            <div className="mb-6 rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Collection Cards */}
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardHeader>
              <CardTitle className="text-[#a89ec7]">
                MY COLLECTION
                {collection && ` (${collection.cards.length} CARDS SHOWN)`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#8b7aaa]"></div>
                  <p className="mt-2 text-gray-400">Loading collection...</p>
                </div>
              ) : collection?.cards.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <p>No cards found in your collection.</p>
                  <p className="mt-1 text-sm">
                    Start adding cards to build your collection!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collection?.cards.map((collectionCard) => (
                    <CollectionCardItem
                      key={collectionCard.cardId}
                      collectionCard={collectionCard}
                      isEditing={editingCard === collectionCard.cardId}
                      editQuantity={editQuantity}
                      editCondition={editCondition}
                      conditions={conditions}
                      onStartEdit={startEditing}
                      onCancelEdit={cancelEditing}
                      onUpdateCard={handleUpdateCard}
                      onQuantityChange={setEditQuantity}
                      onConditionChange={setEditCondition}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {collection?.pagination && (
                <CollectionPagination
                  currentPage={filters.page}
                  totalPages={collection.pagination.pages}
                  onPageChange={(page: number) =>
                    handleFilterChange('page', page)
                  }
                />
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Import Tab */}
      {currentTab === 'import' && (
        <CollectionImporter
          onImportComplete={(result: unknown) => {
            console.warn('Import complete:', result);
            loadCollection();
          }}
        />
      )}

      {/* Advanced Import Tab */}
      {currentTab === 'advanced' && (
        <AdvancedImporter
          onImportComplete={(result: unknown) => {
            console.warn('Advanced import complete:', result);
            loadCollection();
          }}
        />
      )}

      {/* Export Tab */}
      {currentTab === 'export' && (
        <CollectionExporter collectionStats={collection?.statistics} />
      )}
    </div>
  );
};

export default CollectionManager;
