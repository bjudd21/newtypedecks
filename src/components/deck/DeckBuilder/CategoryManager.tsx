'use client';
/**
 * CategoryManager
 * Inline UI for adding, renaming, and deleting user-defined deck categories.
 */

import React, { useState, useRef, useEffect } from 'react';
import { slugifyCategory, type DeckCategory } from '@/lib/types/deck';

interface CategoryManagerProps {
  categories: DeckCategory[];
  onChange: (categories: DeckCategory[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onChange,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus rename input when entering edit mode
  useEffect(() => {
    if (editingKey && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingKey]);

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    const key = slugifyCategory(trimmed);
    if (categories.some((c) => c.key === key)) return; // duplicate
    onChange([
      ...categories,
      { key, label: trimmed, sortOrder: categories.length },
    ]);
    setNewLabel('');
  };

  const handleRenameStart = (cat: DeckCategory) => {
    setEditingKey(cat.key);
    setEditingLabel(cat.label);
  };

  const handleRenameCommit = () => {
    if (!editingKey) return;
    const trimmed = editingLabel.trim();
    if (!trimmed) {
      setEditingKey(null);
      return;
    }
    onChange(
      categories.map((c) =>
        c.key === editingKey ? { ...c, label: trimmed } : c
      )
    );
    setEditingKey(null);
  };

  const handleDelete = (key: string) => {
    const updated = categories
      .filter((c) => c.key !== key)
      .map((c, i) => ({ ...c, sortOrder: i }));
    onChange(updated);
  };

  return (
    <div className="space-y-1">
      {categories.map((cat) => (
        <div
          key={cat.key}
          className="flex items-center gap-1 rounded border border-[#443a5c]/50 bg-[#1a1625]/40 px-2 py-1 text-xs"
        >
          {editingKey === cat.key ? (
            <input
              ref={inputRef}
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              onBlur={handleRenameCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameCommit();
                if (e.key === 'Escape') setEditingKey(null);
              }}
              className="min-w-0 flex-1 bg-transparent text-[#a89ec7] outline-none"
            />
          ) : (
            <span
              className="min-w-0 flex-1 cursor-pointer truncate text-[#a89ec7] hover:text-white"
              onClick={() => handleRenameStart(cat)}
              title="Click to rename"
            >
              {cat.label}
            </span>
          )}
          <button
            onClick={() => handleDelete(cat.key)}
            className="flex-shrink-0 text-gray-600 hover:text-red-400"
            title="Delete category"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add new category */}
      <div className="flex gap-1">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New category…"
          className="min-w-0 flex-1 rounded border border-[#443a5c] bg-[#1a1625]/40 px-2 py-1 text-xs text-[#a89ec7] placeholder-gray-600 outline-none focus:border-[#8b7aaa]"
        />
        <button
          onClick={handleAdd}
          disabled={!newLabel.trim()}
          className="rounded border border-[#443a5c] px-2 py-1 text-xs text-[#a89ec7] hover:border-[#8b7aaa] hover:bg-[#8b7aaa]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
};
