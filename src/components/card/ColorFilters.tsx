/**
 * Color Filters Component
 * Interactive color filter buttons
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ColorFiltersProps {
  selectedColors: string[];
  onToggleColor: (color: string) => void;
}

interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  title: string;
}

function ColorButton({ color: _color, isSelected, onClick, className, title }: ColorButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 w-7 cursor-pointer rounded-md shadow-md transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a]',
        isSelected
          ? 'scale-110 ring-2 ring-[#6b5a8a] ring-offset-2 ring-offset-[#2d2640]'
          : 'hover:scale-105 hover:ring-2 hover:ring-[#6b5a8a]/50',
        className
      )}
      title={title}
      aria-pressed={isSelected}
    />
  );
}

const COLOR_CONFIG = [
  { color: 'blue', className: 'bg-blue-600', title: 'Filter by Blue' },
  { color: 'green', className: 'bg-green-600', title: 'Filter by Green' },
  { color: 'red', className: 'bg-red-600', title: 'Filter by Red' },
  { color: 'purple', className: 'bg-purple-600', title: 'Filter by Purple' },
  { color: 'white', className: 'bg-white border border-gray-300', title: 'Filter by White' },
  { color: 'colorless', className: 'bg-gray-400', title: 'Filter by Colorless' },
];

export function ColorFilters({ selectedColors, onToggleColor }: ColorFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium text-gray-400">COLOR:</span>
      {COLOR_CONFIG.map(({ color, className, title }) => (
        <ColorButton
          key={color}
          color={color}
          isSelected={selectedColors.includes(color)}
          onClick={() => onToggleColor(color)}
          className={className}
          title={title}
        />
      ))}
    </div>
  );
}
