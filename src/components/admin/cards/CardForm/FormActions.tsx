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
  <div className="border-border flex justify-end gap-3 border-t pt-6">
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
    <Button type="submit" variant="primary" disabled={isLoading}>
      {isLoading ? 'Saving...' : isUpdate ? 'Update Card' : 'Create Card'}
    </Button>
  </div>
);
