'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-tech font-medium uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50',
        primary: 'border-cyan-400/50 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/50 shadow-lg shadow-cyan-400/20',
        secondary: 'border-gray-500 bg-gray-700/50 text-gray-200 hover:bg-gray-600/50',
        outline: 'border-cyan-400 bg-transparent text-cyan-300 hover:bg-cyan-400/10 shadow-lg shadow-cyan-400/20',
        success: 'border-green-400/50 bg-green-900/30 text-green-300 hover:bg-green-800/50 shadow-lg shadow-green-400/20',
        info: 'border-blue-400/50 bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 shadow-lg shadow-blue-400/20',
        warning: 'border-yellow-400/50 bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/50 shadow-lg shadow-yellow-400/20',
        destructive: 'border-red-400/50 bg-red-900/30 text-red-300 hover:bg-red-800/50 shadow-lg shadow-red-400/20',
        cyber: 'border-cyan-400 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 text-cyan-100 hover:from-cyan-800/60 hover:to-blue-800/60 shadow-lg shadow-cyan-400/30',
        neon: 'border-green-400 bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-100 hover:from-green-800/60 hover:to-emerald-800/60 shadow-lg shadow-green-400/30',
        plasma: 'border-purple-400 bg-gradient-to-r from-purple-900/40 to-pink-900/40 text-purple-100 hover:from-purple-800/60 hover:to-pink-800/60 shadow-lg shadow-purple-400/30',
        hologram: 'border-cyan-400/30 bg-transparent text-cyan-300 hover:border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/10'
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  animate?: boolean;
}

function Badge({ className, variant, size, animate = false, children, ...props }: BadgeProps) {
  const badgeElement = (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {(variant === 'cyber' || variant === 'neon' || variant === 'plasma') && (
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: variant === 'cyber'
              ? 'linear-gradient(90deg, transparent, rgba(0,255,255,0.2), transparent)'
              : variant === 'neon'
              ? 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(147,51,234,0.2), transparent)'
          }}
        />
      )}

      {variant === 'hologram' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'linear'
          }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {badgeElement}
      </motion.div>
    );
  }

  return badgeElement;
}

// Specialized badge for card rarities
export interface RarityBadgeProps {
  rarity: string;
  size?: 'default' | 'sm' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'default',
  animate = true,
  className,
}) => {
  const getRarityVariant = (rarity: string) => {
    const rarityLower = rarity.toLowerCase();
    if (rarityLower.includes('common')) return 'default';
    if (rarityLower.includes('uncommon')) return 'primary';
    if (rarityLower.includes('rare')) return 'cyber';
    if (rarityLower.includes('epic')) return 'neon';
    if (rarityLower.includes('legendary')) return 'plasma';
    if (rarityLower.includes('mythic')) return 'hologram';
    return 'default';
  };

  const rarityVariant = getRarityVariant(rarity);

  type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'info' | 'warning' | 'destructive' | 'cyber' | 'neon' | 'plasma' | 'hologram';

  return (
    <Badge
      variant={rarityVariant as BadgeVariant}
      size={size}
      animate={animate}
      className={cn('select-none', className)}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {rarity}
      </motion.span>

      {/* Add sparkle effect for legendary and mythic */}
      {(rarityVariant === 'plasma' || rarityVariant === 'hologram') && (
        <motion.div
          className="ml-1 w-2 h-2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          ✦
        </motion.div>
      )}
    </Badge>
  );
};

export { Badge, badgeVariants };
