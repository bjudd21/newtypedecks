'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { validateEmail } from '@/lib/auth-utils';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const { update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Failed to update profile' });
        return;
      }

      // Update the session with new data
      await update({
        user: {
          name: formData.name,
          email: formData.email,
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    // TODO: Replace with proper confirmation dialog component
    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await response.json();
        setErrors({ general: data.error || 'Failed to delete account' });
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Profile Information */}
      <Card className="border-[#443a5c] bg-[#2d2640]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#a89ec7]">
            PROFILE INFORMATION
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa]/10"
              >
                EDIT
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              {isEditing ? (
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  disabled={isLoading}
                />
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Full Name
                  </label>
                  <p className="text-white">{user.name || 'No name set'}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              {isEditing ? (
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  disabled={isLoading}
                />
              ) : (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Email Address
                  </label>
                  <p className="text-white">{user.email}</p>
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Account Role
              </label>
              <p className="capitalize text-white">
                {user.role.toLowerCase()}
              </p>
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
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

            {/* Account Statistics */}
            <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
              <h3 className="mb-2 font-medium text-white">
                Account Statistics
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">
                  Member since: {new Date().toLocaleDateString()}
                </p>
                <p className="text-gray-400">Total decks created: 0</p>
                <p className="text-gray-400">Cards in collection: 0</p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
              <h3 className="mb-2 font-medium text-red-400">Danger Zone</h3>
              <p className="mb-3 text-sm text-red-300/70">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                DELETE ACCOUNT
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfile;
