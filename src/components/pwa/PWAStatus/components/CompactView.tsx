/**
 * Compact PWA status indicator
 */

import React from 'react';
import { Badge } from '@/components/ui';
import type { PWAState } from '@/lib/services/pwaService';

interface CompactViewProps {
  pwaState: PWAState;
  pendingSync: number;
  className?: string;
}

export const CompactView: React.FC<CompactViewProps> = ({
  pwaState,
  pendingSync,
  className,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* PWA status */}
      {pwaState.isInstalled && (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-xs text-blue-800"
        >
          📱 Installed
        </Badge>
      )}

      {/* Pending sync indicator */}
      {pendingSync > 0 && !pwaState.isOnline && (
        <Badge
          variant="outline"
          className="border-orange-300 text-xs text-orange-600"
        >
          {pendingSync} pending
        </Badge>
      )}

      {/* Update indicator */}
      {pwaState.updateAvailable && (
        <Badge
          variant="primary"
          className="bg-green-100 text-xs text-green-800"
        >
          Update
        </Badge>
      )}
    </div>
  );
};
