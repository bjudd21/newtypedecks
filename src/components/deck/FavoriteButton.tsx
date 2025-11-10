'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

interface FavoriteButtonProps {
  deckId: string;
  deckName?: string;
  onFavoriteChange?: (isFavorited: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  deckId,
  deckName,
  onFavoriteChange,
  size = 'md',
  variant = 'button',
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if deck is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !deckId) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/favorites/${deckId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (err) {
        console.error('Error checking favorite status:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [deckId, isAuthenticated]);

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      console.warn(
        'TODO: Replace with proper UI notification - Please sign in to favorite decks!'
      );
      return;
    }

    try {
      setIsLoading(true);

      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${deckId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove favorite');
        }

        setIsFavorited(false);
        if (onFavoriteChange) {
          onFavoriteChange(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deckId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add favorite');
        }

        setIsFavorited(true);
        if (onFavoriteChange) {
          onFavoriteChange(true);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      console.warn(
        `TODO: Replace with proper UI notification - ${err instanceof Error ? err.message : 'Failed to update favorite'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        {variant === 'icon' ? '♥' : 'Loading...'}
      </Button>
    );
  }

  const heartIcon = isFavorited ? '♥' : '♡';
  const buttonText = isFavorited ? 'Favorited' : 'Add to Favorites';

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`
          transform text-2xl transition-colors duration-200 hover:scale-110
          ${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
          ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${className}
        `}
        title={
          isFavorited
            ? `Remove ${deckName || 'deck'} from favorites`
            : `Add ${deckName || 'deck'} to favorites`
        }
      >
        {heartIcon}
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      variant={isFavorited ? 'primary' : 'outline'}
      size={size}
      className={`
        flex items-center gap-2
        ${isFavorited ? 'border-red-500 bg-red-500 hover:bg-red-600' : 'hover:border-red-300 hover:text-red-600'}
        ${className}
      `}
    >
      <span className={isFavorited ? 'text-white' : 'text-current'}>
        {heartIcon}
      </span>
      {isLoading ? 'Updating...' : buttonText}
    </Button>
  );
};

export default FavoriteButton;
