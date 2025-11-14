'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-tech font-medium uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0d15] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Cyan/Blue - Primary brand actions (tech-focused)
        default:
          'bg-gradient-to-r from-cyan-500 to-blue-600 text-white focus-visible:ring-cyan-400',
        primary:
          'bg-gradient-to-r from-cyan-500 to-blue-600 text-white focus-visible:ring-cyan-400',
        critical:
          'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-400/60 hover:shadow-cyan-400/80 focus-visible:ring-cyan-400',
        outline:
          'border border-cyan-400 bg-transparent text-cyan-400 hover:bg-cyan-400 hover:text-black focus-visible:ring-cyan-400',

        // Purple - Theme/brand decorative elements
        brand:
          'bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] text-white focus-visible:ring-[#8b7aaa]',
        brandOutline:
          'border border-[#8b7aaa] bg-transparent text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white focus-visible:ring-[#8b7aaa]',

        // Other variants
        destructive:
          'bg-gradient-to-r from-red-500 to-red-700 text-white focus-visible:ring-red-400',
        secondary:
          'bg-gradient-to-r from-gray-700 to-gray-800 text-white focus-visible:ring-gray-400',
        ghost:
          'text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 focus-visible:ring-cyan-400',
        link: 'text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300 focus-visible:ring-cyan-400',

        // Special effects (keep existing)
        cyber:
          'relative overflow-hidden bg-gradient-to-r from-cyan-400 to-purple-600 text-black border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/80 hover:border-green-400 focus-visible:ring-cyan-400',
        neon: 'relative overflow-hidden bg-transparent text-green-400 border-2 border-green-400 hover:bg-green-400 hover:text-black shadow-lg shadow-green-400/50 hover:shadow-green-400/80 focus-visible:ring-green-400',
        plasma:
          'relative overflow-hidden bg-gradient-to-r from-purple-600 to-orange-500 text-white border-2 border-purple-600 shadow-lg shadow-purple-400/50 hover:shadow-purple-400/80 hover:border-orange-400 focus-visible:ring-purple-400',
        hologram:
          'relative overflow-hidden bg-transparent text-cyan-400 border border-cyan-400/50 hover:border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/20 focus-visible:ring-cyan-400',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-10 rounded-md px-5 text-sm',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-lg px-10 text-lg',
        icon: 'h-11 w-11',
      },
      emphasis: {
        high: 'shadow-2xl',
        normal: 'shadow-lg',
        low: '',
      },
    },
    compoundVariants: [
      // Cyan variants with emphasis
      {
        variant: ['default', 'primary'],
        emphasis: 'high',
        class: 'shadow-cyan-400/60 hover:shadow-cyan-400/80',
      },
      {
        variant: ['default', 'primary'],
        emphasis: 'normal',
        class: 'shadow-cyan-400/30 hover:shadow-cyan-400/50',
      },
      {
        variant: 'outline',
        emphasis: 'high',
        class: 'shadow-xl shadow-cyan-400/40 hover:shadow-cyan-400/60',
      },
      {
        variant: 'outline',
        emphasis: 'normal',
        class: 'shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40',
      },
      // Purple/Brand variants with emphasis
      {
        variant: 'brand',
        emphasis: 'high',
        class: 'shadow-[#8b7aaa]/60 hover:shadow-[#8b7aaa]/80',
      },
      {
        variant: 'brand',
        emphasis: 'normal',
        class: 'shadow-[#8b7aaa]/30 hover:shadow-[#8b7aaa]/50',
      },
      {
        variant: 'brandOutline',
        emphasis: 'high',
        class: 'shadow-xl shadow-[#8b7aaa]/40 hover:shadow-[#8b7aaa]/60',
      },
      {
        variant: 'brandOutline',
        emphasis: 'normal',
        class: 'shadow-lg shadow-[#8b7aaa]/20 hover:shadow-[#8b7aaa]/40',
      },
      // Destructive variants with emphasis
      {
        variant: 'destructive',
        emphasis: 'high',
        class: 'shadow-red-400/60 hover:shadow-red-400/80',
      },
      {
        variant: 'destructive',
        emphasis: 'normal',
        class: 'shadow-red-400/30 hover:shadow-red-400/50',
      },
      // Secondary with emphasis
      {
        variant: 'secondary',
        emphasis: 'high',
        class: 'shadow-gray-400/40',
      },
      {
        variant: 'secondary',
        emphasis: 'normal',
        class: 'shadow-gray-400/30',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      emphasis: 'normal',
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

    const LoadingSpinner = () => (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="mr-2 h-4 w-4"
      >
        <svg
          className="h-full w-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </motion.div>
    );

    const buttonContent = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {(variant === 'cyber' ||
          variant === 'neon' ||
          variant === 'plasma') && (
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              background:
                variant === 'cyber'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.4) 50%, transparent 100%)'
                  : variant === 'neon'
                    ? 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.4) 50%, transparent 100%)'
                    : 'linear-gradient(90deg, transparent 0%, rgba(147,51,234,0.4) 50%, transparent 100%)',
            }}
          />
        )}

        {variant === 'hologram' && (
          <>
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute inset-0 -z-20"
              animate={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 30% 70%, rgba(147,51,234,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 30%, rgba(34,197,94,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        <span className="relative z-10 flex items-center">
          {isLoading && <LoadingSpinner />}
          {children}
        </span>
      </Comp>
    );

    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {buttonContent}
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
