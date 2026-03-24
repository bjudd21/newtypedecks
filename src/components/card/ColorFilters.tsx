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
  colors: string[];
}

interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  title: string;
}

function ColorButton({
  color: _color,
  isSelected,
  onClick,
  className,
  title,
}: ColorButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 w-7 cursor-pointer rounded-md shadow-md transition-all duration-300',
        'focus:ring-2 focus:ring-[#6b5a8a] focus:outline-none',
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

const COLOR_CLASS_MAP: Record<string, string> = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  white: 'bg-white border border-gray-300',
  black: 'bg-gray-900 border border-gray-600',
  yellow: 'bg-yellow-400',
  colorless: 'bg-gray-400',
  multi: 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500',
};

function colorClass(color: string): string {
  return COLOR_CLASS_MAP[color.toLowerCase()] ?? 'bg-gray-500';
}

export function ColorFilters({
  selectedColors,
  onToggleColor,
  colors,
}: ColorFiltersProps) {
  if (colors.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium text-gray-400">COLOR:</span>
      {colors.map((color) => (
        <ColorButton
          key={color}
          color={color}
          isSelected={selectedColors.includes(color)}
          onClick={() => onToggleColor(color)}
          className={colorClass(color)}
          title={`Filter by ${color}`}
        />
      ))}
    </div>
  );
}
