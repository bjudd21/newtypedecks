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
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">ACCOUNT SETTINGS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Change Password */}
          <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
            <h3 className="mb-2 font-medium text-white">Password</h3>
            <p className="mb-3 text-sm text-gray-400">
              Change your password to keep your account secure.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* TODO: Implement password change */
              }}
              disabled={isLoading}
              className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa]/10"
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
