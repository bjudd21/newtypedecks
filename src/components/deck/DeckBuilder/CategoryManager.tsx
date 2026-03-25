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
          className="border-border/50 bg-background/40 flex items-center gap-1 rounded border px-2 py-1 text-xs"
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
              className="text-primary/80 min-w-0 flex-1 bg-transparent outline-none"
            />
          ) : (
            <span
              className="text-primary/80 hover:text-foreground min-w-0 flex-1 cursor-pointer truncate"
              onClick={() => handleRenameStart(cat)}
              title="Click to rename"
            >
              {cat.label}
            </span>
          )}
          <button
            onClick={() => handleDelete(cat.key)}
            className="text-muted-foreground flex-shrink-0 hover:text-red-400"
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
          className="border-border bg-background/40 text-primary/80 focus:border-primary min-w-0 flex-1 rounded border px-2 py-1 text-xs placeholder-gray-600 outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={!newLabel.trim()}
          className="border-border text-primary/80 hover:border-primary hover:bg-primary/20 rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
};
