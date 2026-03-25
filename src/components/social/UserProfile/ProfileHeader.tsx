/**
 * ProfileHeader Component
 * Displays user avatar, info, stats, and action buttons
 */

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { formatJoinDate, getLastActiveText } from './utils';
import type { UserProfile } from '@/lib/services/socialService';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  isFollowing: boolean;
  currentUser: { id: string } | null | undefined;
  onFollowToggle: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile,
  isFollowing,
  currentUser,
  onFollowToggle,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.displayName}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="text-foreground flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-2xl font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-foreground text-2xl font-bold">
                {profile.displayName}
              </h1>
              {profile.isVerified && (
                <Badge variant="primary" className="bg-primary text-white">
                  ✓ Verified
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-1">@{profile.username}</p>
            {profile.bio && (
              <p className="text-muted-foreground mb-3">{profile.bio}</p>
            )}

            <div className="text-muted-foreground mb-4 flex items-center gap-4 text-sm">
              <span>📅 Joined {formatJoinDate(profile.joinDate)}</span>
              <span>⏰ {getLastActiveText(profile.lastActive)}</span>
              {profile.location && profile.preferences.showLocation && (
                <span>📍 {profile.location}</span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  🔗 Website
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="mb-4 flex items-center gap-6">
              <div className="text-center">
                <div className="text-foreground font-bold">
                  {profile.statistics.followers}
                </div>
                <div className="text-muted-foreground text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-foreground font-bold">
                  {profile.statistics.following}
                </div>
                <div className="text-muted-foreground text-sm">Following</div>
              </div>
              <div className="text-center">
                <div className="text-foreground font-bold">
                  {profile.statistics.publicDecks}
                </div>
                <div className="text-muted-foreground text-sm">
                  Public Decks
                </div>
              </div>
              <div className="text-center">
                <div className="text-foreground font-bold">
                  {profile.statistics.deckLikes}
                </div>
                <div className="text-muted-foreground text-sm">Total Likes</div>
              </div>
            </div>

            {/* Actions */}
            {!isOwnProfile && currentUser && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={onFollowToggle}
                  variant={isFollowing ? 'outline' : 'default'}
                  size="sm"
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
                <Button variant="outline" size="sm">
                  💬 Message
                </Button>
              </div>
            )}

            {isOwnProfile && (
              <div className="flex items-center gap-3">
                <Button variant="default" size="sm">
                  ✏️ Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  ⚙️ Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
