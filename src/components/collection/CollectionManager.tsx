'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Badge,
} from '@/components/ui';
import { useAuth, useCollection } from '@/hooks';
import { CollectionImporter } from './CollectionImporter';
import { AdvancedImporter } from './AdvancedImporter';
import { CollectionExporter } from './CollectionExporter';
import type {
  Card as CardType,
  CollectionStatistics,
  CollectionPagination,
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
    statistics: CollectionStatistics;
    pagination?: CollectionPagination;
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
  const [currentTab, setCurrentTab] = useState<
    'view' | 'import' | 'advanced' | 'export'
  >('view');

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
              : parseInt(value) || 1, // Reset to page 1 when changing filters
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

  const conditions = [
    'Mint',
    'Near Mint',
    'Lightly Played',
    'Moderately Played',
    'Heavily Played',
    'Damaged',
  ];

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <Card className="border-[#443a5c] bg-[#2d2640]">
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-gray-400">
              Sign in to manage your card collection
            </p>
            <Button
              onClick={() => (window.location.href = '/auth/signin')}
              className="bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa]"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Collection Statistics */}
      {collection && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {collection.statistics.totalCards}
              </div>
              <div className="text-sm text-gray-400">Total Cards</div>
            </CardContent>
          </Card>
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {collection.statistics.uniqueCards}
              </div>
              <div className="text-sm text-gray-400">Unique Cards</div>
            </CardContent>
          </Card>
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {collection.statistics.completionPercentage}%
              </div>
              <div className="text-sm text-gray-400">Collection Complete</div>
            </CardContent>
          </Card>
          <Card className="border-[#443a5c] bg-[#2d2640]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                ${collection.statistics.totalValue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-400">Collection Value</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-[#443a5c]">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentTab('view')}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                currentTab === 'view'
                  ? 'border-[#8b7aaa] text-[#8b7aaa]'
                  : 'border-transparent text-gray-400 hover:border-[#6b5a8a] hover:text-gray-300'
              }`}
            >
              📖 View Collection
            </button>
            <button
              onClick={() => setCurrentTab('import')}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                currentTab === 'import'
                  ? 'border-[#8b7aaa] text-[#8b7aaa]'
                  : 'border-transparent text-gray-400 hover:border-[#6b5a8a] hover:text-gray-300'
              }`}
            >
              📥 Import Cards
            </button>
            <button
              onClick={() => setCurrentTab('advanced')}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                currentTab === 'advanced'
                  ? 'border-[#8b7aaa] text-[#8b7aaa]'
                  : 'border-transparent text-gray-400 hover:border-[#6b5a8a] hover:text-gray-300'
              }`}
            >
              🔧 Advanced Import
            </button>
            <button
              onClick={() => setCurrentTab('export')}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                currentTab === 'export'
                  ? 'border-[#8b7aaa] text-[#8b7aaa]'
                  : 'border-transparent text-gray-400 hover:border-[#6b5a8a] hover:text-gray-300'
              }`}
            >
              📤 Export Collection
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === 'view' && (
        <>
          {/* Filters */}
          <Card className="mb-6 border-[#443a5c] bg-[#2d2640]">
            <CardHeader>
              <CardTitle className="text-[#a89ec7]">
                FILTER COLLECTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Search
                  </label>
                  <Input
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    placeholder="Search by card name..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Rarity
                  </label>
                  <Select
                    value={filters.rarity}
                    onChange={(value: string) =>
                      handleFilterChange('rarity', value)
                    }
                    options={[
                      { value: '', label: 'All Rarities' },
                      { value: 'Common', label: 'Common' },
                      { value: 'Uncommon', label: 'Uncommon' },
                      { value: 'Rare', label: 'Rare' },
                      { value: 'Super Rare', label: 'Super Rare' },
                      { value: 'Secret Rare', label: 'Secret Rare' },
                    ]}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Type
                  </label>
                  <Select
                    value={filters.type}
                    onChange={(value: string) =>
                      handleFilterChange('type', value)
                    }
                    options={[
                      { value: '', label: 'All Types' },
                      { value: 'Unit', label: 'Unit' },
                      { value: 'Command', label: 'Command' },
                      { value: 'Pilot', label: 'Pilot' },
                      { value: 'Operation', label: 'Operation' },
                    ]}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Faction
                  </label>
                  <Select
                    value={filters.faction}
                    onChange={(value: string) =>
                      handleFilterChange('faction', value)
                    }
                    options={[
                      { value: '', label: 'All Factions' },
                      { value: 'Earth Federation', label: 'Earth Federation' },
                      {
                        value: 'Principality of Zeon',
                        label: 'Principality of Zeon',
                      },
                      { value: 'AEUG', label: 'AEUG' },
                      { value: 'Titans', label: 'Titans' },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <div
                      key={collectionCard.cardId}
                      className="flex items-center justify-between rounded-lg border border-[#443a5c] bg-[#1a1625] p-4 hover:bg-[#3a3050]"
                    >
                      <div className="flex items-center space-x-4">
                        {collectionCard.card.imageUrl && (
                          <Image
                            src={collectionCard.card.imageUrl}
                            alt={collectionCard.card.name}
                            width={64}
                            height={80}
                            className="rounded object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-white">
                            {collectionCard.card.name}
                          </h3>
                          <div className="mt-1 flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {(
                                collectionCard.card as unknown as {
                                  rarity?: { name: string };
                                }
                              ).rarity?.name || 'Unknown'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {(
                                collectionCard.card as unknown as {
                                  type?: { name: string };
                                }
                              ).type?.name || 'Unknown'}
                            </Badge>
                            {collectionCard.card.faction && (
                              <Badge variant="outline" className="text-xs">
                                {typeof collectionCard.card.faction === 'string'
                                  ? collectionCard.card.faction
                                  : 'Unknown'}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-400">
                            Added:{' '}
                            {new Date(
                              collectionCard.addedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {editingCard === collectionCard.cardId ? (
                          <div className="flex items-center space-x-2">
                            <div>
                              <label className="block text-xs text-gray-400">
                                Qty
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="99"
                                value={editQuantity}
                                onChange={(e) =>
                                  setEditQuantity(parseInt(e.target.value) || 0)
                                }
                                className="w-16 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400">
                                Condition
                              </label>
                              <Select
                                value={editCondition}
                                onChange={setEditCondition}
                                options={conditions.map((condition) => ({
                                  value: condition,
                                  label: condition,
                                }))}
                              />
                            </div>
                            <div className="pt-4">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUpdateCard(
                                    collectionCard.cardId,
                                    editQuantity,
                                    editCondition
                                  )
                                }
                                className="mr-1"
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="font-semibold text-white">
                                {collectionCard.quantity}x
                              </div>
                              <div className="text-xs text-gray-400">
                                {collectionCard.condition}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(collectionCard)}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {collection?.pagination && collection.pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page <= 1}
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {filters.page} of {collection.pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page >= collection.pagination.pages}
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Import Tab */}
      {currentTab === 'import' && (
        <CollectionImporter
          onImportComplete={(result) => {
            console.warn('Import completed:', result);
            // Refresh collection after import
            loadCollection();
            // Show success message
            if (result.success > 0) {
              console.warn(
                `Successfully imported ${result.success} cards to your collection!`
              );
            }
          }}
        />
      )}

      {/* Advanced Import Tab */}
      {currentTab === 'advanced' && (
        <AdvancedImporter
          onImportComplete={(result: unknown) => {
            console.warn('Advanced import completed:', result);
            // Refresh collection after import
            loadCollection();
            // Show results summary
            const resultObj = result as { result?: { success: number } };
            if (resultObj.result?.success && resultObj.result.success > 0) {
              console.warn(
                `Successfully imported ${resultObj.result.success} cards to your collection!`
              );
            }
          }}
        />
      )}

      {/* Export Tab */}
      {currentTab === 'export' && (
        <CollectionExporter
          collectionStats={collection?.statistics}
          onExportComplete={(result: unknown) => {
            console.warn('Export completed:', result);
            // Show success message
            const resultObj = result as {
              success?: boolean;
              filename?: string;
            };
            if (resultObj.success) {
              console.warn(
                `Export completed successfully! File: ${resultObj.filename}`
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default CollectionManager;
