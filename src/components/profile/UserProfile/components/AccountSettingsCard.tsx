/**
 * Account settings card component
 */

import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { AccountStatistics } from './AccountStatistics';
import { DangerZone } from './DangerZone';

interface AccountSettingsCardProps {
  isLoading: boolean;
  onDeleteAccount: () => void;
}

export const AccountSettingsCard: React.FC<AccountSettingsCardProps> = ({
  isLoading,
  onDeleteAccount,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80">ACCOUNT SETTINGS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Change Password */}
          <div className="border-border bg-background rounded-lg border p-4">
            <h3 className="mb-2 font-medium text-white">Password</h3>
            <p className="text-muted-foreground mb-3 text-sm">
              Change your password to keep your account secure.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* TODO: Implement password change */
              }}
              disabled={isLoading}
              className="border-primary text-primary hover:bg-primary/10"
            >
              CHANGE PASSWORD
            </Button>
          </div>

          <AccountStatistics />

          <DangerZone onDeleteAccount={onDeleteAccount} disabled={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
};
