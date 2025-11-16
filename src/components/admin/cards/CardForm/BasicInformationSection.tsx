/**
 * BasicInformationSection Component
 * Form section for basic card information (name, type, rarity, set)
 */

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { SectionProps } from './types';

export const BasicInformationSection: React.FC<SectionProps> = ({
  formData,
  errors,
  referenceData,
  onChange,
}) => {
  if (!referenceData) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Basic Information</h3>

      <Input
        label="Card Name *"
        value={formData.name}
        onChange={(e) => onChange('name', e.target.value)}
        error={errors.name}
        placeholder="Enter card name"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Select
          label="Type *"
          value={formData.typeId}
          onChange={(value: string) => onChange('typeId', value)}
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
          onChange={(value: string) => onChange('rarityId', value)}
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
          onChange={(value: string) => onChange('setId', value)}
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
        onChange={(e) => onChange('setNumber', e.target.value)}
        error={errors.setNumber}
        placeholder="e.g., 001"
      />
    </div>
  );
};
