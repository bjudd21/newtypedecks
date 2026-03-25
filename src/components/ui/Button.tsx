'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // ── Primary — game-reactive amber accent ──────────────────────
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]',
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]',

        // ── Destructive ───────────────────────────────────────────────
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]',

        // ── Outline — border only, fills on hover ─────────────────────
        outline:
          'border border-border bg-transparent text-foreground hover:bg-accent hover:border-border/80 active:scale-[0.98]',

        // ── Secondary — zinc fill ─────────────────────────────────────
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',

        // ── Ghost — invisible until hovered ──────────────────────────
        ghost:
          'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.98]',

        // ── Link ──────────────────────────────────────────────────────
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',

        // ── Brand — backwards-compat purple variant ───────────────────
        brand:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]',
        brandOutline:
          'border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]',

        // ── Special effects — kept for game card UI ───────────────────
        cyber:
          'relative overflow-hidden bg-gradient-to-r from-cyan-400 to-blue-500 text-black border border-cyan-400 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/60 active:scale-[0.98]',
        neon: 'relative overflow-hidden bg-transparent text-green-400 border border-green-400 hover:bg-green-400 hover:text-black shadow-lg shadow-green-400/30 hover:shadow-green-400/60 active:scale-[0.98]',
        plasma:
          'relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white border border-purple-500 shadow-lg shadow-purple-400/30 hover:shadow-purple-400/60 active:scale-[0.98]',
        hologram:
          'relative overflow-hidden bg-transparent text-cyan-400 border border-cyan-400/50 hover:border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/10 active:scale-[0.98]',

        // ── Critical / emphasis ───────────────────────────────────────
        critical:
          'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50 active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-9 rounded-md px-4 text-sm',
        lg: 'h-10 rounded-md px-6 text-base',
        xl: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 shrink-0 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
