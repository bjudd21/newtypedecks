/**
 * CardEditorForm — the right pane of the card editor. All game-specific
 * structure (numeric stats, custom attributes) renders from GameConfig,
 * so new games get a correct form with no code changes.
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { GameConfig } from '@/lib/types/game';
import type { useCardForm } from '../hooks/useCardForm';
import type { AdminCard, ReferenceData } from '../types';
import { ToggleGroup } from './fields/ToggleGroup';
import { NumberStrip } from './fields/NumberStrip';
import { ImageUploadField } from './fields/ImageUploadField';
import { CustomFieldsSection } from './CustomFieldsSection';

interface CardEditorFormProps {
  selected: AdminCard | 'new';
  config: GameConfig;
  reference: ReferenceData;
  formApi: ReturnType<typeof useCardForm>;
  onDelete: () => void;
}

export function CardEditorForm({
  selected,
  config,
  reference,
  formApi,
  onDelete,
}: CardEditorFormProps) {
  const { form, errors, saveState, isDirty, update, updateCoreValue, save } =
    formApi;
  const isNew = selected === 'new';
  const numericFields = config.cardSchema.fields.filter(
    (f) => f.type === 'number'
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
      aria-label={isNew ? 'Create card' : 'Edit card'}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-foreground truncate text-xl font-semibold">
            {isNew ? 'New card' : `Editing ${selected.setNumber}`}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {isDirty ? 'Unsaved changes' : 'All changes saved'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isNew && (
            <Button type="button" variant="ghost" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={saveState.status === 'saving'}
          >
            {saveState.status === 'saving' ? 'Saving…' : 'Save card'}
          </Button>
        </div>
      </div>

      {saveState.status === 'error' && (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
        >
          {saveState.message}
        </div>
      )}

      <ImageUploadField
        imageUrl={form.imageUrl}
        cardName={form.name}
        onUploaded={(urls) => {
          update('imageUrl', urls.imageUrl);
          update('imageUrlSmall', urls.imageUrlSmall);
          update('imageUrlLarge', urls.imageUrlLarge);
        }}
      />
      {errors.imageUrl && (
        <p className="text-destructive -mt-4 text-sm">{errors.imageUrl}</p>
      )}

      <IdentityFields formApi={formApi} reference={reference} />

      <ToggleGroup
        label="Type"
        options={reference.types.map((t) => ({ value: t.id, label: t.name }))}
        value={form.typeId || null}
        onChange={(v) => update('typeId', v ?? '')}
        error={errors.typeId}
      />
      <ToggleGroup
        label="Rarity"
        options={reference.rarities.map((r) => ({
          value: r.id,
          label: r.name,
        }))}
        value={form.rarityId || null}
        onChange={(v) => update('rarityId', v ?? '')}
        error={errors.rarityId}
      />

      {/* Numeric stats from the game's card schema */}
      {numericFields.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {numericFields.map((field) => (
            <NumberStrip
              key={field.key}
              label={field.label}
              value={form.coreValues[field.key] ?? null}
              onChange={(v) => updateCoreValue(field.key, v)}
            />
          ))}
        </div>
      )}

      {/* Game-specific attributes from customFields */}
      <CustomFieldsSection config={config} formApi={formApi} />

      <TextFields formApi={formApi} />

      <FlagsRow formApi={formApi} />
    </form>
  );
}

interface SectionProps {
  formApi: ReturnType<typeof useCardForm>;
}

function IdentityFields({
  formApi,
  reference,
}: SectionProps & { reference: ReferenceData }) {
  const { form, errors, update } = formApi;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        required
      />
      <Input
        label="Card number"
        value={form.setNumber}
        onChange={(e) => update('setNumber', e.target.value)}
        placeholder="e.g. GD05-036"
        error={errors.setNumber}
        required
      />
      <Select
        label="Set"
        options={reference.sets.map((s) => ({
          value: s.id,
          label: s.code ? `${s.code} — ${s.name}` : s.name,
        }))}
        value={form.setId}
        onChange={(v) => update('setId', v)}
        error={errors.setId}
        required
      />
      <Input
        label="Language"
        value={form.language}
        onChange={(e) => update('language', e.target.value)}
        placeholder="en"
      />
    </div>
  );
}

function TextFields({ formApi }: SectionProps) {
  const { form, update } = formApi;
  return (
    <div className="space-y-4">
      <TextArea
        label="Card text"
        value={form.officialText}
        onChange={(v) => update('officialText', v)}
        placeholder="Official card text / effect"
      />
      <TextArea
        label="Notes"
        value={form.description}
        onChange={(v) => update('description', v)}
        placeholder="Internal notes or flavor description"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Keywords (comma separated)"
          value={form.keywordsInput}
          onChange={(e) => update('keywordsInput', e.target.value)}
        />
        <Input
          label="Tags (comma separated)"
          value={form.tagsInput}
          onChange={(e) => update('tagsInput', e.target.value)}
        />
      </div>
    </div>
  );
}

function FlagsRow({ formApi }: SectionProps) {
  const { form, update } = formApi;
  return (
    <div className="flex flex-wrap gap-6">
      <FlagToggle
        label="Alt art"
        value={form.isAlternate}
        onChange={(v) => update('isAlternate', v)}
      />
      <FlagToggle
        label="Foil"
        value={form.isFoil}
        onChange={(v) => update('isFoil', v)}
      />
      <FlagToggle
        label="Promo"
        value={form.isPromo}
        onChange={(v) => update('isPromo', v)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-foreground mb-1.5 block text-sm font-medium">
        {label}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring mt-1.5 block w-full rounded-md border px-3 py-2 text-sm font-normal focus:ring-1 focus:outline-none"
        />
      </label>
    </div>
  );
}

function FlagToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <ToggleGroup
      label={label}
      options={[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]}
      value={value ? 'yes' : 'no'}
      onChange={(v) => onChange(v === 'yes')}
    />
  );
}
