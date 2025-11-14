'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/ui/FileUpload';

interface CardFormData {
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber: string;
  imageUrl?: string;
  description?: string;
  officialText?: string;
  level?: number;
  cost?: number;
  clashPoints?: number;
  price?: number;
  hitPoints?: number;
  attackPoints?: number;
  faction?: string;
  pilot?: string;
  model?: string;
  series?: string;
  nation?: string;
  keywords?: string[];
  tags?: string[];
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  language?: string;
}

interface ReferenceData {
  types: Array<{ id: string; name: string }>;
  rarities: Array<{ id: string; name: string; color: string }>;
  sets: Array<{ id: string; name: string; code: string }>;
}

interface CardFormProps {
  initialData?: Partial<CardFormData>;
  onSubmit: (data: CardFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CardForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CardFormProps) {
  const [formData, setFormData] = useState<CardFormData>({
    name: '',
    typeId: '',
    rarityId: '',
    setId: '',
    setNumber: '',
    language: 'en',
    ...initialData,
  });

  const [referenceData, setReferenceData] = useState<ReferenceData>({
    types: [],
    rarities: [],
    sets: [],
  });

  const [keywordsInput, setKeywordsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingRef, setIsLoadingRef] = useState(true);

  // Load reference data
  useEffect(() => {
    async function loadReferenceData() {
      try {
        const [typesRes, raritiesRes, setsRes] = await Promise.all([
          fetch('/api/reference/types'),
          fetch('/api/reference/rarities'),
          fetch('/api/reference/sets'),
        ]);

        const [typesData, raritiesData, setsData] = await Promise.all([
          typesRes.json(),
          raritiesRes.json(),
          setsRes.json(),
        ]);

        // Extract arrays from response objects
        const types = typesData.types || [];
        const rarities = raritiesData.rarities || [];
        const sets = setsData.sets || [];

        setReferenceData({ types, rarities, sets });

        // Set default values if creating new card
        if (!initialData) {
          setFormData((prev) => ({
            ...prev,
            typeId: types[0]?.id || '',
            rarityId: rarities[0]?.id || '',
            setId: sets[0]?.id || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setIsLoadingRef(false);
      }
    }

    loadReferenceData();

    // Initialize keywords and tags inputs
    if (initialData?.keywords) {
      setKeywordsInput(initialData.keywords.join(', '));
    }
    if (initialData?.tags) {
      setTagsInput(initialData.tags.join(', '));
    }
  }, [initialData]);

  const handleChange = (field: keyof CardFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/card-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      handleChange('imageUrl', data.url);
    } catch (error) {
      console.error('Image upload failed:', error);
      setErrors((prev) => ({ ...prev, imageUrl: 'Failed to upload image' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.typeId) {
      newErrors.typeId = 'Type is required';
    }
    if (!formData.rarityId) {
      newErrors.rarityId = 'Rarity is required';
    }
    if (!formData.setId) {
      newErrors.setId = 'Set is required';
    }
    if (!formData.setNumber.trim()) {
      newErrors.setNumber = 'Set number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Parse keywords and tags
    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await onSubmit({
      ...formData,
      keywords,
      tags,
    });
  };

  if (isLoadingRef) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Basic Information</h3>

        <Input
          label="Card Name *"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter card name"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Type *"
            value={formData.typeId}
            onChange={(value: string) => handleChange('typeId', value)}
            error={errors.typeId}
            options={[
              { value: '', label: 'Select type' },
              ...referenceData.types.map((type) => ({
                value: type.id,
                label: type.name,
              })),
            ]}
          />

          <Select
            label="Rarity *"
            value={formData.rarityId}
            onChange={(value: string) => handleChange('rarityId', value)}
            error={errors.rarityId}
            options={[
              { value: '', label: 'Select rarity' },
              ...referenceData.rarities.map((rarity) => ({
                value: rarity.id,
                label: rarity.name,
              })),
            ]}
          />

          <Select
            label="Set *"
            value={formData.setId}
            onChange={(value: string) => handleChange('setId', value)}
            error={errors.setId}
            options={[
              { value: '', label: 'Select set' },
              ...referenceData.sets.map((set) => ({
                value: set.id,
                label: `${set.name} (${set.code})`,
              })),
            ]}
          />
        </div>

        <Input
          label="Set Number *"
          value={formData.setNumber}
          onChange={(e) => handleChange('setNumber', e.target.value)}
          error={errors.setNumber}
          placeholder="e.g., 001"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Card Image</h3>
        <FileUpload
          onUpload={handleImageUpload}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
        />
        {formData.imageUrl && (
          <p className="text-sm text-gray-400">
            Current image: {formData.imageUrl}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Stats</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Level"
            type="number"
            value={formData.level?.toString() || ''}
            onChange={(e) =>
              handleChange(
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
              handleChange(
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
              handleChange(
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
              handleChange(
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
              handleChange(
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
              handleChange(
                'price',
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
            placeholder="e.g., 4.99"
            step="0.01"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Categories</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Faction"
            value={formData.faction || ''}
            onChange={(e) => handleChange('faction', e.target.value)}
            placeholder="e.g., Earth Federation"
          />
          <Input
            label="Series"
            value={formData.series || ''}
            onChange={(e) => handleChange('series', e.target.value)}
            placeholder="e.g., UC, CE, AD"
          />
          <Input
            label="Pilot"
            value={formData.pilot || ''}
            onChange={(e) => handleChange('pilot', e.target.value)}
            placeholder="e.g., Amuro Ray"
          />
          <Input
            label="Model"
            value={formData.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="e.g., RX-78-2"
          />
          <Input
            label="Nation"
            value={formData.nation || ''}
            onChange={(e) => handleChange('nation', e.target.value)}
            placeholder="e.g., Japan"
          />
        </div>
      </div>

      {/* Text Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Card Text</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter card description..."
              rows={3}
              className="w-full rounded-md border border-[#443a5c] bg-[#1a1625] px-3 py-2 text-white placeholder-gray-500 focus:border-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa]/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Official Text
            </label>
            <textarea
              value={formData.officialText || ''}
              onChange={(e) => handleChange('officialText', e.target.value)}
              placeholder="Enter official card text..."
              rows={3}
              className="w-full rounded-md border border-[#443a5c] bg-[#1a1625] px-3 py-2 text-white placeholder-gray-500 focus:border-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa]/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Keywords and Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Keywords & Tags</h3>
        <Input
          label="Keywords (comma-separated)"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          placeholder="e.g., Mobile Suit, Newtype, Ace Pilot"
        />
        <Input
          label="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., gundam, protagonist, high-level"
        />
      </div>

      {/* Flags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Special Flags</h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isFoil || false}
              onChange={(e) => handleChange('isFoil', e.target.checked)}
              className="h-4 w-4 rounded border-[#443a5c] bg-[#1a1625] text-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa]/20"
            />
            <span className="text-sm text-gray-300">Foil</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPromo || false}
              onChange={(e) => handleChange('isPromo', e.target.checked)}
              className="h-4 w-4 rounded border-[#443a5c] bg-[#1a1625] text-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa]/20"
            />
            <span className="text-sm text-gray-300">Promo</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isAlternate || false}
              onChange={(e) => handleChange('isAlternate', e.target.checked)}
              className="h-4 w-4 rounded border-[#443a5c] bg-[#1a1625] text-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa]/20"
            />
            <span className="text-sm text-gray-300">Alternate Art</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-[#443a5c] pt-6">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          emphasis="high"
          disabled={isLoading}
        >
          {isLoading
            ? 'Saving...'
            : initialData
              ? 'Update Card'
              : 'Create Card'}
        </Button>
      </div>
    </form>
  );
}
