'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { CardForm } from './CardForm';
import { ToastContainer } from '@/components/ui/Toast';

interface Card {
  id: string;
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  officialText?: string | null;
  level?: number | null;
  cost?: number | null;
  clashPoints?: number | null;
  price?: number | null;
  hitPoints?: number | null;
  attackPoints?: number | null;
  faction?: string | null;
  pilot?: string | null;
  model?: string | null;
  series?: string | null;
  nation?: string | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  isFoil?: boolean | null;
  isPromo?: boolean | null;
  isAlternate?: boolean | null;
  language?: string | null;
  type?: { name: string } | null;
  rarity?: { name: string; color: string } | null;
  set?: { name: string; code: string } | null;
  createdAt?: Date | string;
}

interface CardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  card?: Card;
  mode: 'create' | 'edit';
}

interface CardFormData {
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber: string;
  imageUrl?: string;
  description?: string;
  officialText?: string;
  level?: number;
  cost?: number;
  clashPoints?: number;
  price?: number;
  hitPoints?: number;
  attackPoints?: number;
  faction?: string;
  pilot?: string;
  model?: string;
  series?: string;
  nation?: string;
  keywords?: string[];
  tags?: string[];
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  language?: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export function CardFormModal({
  isOpen,
  onClose,
  onSuccess,
  card,
  mode,
}: CardFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message, duration: 5000 }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSubmit = async (data: CardFormData) => {
    setIsLoading(true);

    try {
      const url = mode === 'create' ? '/api/cards' : `/api/cards/${card?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || 'Failed to save card'
        );
      }

      // Success
      addToast(
        'success',
        `Card ${mode === 'create' ? 'created' : 'updated'} successfully`
      );

      // Wait a brief moment for the toast to be visible before closing
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      console.error('Failed to save card:', error);
      addToast(
        'error',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Convert card to form data format
  const initialData = card
    ? {
        name: card.name,
        typeId: card.typeId,
        rarityId: card.rarityId,
        setId: card.setId,
        setNumber: card.setNumber ?? '',
        imageUrl: card.imageUrl ?? undefined,
        description: card.description ?? undefined,
        officialText: card.officialText ?? undefined,
        level: card.level ?? undefined,
        cost: card.cost ?? undefined,
        clashPoints: card.clashPoints ?? undefined,
        price: card.price ?? undefined,
        hitPoints: card.hitPoints ?? undefined,
        attackPoints: card.attackPoints ?? undefined,
        faction: card.faction ?? undefined,
        pilot: card.pilot ?? undefined,
        model: card.model ?? undefined,
        series: card.series ?? undefined,
        nation: card.nation ?? undefined,
        keywords: card.keywords ?? undefined,
        tags: card.tags ?? undefined,
        isFoil: card.isFoil ?? undefined,
        isPromo: card.isPromo ?? undefined,
        isAlternate: card.isAlternate ?? undefined,
        language: card.language ?? undefined,
      }
    : undefined;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={mode === 'create' ? 'Create New Card' : 'Edit Card'}
        size="xl"
        closeOnOverlayClick={!isLoading}
        className="max-h-[90vh] overflow-y-auto border border-[#443a5c] bg-[#1a1625]"
      >
        <CardForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Modal>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
