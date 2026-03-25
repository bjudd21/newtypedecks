'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'elevated'
    | 'ghost'
    | 'cyber'
    | 'neon'
    | 'plasma'
    | 'hologram';
  /** Apply the card-lift hover effect (translateY -1px + shadow) */
  lift?: boolean;
}

const variants = {
  // Surface-1: main card surface. Visually distinct from page (surface-0).
  default: 'rounded-lg border border-border/60 bg-card shadow-sm',

  // Surface-2: elevated panel within a card, or a secondary card.
  elevated:
    'rounded-lg border border-border/40 bg-[var(--surface-2,theme(colors.zinc.900))] shadow-md',

  // Minimal ghost — barely there, no background.
  ghost: 'rounded-lg border border-transparent bg-transparent',

  // ── Special effects for game card displays ──
  cyber:
    'rounded-lg border border-cyan-400/40 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 shadow-lg shadow-cyan-400/10 hover:border-cyan-400/70 hover:shadow-cyan-400/25',
  neon: 'rounded-lg border border-green-400/40 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 shadow-lg shadow-green-400/10 hover:border-green-400/70 hover:shadow-green-400/25',
  plasma:
    'rounded-lg border border-purple-500/40 bg-gradient-to-br from-zinc-900/90 via-purple-900/10 to-zinc-800/80 shadow-lg shadow-purple-500/10 hover:border-purple-500/70 hover:shadow-purple-500/25',
  hologram:
    'rounded-lg border border-cyan-400/20 bg-transparent backdrop-blur-md shadow-lg shadow-cyan-400/5 hover:border-cyan-400/40',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, children, variant = 'default', lift = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(variants[variant], lift && 'card-lift', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ── Sub-components ────────────────────────────────────────────────────────────

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1 p-5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-foreground text-base leading-tight font-semibold tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
