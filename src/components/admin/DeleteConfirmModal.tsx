'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemType: 'card' | 'user';
  itemName: string;
  _itemId: string;
  apiEndpoint: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  itemType,
  itemName,
  _itemId,
  apiEndpoint,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message, duration: 5000 }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || `Failed to delete ${itemType}`
        );
      }

      // Success
      addToast(
        'success',
        `${itemType === 'card' ? 'Card' : 'User'} deleted successfully`
      );

      // Wait a brief moment for the toast to be visible before closing
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      console.error(`Failed to delete ${itemType}:`, error);
      addToast(
        'error',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={`Delete ${itemType === 'card' ? 'Card' : 'User'}`}
        size="md"
        closeOnOverlayClick={!isDeleting}
        className="border border-[#443a5c] bg-[#1a1625]"
      >
        <div className="space-y-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <p className="text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">{itemName}</span>?
            </p>
            <p className="mt-2 text-sm text-gray-400">
              This action cannot be undone.{' '}
              {itemType === 'user' &&
                'All user data including decks and collections will be permanently removed.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-[#443a5c] pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
