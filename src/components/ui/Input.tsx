'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'cyber' | 'neon' | 'plasma';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      id,
      variant = 'default',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const variants = {
      default:
        'border-gray-700 bg-gray-900/50 text-white focus:border-cyan-400 focus:ring-cyan-400/50',
      cyber:
        'border-cyan-400/50 bg-gray-900/70 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/30 focus:shadow-lg focus:shadow-cyan-400/20',
      neon: 'border-green-400/50 bg-gray-900/70 text-green-100 focus:border-green-400 focus:ring-green-400/30 focus:shadow-lg focus:shadow-green-400/20',
      plasma:
        'border-purple-500/50 bg-gray-900/70 text-purple-100 focus:border-purple-500 focus:ring-purple-500/30 focus:shadow-lg focus:shadow-purple-500/20',
    };

    const labelVariants = {
      default: 'text-gray-400',
      cyber: 'text-cyan-400',
      neon: 'text-green-400',
      plasma: 'text-purple-400',
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label
            htmlFor={inputId}
            suppressHydrationWarning={!id}
            className={cn(
              'font-tech mb-2 block text-sm font-medium uppercase tracking-wide transition-colors duration-300',
              labelVariants[variant],
              isFocused && variant === 'cyber' && 'text-cyan-300',
              isFocused && variant === 'neon' && 'text-green-300',
              isFocused && variant === 'plasma' && 'text-purple-300'
            )}
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <motion.input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-lg border-2 px-4 py-3 text-sm font-medium backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
              variants[variant],
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            ref={ref}
            id={inputId}
            suppressHydrationWarning={!id}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            whileFocus={{
              scale: 1.01,
              y: -1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...(props as Omit<HTMLMotionProps<'input'>, 'ref'>)}
          />

          {/* Scan line animation on focus */}
          <motion.div
            className={cn(
              'absolute bottom-0 left-0 h-0.5 rounded-full',
              variant === 'cyber' && 'bg-cyan-400',
              variant === 'neon' && 'bg-green-400',
              variant === 'plasma' && 'bg-purple-500',
              variant === 'default' && 'bg-cyan-400'
            )}
            initial={{ width: '0%' }}
            animate={{ width: isFocused ? '100%' : '0%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />

          {/* Floating particles on focus for special variants */}
          {isFocused &&
            (variant === 'cyber' ||
              variant === 'neon' ||
              variant === 'plasma') && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'pointer-events-none absolute h-1 w-1 rounded-full',
                      variant === 'cyber' && 'bg-cyan-400',
                      variant === 'neon' && 'bg-green-400',
                      variant === 'plasma' && 'bg-purple-500'
                    )}
                    initial={{
                      x: '50%',
                      y: '50%',
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      x: `${50 + (i - 1) * 30}%`,
                      y: `${30 + i * 20}%`,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </>
            )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm font-medium text-red-400"
          >
            {error}
          </motion.p>
        )}

        {helperText && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-gray-500"
          >
            {helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
