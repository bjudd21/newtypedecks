/**
 * CustomFieldsSection — renders the active game's cardSchema.customFields.
 * Values persist to the Card.gameAttributes JSONB, which powers the
 * game-specific search filters and deck validation.
 */

import React from 'react';
import { Input } from '@/components/ui/Input';
import type { GameConfig } from '@/lib/types/game';
import type { useCardForm } from '../hooks/useCardForm';
import { ToggleGroup } from './fields/ToggleGroup';

interface CustomFieldsSectionProps {
  config: GameConfig;
  formApi: ReturnType<typeof useCardForm>;
}

export function CustomFieldsSection({
  config,
  formApi,
}: CustomFieldsSectionProps) {
  const { form, updateCustomValue } = formApi;
  const customFields = config.cardSchema.customFields;

  if (customFields.length === 0) return null;

  const selectFields = customFields.filter(
    (f) => f.type === 'select' || f.type === 'boolean'
  );
  const inputFields = customFields.filter(
    (f) => f.type === 'text' || f.type === 'number'
  );

  return (
    <section aria-label="Game-specific attributes" className="space-y-4">
      {selectFields.map((field) =>
        field.type === 'boolean' ? (
          <ToggleGroup
            key={field.key}
            label={field.label}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            value={
              form.customValues[field.key] === true
                ? 'yes'
                : form.customValues[field.key] === false
                  ? 'no'
                  : null
            }
            allowDeselect
            onChange={(v) =>
              updateCustomValue(field.key, v === null ? null : v === 'yes')
            }
          />
        ) : (
          <ToggleGroup
            key={field.key}
            label={field.label}
            options={(field.options ?? []).map((o) => ({
              value: o,
              label: o,
            }))}
            value={
              typeof form.customValues[field.key] === 'string'
                ? (form.customValues[field.key] as string)
                : null
            }
            allowDeselect
            onChange={(v) => updateCustomValue(field.key, v)}
          />
        )
      )}

      {inputFields.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {inputFields.map((field) => (
            <Input
              key={field.key}
              label={field.label}
              type={field.type === 'number' ? 'number' : 'text'}
              value={
                form.customValues[field.key] === null ||
                form.customValues[field.key] === undefined
                  ? ''
                  : String(form.customValues[field.key])
              }
              onChange={(e) => {
                const raw = e.target.value;
                if (field.type === 'number') {
                  updateCustomValue(field.key, raw === '' ? null : Number(raw));
                } else {
                  updateCustomValue(field.key, raw === '' ? null : raw);
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
