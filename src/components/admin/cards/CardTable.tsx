'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Card {
  id: string;
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  level?: number | null;
  cost?: number | null;
  imageUrl?: string | null;
  setNumber?: string | null;
  type?: { name: string } | null;
  rarity?: { name: string; color: string } | null;
  set?: { name: string; code: string } | null;
  createdAt?: Date | string;
}

interface CardTableProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  isLoading?: boolean;
}

export function CardTable({
  cards,
  onEdit,
  onDelete,
  isLoading,
}: CardTableProps) {
  const [sortField, setSortField] = useState<keyof Card>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Card) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedCards = [...cards].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle nested properties
    if (sortField === 'type' && a.type && b.type) {
      aVal = a.type.name;
      bVal = b.type.name;
    }
    if (sortField === 'rarity' && a.rarity && b.rarity) {
      aVal = a.rarity.name;
      bVal = b.rarity.name;
    }
    if (sortField === 'set' && a.set && b.set) {
      aVal = a.set.name;
      bVal = b.set.name;
    }

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-12 text-center backdrop-blur-md">
        <p className="text-gray-400">No cards found</p>
        <p className="mt-2 text-sm text-gray-500">
          Create your first card to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#443a5c] bg-[#1a1625]">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('imageUrl')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Image
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
                >
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('type')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Type
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('rarity')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Rarity
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('set')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Set
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('level')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Level
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('cost')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cost
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-gray-300">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#443a5c]">
            {sortedCards.map((card) => (
              <tr
                key={card.id}
                className="transition-colors hover:bg-[#3d3450]/30"
              >
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-[#1a1625]">
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs">
                    <div className="truncate font-medium text-white">
                      {card.name}
                    </div>
                    {card.setNumber && (
                      <div className="text-xs text-gray-400">
                        #{card.setNumber}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {card.type ? (
                    <Badge variant="secondary" className="text-xs">
                      {card.type.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {card.rarity ? (
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${card.rarity.color}20`,
                        color: card.rarity.color,
                        borderColor: `${card.rarity.color}40`,
                      }}
                    >
                      {card.rarity.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {card.set ? (
                    <div className="text-sm">
                      <div className="text-gray-300">{card.set.name}</div>
                      <div className="text-xs text-gray-500">
                        {card.set.code}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {card.level !== null && card.level !== undefined ? (
                    <span className="text-sm text-gray-300">{card.level}</span>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {card.cost !== null && card.cost !== undefined ? (
                    <span className="text-sm text-gray-300">{card.cost}</span>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(card)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(card)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
