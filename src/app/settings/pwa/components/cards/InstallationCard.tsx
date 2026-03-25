/**
 * App installation card component
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import type { PWAState } from '@/lib/services/pwaService';

interface InstallationCardProps {
  pwaState: PWAState;
  actionLoading: string | null;
  onInstallApp: () => void;
  onUpdateApp: () => void;
}

export const InstallationCard: React.FC<InstallationCardProps> = ({
  pwaState,
  actionLoading,
  onInstallApp,
  onUpdateApp,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Installation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pwaState.isInstalled ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="primary"
                  className="bg-green-100 text-green-800"
                >
                  ✓ Installed
                </Badge>
                <span className="text-muted-foreground">
                  App is installed and running
                </span>
              </div>
            </div>
          ) : pwaState.isInstallable ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 font-medium text-gray-900">
                  Install as App
                </div>
                <div className="text-muted-foreground text-sm">
                  Install Newtype Decks as a native app for better performance
                  and offline access
                </div>
              </div>
              <Button
                onClick={onInstallApp}
                variant="default"
                disabled={actionLoading === 'install'}
              >
                {actionLoading === 'install' ? 'Installing...' : 'Install App'}
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="text-muted-foreground mb-2">
                App installation not available
              </div>
              <div className="text-muted-foreground/70 text-sm">
                Try using a supported browser or check if the app is already
                installed
              </div>
            </div>
          )}

          {pwaState.updateAvailable && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 font-medium text-green-900">
                    Update Available
                  </div>
                  <div className="text-sm text-green-700">
                    A new version of the app is available with improvements and
                    bug fixes
                  </div>
                </div>
                <Button
                  onClick={onUpdateApp}
                  variant="default"
                  size="sm"
                  disabled={actionLoading === 'update'}
                >
                  {actionLoading === 'update' ? 'Updating...' : 'Update Now'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
