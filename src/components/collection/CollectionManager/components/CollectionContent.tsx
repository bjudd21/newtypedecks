/**
 * Collection content component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { CollectionCardItem, CollectionPagination } from '../';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import type {
  CollectionData,
  CollectionCard,
  CollectionFilters,
} from '../types';

interface CollectionContentProps {
  collection: CollectionData | null;
  filters: CollectionFilters;
  isLoading: boolean;
  editingCard: string | null;
  editQuantity: number;
  editCondition: string;
  conditions: string[];
  onStartEdit: (card: CollectionCard) => void;
  onCancelEdit: () => void;
  onUpdateCard: (cardId: string, quantity: number, condition: string) => void;
  onQuantityChange: (quantity: number) => void;
  onConditionChange: (condition: string) => void;
  onPageChange: (page: number) => void;
}

export const CollectionContent: React.FC<CollectionContentProps> = ({
  collection,
  filters,
  isLoading,
  editingCard,
  editQuantity,
  editCondition,
  conditions,
  onStartEdit,
  onCancelEdit,
  onUpdateCard,
  onQuantityChange,
  onConditionChange,
  onPageChange,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80">
          MY COLLECTION
          {collection && ` (${collection.cards.length} CARDS SHOWN)`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : collection?.cards.length === 0 ? (
          <EmptyState />
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
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onUpdateCard={onUpdateCard}
                onQuantityChange={onQuantityChange}
                onConditionChange={onConditionChange}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {collection?.pagination && (
          <CollectionPagination
            currentPage={filters.page}
            totalPages={collection.pagination.pages}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};
