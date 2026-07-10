/**
 * useCardForm — form state for the card editor, derived from the selected
 * card and the active game's GameConfig card schema.
 */

import { useCallback, useEffect, useState } from 'react';
import type { GameConfig } from '@/lib/types/game';
import type { AdminCard, CardFormState, SaveState } from '../types';
import { saveCard } from '../api';

function emptyForm(config: GameConfig | null): CardFormState {
  const coreValues: Record<string, number | null> = {};
  for (const field of config?.cardSchema.fields ?? []) {
    if (field.type === 'number') coreValues[field.key] = null;
  }
  const customValues: Record<string, string | number | boolean | null> = {};
  for (const field of config?.cardSchema.customFields ?? []) {
    customValues[field.key] = null;
  }
  return {
    name: '',
    typeId: '',
    rarityId: '',
    setId: '',
    setNumber: '',
    imageUrl: '',
    imageUrlSmall: '',
    imageUrlLarge: '',
    description: '',
    officialText: '',
    coreValues,
    customValues,
    keywordsInput: '',
    tagsInput: '',
    isFoil: false,
    isPromo: false,
    isAlternate: false,
    language: 'en',
  };
}

const str = (value: string | null | undefined): string => value ?? '';
const bool = (value: boolean | null | undefined): boolean => value ?? false;
const joined = (value: string[] | null | undefined): string =>
  (value ?? []).join(', ');

function formFromCard(
  card: AdminCard,
  config: GameConfig | null
): CardFormState {
  const base = emptyForm(config);
  const record = card as unknown as Record<string, unknown>;

  for (const key of Object.keys(base.coreValues)) {
    const value = record[key];
    base.coreValues[key] = typeof value === 'number' ? value : null;
  }
  for (const key of Object.keys(base.customValues)) {
    base.customValues[key] = card.gameAttributes?.[key] ?? null;
  }

  return {
    ...base,
    name: str(card.name),
    typeId: str(card.typeId),
    rarityId: str(card.rarityId),
    setId: str(card.setId),
    setNumber: str(card.setNumber),
    imageUrl: str(card.imageUrl),
    imageUrlSmall: str(card.imageUrlSmall),
    imageUrlLarge: str(card.imageUrlLarge),
    description: str(card.description),
    officialText: str(card.officialText),
    keywordsInput: joined(card.keywords),
    tagsInput: joined(card.tags),
    isFoil: bool(card.isFoil),
    isPromo: bool(card.isPromo),
    isAlternate: bool(card.isAlternate),
    language: card.language ?? 'en',
  };
}

interface UseCardFormArgs {
  gameSlug: string;
  config: GameConfig | null;
  /** null = nothing selected, 'new' = creating, otherwise editing this card */
  selected: AdminCard | 'new' | null;
  onSaved: (card: AdminCard, wasCreate: boolean) => void;
}

export function useCardForm({
  gameSlug,
  config,
  selected,
  onSaved,
}: UseCardFormArgs) {
  const [form, setForm] = useState<CardFormState>(() => emptyForm(config));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<SaveState>({ status: 'idle' });
  const [isDirty, setIsDirty] = useState(false);

  // Reset form when selection or game changes
  useEffect(() => {
    if (selected && selected !== 'new') {
      setForm(formFromCard(selected, config));
    } else {
      setForm(emptyForm(config));
    }
    setErrors({});
    setSaveState({ status: 'idle' });
    setIsDirty(false);
  }, [selected, config]);

  const update = useCallback(
    <K extends keyof CardFormState>(field: K, value: CardFormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      setErrors((prev) => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const updateCoreValue = useCallback((key: string, value: number | null) => {
    setForm((prev) => ({
      ...prev,
      coreValues: { ...prev.coreValues, [key]: value },
    }));
    setIsDirty(true);
  }, []);

  const updateCustomValue = useCallback(
    (key: string, value: string | number | boolean | null) => {
      setForm((prev) => ({
        ...prev,
        customValues: { ...prev.customValues, [key]: value },
      }));
      setIsDirty(true);
    },
    []
  );

  const validate = useCallback((): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.typeId) next.typeId = 'Type is required';
    if (!form.rarityId) next.rarityId = 'Rarity is required';
    if (!form.setId) next.setId = 'Set is required';
    if (!form.setNumber.trim()) next.setNumber = 'Card number is required';
    if (!form.imageUrl) next.imageUrl = 'Upload a card image';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const save = useCallback(async () => {
    if (!validate()) return;
    setSaveState({ status: 'saving' });
    try {
      const cardId = selected && selected !== 'new' ? selected.id : undefined;
      const card = await saveCard(gameSlug, form, cardId);
      setSaveState({ status: 'saved', at: Date.now() });
      setIsDirty(false);
      onSaved(card, !cardId);
    } catch (error) {
      setSaveState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to save',
      });
    }
  }, [validate, selected, gameSlug, form, onSaved]);

  return {
    form,
    errors,
    saveState,
    isDirty,
    update,
    updateCoreValue,
    updateCustomValue,
    save,
  };
}
