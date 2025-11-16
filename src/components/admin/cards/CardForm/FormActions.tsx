/**
 * FormActions Component
 * Form action buttons (Cancel and Submit)
 */

import React from 'react';
import { Button } from '@/components/ui/Button';

interface FormActionsProps {
  onCancel?: () => void;
  isLoading?: boolean;
  isUpdate: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isLoading,
  isUpdate,
}) => (
  <div className="flex justify-end gap-3 border-t border-[#443a5c] pt-6">
    {onCancel && (
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
    )}
    <Button
      type="submit"
      variant="primary"
      emphasis="high"
      disabled={isLoading}
    >
      {isLoading ? 'Saving...' : isUpdate ? 'Update Card' : 'Create Card'}
    </Button>
  </div>
);
