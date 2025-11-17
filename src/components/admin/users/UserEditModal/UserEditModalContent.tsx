/**
 * UserEditModalContent - Main component orchestrator
 */

'use client';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { UserRole } from '@prisma/client';
import { useToasts } from './hooks/useToasts';
import { useUserEditForm } from './hooks/useUserEditForm';
import type { UserEditModalProps } from './types';

export function UserEditModalContent({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserEditModalProps) {
  // Toast management
  const { toasts, addToast, removeToast } = useToasts();

  // Form state and handlers
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useUserEditForm({
    user,
    onSuccess,
    onClose,
    addToast,
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title="Edit User"
        size="md"
        closeOnOverlayClick={!isLoading}
        className="border border-[#443a5c] bg-[#1a1625]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter user name"
          />

          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            placeholder="user@example.com"
          />

          <Select
            label="Role *"
            value={formData.role}
            onChange={(value: string) =>
              handleChange('role', value as UserRole)
            }
            options={[
              { value: UserRole.USER, label: 'User' },
              { value: UserRole.MODERATOR, label: 'Moderator' },
              { value: UserRole.ADMIN, label: 'Admin' },
            ]}
          />

          <div>
            <Input
              label="New Password (optional)"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              placeholder="Leave blank to keep current password"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter a new password only if you want to change it
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#443a5c] pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              emphasis="high"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
