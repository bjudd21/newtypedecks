/**
 * Profile information card component
 */

import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ErrorMessage } from './ErrorMessage';
import { ProfileField } from './ProfileField';
import type { User, FormData, FormErrors } from '../types';

interface ProfileInformationCardProps {
  user: User;
  isEditing: boolean;
  isLoading: boolean;
  formData: FormData;
  errors: FormErrors;
  onEditToggle: () => void;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileInformationCard: React.FC<ProfileInformationCardProps> = ({
  user,
  isEditing,
  isLoading,
  formData,
  errors,
  onEditToggle,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#a89ec7]">
          PROFILE INFORMATION
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditToggle}
              disabled={isLoading}
              className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa]/10"
            >
              EDIT
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.general && <ErrorMessage message={errors.general} />}

        <div className="space-y-4">
          <ProfileField
            label="Full Name"
            value={isEditing ? formData.name : user.name || ''}
            type="text"
            isEditing={isEditing}
            onChange={(value) => onInputChange('name', value)}
            error={errors.name}
            disabled={isLoading}
          />

          <ProfileField
            label="Email Address"
            value={isEditing ? formData.email : user.email || ''}
            type="email"
            isEditing={isEditing}
            onChange={(value) => onInputChange('email', value)}
            error={errors.email}
            disabled={isLoading}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Account Role
            </label>
            <p className="text-white capitalize">{user.role.toLowerCase()}</p>
          </div>

          {isEditing && (
            <div className="flex space-x-3 pt-4">
              <Button variant="default" onClick={onSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
