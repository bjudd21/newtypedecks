/**
 * Modals component for admin cards page
 */

import React from 'react';
import { CardFormModal } from '@/components/admin/cards/CardFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import type { Card } from '../types';

interface CardsPageModalsProps {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedCard?: Card;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSuccess: () => void;
}

export const CardsPageModals: React.FC<CardsPageModalsProps> = ({
  isCreateModalOpen,
  isEditModalOpen,
  isDeleteModalOpen,
  selectedCard,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
  onSuccess,
}) => {
  return (
    <>
      {/* Create Modal */}
      <CardFormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        onSuccess={onSuccess}
        mode="create"
      />

      {/* Edit and Delete Modals */}
      {selectedCard && (
        <>
          <CardFormModal
            isOpen={isEditModalOpen}
            onClose={onCloseEdit}
            onSuccess={onSuccess}
            card={selectedCard}
            mode="edit"
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={onCloseDelete}
            onSuccess={onSuccess}
            itemType="card"
            itemName={selectedCard.name}
            _itemId={selectedCard.id}
            apiEndpoint={`/api/cards/${selectedCard.id}`}
          />
        </>
      )}
    </>
  );
};
