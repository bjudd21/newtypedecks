// Badge component for labels, rarities, and status indicators
import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-200 text-gray-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

// Specialized badge for card rarities
export interface RarityBadgeProps {
  rarity: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  color,
  size = 'md',
  className,
}) => {
  const getRarityVariant = (rarity: string) => {
    const rarityLower = rarity.toLowerCase();
    if (rarityLower.includes('common')) return 'default';
    if (rarityLower.includes('uncommon')) return 'info';
    if (rarityLower.includes('rare')) return 'primary';
    if (rarityLower.includes('epic') || rarityLower.includes('legendary'))
      return 'warning';
    if (rarityLower.includes('mythic')) return 'error';
    return 'default';
  };

  return (
    <Badge
      variant={getRarityVariant(rarity)}
      size={size}
      className={cn(color && `bg-[${color}]`, className)}
    >
      {rarity}
    </Badge>
  );
};

export { Badge };
