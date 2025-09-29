'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge } from '@/components/ui';
import { useAuth, useCollection } from '@/hooks';
import { CollectionImporter } from './CollectionImporter';
import { AdvancedImporter } from './AdvancedImporter';
import { CollectionExporter } from './CollectionExporter';

interface CollectionCard {
  cardId: string;
  card: any;
  quantity: number;
  condition: string;
  addedAt: Date | string;
  updatedAt: Date | string;
}

interface CollectionManagerProps {
  className?: string;
}

export const CollectionManager: React.FC<CollectionManagerProps> = ({ className }) => {
  const { isAuthenticated } = useAuth();
  const {
    getCollection,
    updateCollection,
    removeFromCollection,
    isLoading,
    error,
    clearError
  } = useCollection();

  const [collection, setCollection] = useState<{
    userId: string;
    cards: CollectionCard[];
    statistics: any;
    pagination?: any;
  } | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    rarity: '',
    type: '',
    faction: '',
    page: 1,
    limit: 20
  });

  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editCondition, setEditCondition] = useState<string>('Near Mint');
  const [currentTab, setCurrentTab] = useState<'view' | 'import' | 'advanced' | 'export'>('view');

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

  const handleFilterChange = useCallback((field: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: field !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  }, []);

  const handleUpdateCard = useCallback(async (cardId: string, quantity: number, condition: string) => {
    if (quantity <= 0) {
      if (confirm('Are you sure you want to remove this card from your collection?')) {
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
  }, [updateCollection, removeFromCollection, loadCollection]);

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

  const conditions = ['Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'];

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">Sign in to manage your card collection</p>
            <Button onClick={() => window.location.href = '/auth/signin'}>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {collection.statistics.totalCards}
              </div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {collection.statistics.uniqueCards}
              </div>
              <div className="text-sm text-gray-600">Unique Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {collection.statistics.completionPercentage}%
              </div>
              <div className="text-sm text-gray-600">Collection Complete</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${collection.statistics.totalValue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-600">Collection Value</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentTab('view')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'view'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📖 View Collection
            </button>
            <button
              onClick={() => setCurrentTab('import')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'import'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📥 Import Cards
            </button>
            <button
              onClick={() => setCurrentTab('advanced')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'advanced'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔧 Advanced Import
            </button>
            <button
              onClick={() => setCurrentTab('export')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'export'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Collection</CardTitle>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by card name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rarity
              </label>
              <Select
                value={filters.rarity}
                onValueChange={(value) => handleFilterChange('rarity', value)}
              >
                <option value="">All Rarities</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Super Rare">Super Rare</option>
                <option value="Secret Rare">Secret Rare</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <option value="">All Types</option>
                <option value="Unit">Unit</option>
                <option value="Command">Command</option>
                <option value="Pilot">Pilot</option>
                <option value="Operation">Operation</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faction
              </label>
              <Select
                value={filters.faction}
                onValueChange={(value) => handleFilterChange('faction', value)}
              >
                <option value="">All Factions</option>
                <option value="Earth Federation">Earth Federation</option>
                <option value="Principality of Zeon">Principality of Zeon</option>
                <option value="AEUG">AEUG</option>
                <option value="Titans">Titans</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Collection Cards */}
      <Card>
        <CardHeader>
          <CardTitle>
            My Collection
            {collection && ` (${collection.cards.length} cards shown)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading collection...</p>
            </div>
          ) : collection?.cards.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No cards found in your collection.</p>
              <p className="text-sm mt-1">Start adding cards to build your collection!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collection?.cards.map((collectionCard) => (
                <div
                  key={collectionCard.cardId}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    {collectionCard.card.imageUrl && (
                      <img
                        src={collectionCard.card.imageUrl}
                        alt={collectionCard.card.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {collectionCard.card.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {collectionCard.card.rarity?.name || 'Unknown'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {collectionCard.card.type?.name || 'Unknown'}
                        </Badge>
                        {collectionCard.card.faction && (
                          <Badge variant="outline" className="text-xs">
                            {collectionCard.card.faction.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Added: {new Date(collectionCard.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {editingCard === collectionCard.cardId ? (
                      <div className="flex items-center space-x-2">
                        <div>
                          <label className="block text-xs text-gray-600">Qty</label>
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                            className="w-16 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Condition</label>
                          <Select
                            value={editCondition}
                            onValueChange={setEditCondition}
                          >
                            {conditions.map(condition => (
                              <option key={condition} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="pt-4">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateCard(collectionCard.cardId, editQuantity, editCondition)}
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
                          <div className="font-semibold">
                            {collectionCard.quantity}x
                          </div>
                          <div className="text-xs text-gray-600">
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
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange('page', filters.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {filters.page} of {collection.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= collection.pagination.pages}
                onClick={() => handleFilterChange('page', filters.page + 1)}
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
            console.log('Import completed:', result);
            // Refresh collection after import
            loadCollection();
            // Show success message
            if (result.success > 0) {
              console.warn(`Successfully imported ${result.success} cards to your collection!`);
            }
          }}
        />
      )}

      {/* Advanced Import Tab */}
      {currentTab === 'advanced' && (
        <AdvancedImporter
          onImportComplete={(result) => {
            console.log('Advanced import completed:', result);
            // Refresh collection after import
            loadCollection();
            // Show results summary
            if (result.result?.success > 0) {
              console.warn(`Successfully imported ${result.result.success} cards to your collection!`);
            }
          }}
        />
      )}

      {/* Export Tab */}
      {currentTab === 'export' && (
        <CollectionExporter
          collectionStats={collection?.statistics}
          onExportComplete={(result) => {
            console.log('Export completed:', result);
            // Show success message
            if (result.success) {
              console.warn(`Export completed successfully! File: ${result.filename}`);
            }
          }}
        />
      )}
    </div>
  );
};

export default CollectionManager;