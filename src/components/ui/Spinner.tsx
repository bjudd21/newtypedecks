// Spinner component for loading states
import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
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
  );
};

// Loading overlay component
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
  className,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-2">
          <Spinner size="lg" />
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
export interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'animate-pulse rounded bg-gray-200',
          className || 'h-4 w-full'
        )}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse rounded bg-gray-200',
            index === lines - 1 ? 'w-3/4' : 'w-full',
            className || 'h-4'
          )}
        />
      ))}
    </div>
  );
};

export { Spinner };
