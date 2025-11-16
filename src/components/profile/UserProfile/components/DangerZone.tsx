/**
 * Danger zone component for account deletion
 */

import React from 'react';
import { Button } from '@/components/ui';

interface DangerZoneProps {
  onDeleteAccount: () => void;
  disabled?: boolean;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  onDeleteAccount,
  disabled,
}) => {
  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
      <h3 className="mb-2 font-medium text-red-400">Danger Zone</h3>
      <p className="mb-3 text-sm text-red-300/70">
        Once you delete your account, there is no going back. Please be
        certain.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onDeleteAccount}
        disabled={disabled}
        className="border-red-600 text-red-400 hover:bg-red-900/20"
      >
        DELETE ACCOUNT
      </Button>
    </div>
  );
};
