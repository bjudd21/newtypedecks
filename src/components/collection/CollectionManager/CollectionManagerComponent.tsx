/**
 * CollectionManager - Main component for managing card collections
 */

'use client';

import React from 'react';
import { useAuth, useCollection } from '@/hooks';
import { CollectionImporter } from '../CollectionImporter';
import { AdvancedImporter } from '../AdvancedImporter';
import { CollectionExporter } from '../CollectionExporter';
import {
  CollectionStatistics,
  TabNavigation,
  CollectionFilters,
} from './';
import { useCollectionState } from './hooks/useCollectionState';
import { useCollectionLoader } from './hooks/useCollectionLoader';
import { useFilterManagement } from './hooks/useFilterManagement';
import { useCardEditing } from './hooks/useCardEditing';
import { UnauthenticatedView } from './components/UnauthenticatedView';
import { ErrorDisplay } from './components/ErrorDisplay';
import { CollectionContent } from './components/CollectionContent';
import { CARD_CONDITIONS } from './constants';
import type { CollectionManagerProps } from './types';

export const CollectionManagerComponent: React.FC<CollectionManagerProps> = ({
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

  // State management
  const {
    collection,
    setCollection,
    filters,
    setFilters,
    editingCard,
    setEditingCard,
    editQuantity,
    setEditQuantity,
    editCondition,
    setEditCondition,
    currentTab,
    setCurrentTab,
  } = useCollectionState();

  // Collection loading
  const { loadCollection } = useCollectionLoader({
    isAuthenticated,
    getCollection,
    clearError,
    filters,
    setCollection,
  });

  // Filter management
  const { handleFilterChange } = useFilterManagement({ setFilters });

  // Card editing
  const { startEditing, cancelEditing, handleUpdateCard } = useCardEditing({
    setEditingCard,
    setEditQuantity,
    setEditCondition,
    updateCollection,
    removeFromCollection,
    loadCollection,
  });

  if (!isAuthenticated) {
    return <UnauthenticatedView className={className} />;
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
          <ErrorDisplay error={error} />

          {/* Collection Cards */}
          <CollectionContent
            collection={collection}
            filters={filters}
            isLoading={isLoading}
            editingCard={editingCard}
            editQuantity={editQuantity}
            editCondition={editCondition}
            conditions={CARD_CONDITIONS}
            onStartEdit={startEditing}
            onCancelEdit={cancelEditing}
            onUpdateCard={handleUpdateCard}
            onQuantityChange={setEditQuantity}
            onConditionChange={setEditCondition}
            onPageChange={(page: number) => handleFilterChange('page', page)}
          />
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

export default CollectionManagerComponent;
