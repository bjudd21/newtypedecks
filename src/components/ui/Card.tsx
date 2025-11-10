'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'cyber' | 'neon' | 'plasma' | 'hologram';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    // Extract HTML attributes and omit those that conflict with motion
    const { onClick, onMouseEnter, onMouseLeave, ...restProps } = props;
    const variants = {
      default:
        'rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg',
      cyber:
        'rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm shadow-lg shadow-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/40',
      neon: 'rounded-lg border-2 border-green-400/50 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm shadow-lg shadow-green-400/20 hover:border-green-400 hover:shadow-green-400/40',
      plasma:
        'rounded-lg border-2 border-purple-500/50 bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-gray-900/90 backdrop-blur-sm shadow-lg shadow-purple-500/20 hover:border-purple-500 hover:shadow-purple-500/40',
      hologram:
        'rounded-lg border border-cyan-400/30 bg-gradient-to-br from-transparent via-cyan-900/10 to-transparent backdrop-blur-md shadow-lg shadow-cyan-400/10',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(variants[variant], className)}
        whileHover={{
          y: -4,
          scale: 1.02,
          transition: { type: 'spring', stiffness: 400, damping: 17 },
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...(restProps as Omit<HTMLMotionProps<'div'>, 'ref'>)}
      >
        {variant === 'hologram' && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: 'linear',
            }}
          />
        )}
        {(variant === 'cyber' ||
          variant === 'neon' ||
          variant === 'plasma') && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <motion.div
              className={cn(
                'absolute inset-0 opacity-0 transition-opacity duration-300',
                variant === 'cyber' &&
                  'bg-gradient-to-br from-cyan-400/5 via-transparent to-cyan-400/5',
                variant === 'neon' &&
                  'bg-gradient-to-br from-green-400/5 via-transparent to-green-400/5',
                variant === 'plasma' &&
                  'bg-gradient-to-br from-purple-500/5 via-orange-500/5 to-purple-500/5'
              )}
              whileHover={{ opacity: 1 }}
            />
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-tech text-lg font-semibold uppercase leading-none tracking-wide text-cyan-300',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm font-light leading-relaxed text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
