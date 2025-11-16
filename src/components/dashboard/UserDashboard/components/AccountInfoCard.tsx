/**
 * Account information card component
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import type { User } from '../types';

interface AccountInfoCardProps {
  user: User;
}

export const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user }) => {
  const router = useRouter();

  return (
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">ACCOUNT INFORMATION</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Name
            </label>
            <p className="text-white">{user.name || 'Not set'}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Email
            </label>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Account Type
            </label>
            <p className="text-white capitalize">{user.role.toLowerCase()}</p>
          </div>
          <Button
            variant="brandOutline"
            onClick={() => router.push('/profile')}
            className="w-full"
          >
            EDIT PROFILE
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
