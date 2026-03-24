/**
 * OAuth providers section
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';
import {
  isGoogleOAuthEnabled,
  isDiscordOAuthEnabled,
  isOAuthEnabled,
} from '@/lib/config/oauth';
import { GoogleIcon } from './icons/GoogleIcon';
import { DiscordIcon } from './icons/DiscordIcon';

interface OAuthSectionProps {
  isLoading: boolean;
  onGoogleSignIn: () => void;
  onDiscordSignIn: () => void;
}

export const OAuthSection: React.FC<OAuthSectionProps> = ({
  isLoading,
  onGoogleSignIn,
  onDiscordSignIn,
}) => {
  if (!isOAuthEnabled()) return null;

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#443a5c]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#2d2640] px-2 text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div
        className={`grid ${isGoogleOAuthEnabled() && isDiscordOAuthEnabled() ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}
      >
        {/* Google Sign In */}
        {isGoogleOAuthEnabled() && (
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <GoogleIcon />
            Google
          </Button>
        )}

        {/* Discord Sign In */}
        {isDiscordOAuthEnabled() && (
          <Button
            type="button"
            variant="outline"
            onClick={onDiscordSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <DiscordIcon />
            Discord
          </Button>
        )}
      </div>
    </>
  );
};
