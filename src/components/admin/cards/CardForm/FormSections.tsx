/**
 * FormSections Components
 * Various form sections for card attributes
 */

import React from 'react';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import type { CardFormData } from './types';

// Image Upload Section
interface ImageUploadSectionProps {
  imageUrl?: string;
  onUpload: (file: File) => Promise<void>;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imageUrl,
  onUpload,
}) => (
  <div className="space-y-4">
    <h3 className="text-foreground text-lg font-semibold">Card Image</h3>
    <FileUpload
      onUpload={onUpload}
      accept="image/*"
      maxSize={5 * 1024 * 1024} // 5MB
    />
    {imageUrl && (
      <p className="text-muted-foreground text-sm">Current image: {imageUrl}</p>
    )}
  </div>
);

// Stats Section
interface StatsSectionProps {
  formData: CardFormData;
  onChange: (field: keyof CardFormData, value: unknown) => void;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  formData,
  onChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-foreground text-lg font-semibold">Stats</h3>
    <div className="grid gap-4 md:grid-cols-3">
      <Input
        label="Level"
        type="number"
        value={formData.level?.toString() || ''}
        onChange={(e) =>
          onChange(
            'level',
            e.target.value ? parseInt(e.target.value) : undefined
          )
        }
        placeholder="0-10"
        min={0}
        max={10}
      />
      <Input
        label="Cost"
        type="number"
        value={formData.cost?.toString() || ''}
        onChange={(e) =>
          onChange(
            'cost',
            e.target.value ? parseInt(e.target.value) : undefined
          )
        }
        placeholder="0-20"
        min={0}
        max={20}
      />
      <Input
        label="Clash Points"
        type="number"
        value={formData.clashPoints?.toString() || ''}
        onChange={(e) =>
          onChange(
            'clashPoints',
            e.target.value ? parseInt(e.target.value) : undefined
          )
        }
        placeholder="e.g., 5000"
      />
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <Input
        label="Hit Points"
        type="number"
        value={formData.hitPoints?.toString() || ''}
        onChange={(e) =>
          onChange(
            'hitPoints',
            e.target.value ? parseInt(e.target.value) : undefined
          )
        }
        placeholder="e.g., 8000"
      />
      <Input
        label="Attack Points"
        type="number"
        value={formData.attackPoints?.toString() || ''}
        onChange={(e) =>
          onChange(
            'attackPoints',
            e.target.value ? parseInt(e.target.value) : undefined
          )
        }
        placeholder="e.g., 6000"
      />
      <Input
        label="Price"
        type="number"
        value={formData.price?.toString() || ''}
        onChange={(e) =>
          onChange(
            'price',
            e.target.value ? parseFloat(e.target.value) : undefined
          )
        }
        placeholder="e.g., 4.99"
        step="0.01"
      />
    </div>
  </div>
);

// Categories Section
export const CategoriesSection: React.FC<StatsSectionProps> = ({
  formData,
  onChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-foreground text-lg font-semibold">Categories</h3>
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Faction"
        value={formData.faction || ''}
        onChange={(e) => onChange('faction', e.target.value)}
        placeholder="e.g., Alliance, Empire..."
      />
      <Input
        label="Series"
        value={formData.series || ''}
        onChange={(e) => onChange('series', e.target.value)}
        placeholder="e.g., Series 1, Arc 2..."
      />
      <Input
        label="Pilot"
        value={formData.pilot || ''}
        onChange={(e) => onChange('pilot', e.target.value)}
        placeholder="e.g., Amuro Ray"
      />
      <Input
        label="Model"
        value={formData.model || ''}
        onChange={(e) => onChange('model', e.target.value)}
        placeholder="e.g., RX-78-2"
      />
      <Input
        label="Nation"
        value={formData.nation || ''}
        onChange={(e) => onChange('nation', e.target.value)}
        placeholder="e.g., Japan"
      />
    </div>
  </div>
);

// Text Fields Section
export const TextFieldsSection: React.FC<StatsSectionProps> = ({
  formData,
  onChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-foreground text-lg font-semibold">Card Text</h3>
    <div className="space-y-4">
      <div>
        <label className="text-foreground mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Enter card description..."
          rows={3}
          className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary focus:ring-ring/20 text-foreground w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-foreground mb-1 block text-sm font-medium">
          Official Text
        </label>
        <textarea
          value={formData.officialText || ''}
          onChange={(e) => onChange('officialText', e.target.value)}
          placeholder="Enter official card text..."
          rows={3}
          className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary focus:ring-ring/20 text-foreground w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
        />
      </div>
    </div>
  </div>
);

// Keywords and Tags Section
interface KeywordsTagsSectionProps {
  keywordsInput: string;
  tagsInput: string;
  onKeywordsChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export const KeywordsTagsSection: React.FC<KeywordsTagsSectionProps> = ({
  keywordsInput,
  tagsInput,
  onKeywordsChange,
  onTagsChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-foreground text-lg font-semibold">Keywords & Tags</h3>
    <Input
      label="Keywords (comma-separated)"
      value={keywordsInput}
      onChange={(e) => onKeywordsChange(e.target.value)}
      placeholder="e.g., Mobile Suit, Newtype, Ace Pilot"
    />
    <Input
      label="Tags (comma-separated)"
      value={tagsInput}
      onChange={(e) => onTagsChange(e.target.value)}
      placeholder="e.g., gundam, protagonist, high-level"
    />
  </div>
);

// Flags Section
export const FlagsSection: React.FC<StatsSectionProps> = ({
  formData,
  onChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-foreground text-lg font-semibold">Special Flags</h3>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isFoil || false}
          onChange={(e) => onChange('isFoil', e.target.checked)}
          className="border-border bg-background text-primary focus:ring-ring/20 h-4 w-4 rounded focus:ring-2"
        />
        <span className="text-foreground text-sm">Foil</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isPromo || false}
          onChange={(e) => onChange('isPromo', e.target.checked)}
          className="border-border bg-background text-primary focus:ring-ring/20 h-4 w-4 rounded focus:ring-2"
        />
        <span className="text-foreground text-sm">Promo</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isAlternate || false}
          onChange={(e) => onChange('isAlternate', e.target.checked)}
          className="border-border bg-background text-primary focus:ring-ring/20 h-4 w-4 rounded focus:ring-2"
        />
        <span className="text-foreground text-sm">Alternate Art</span>
      </label>
    </div>
  </div>
);
