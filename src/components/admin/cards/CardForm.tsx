'use client';

import { useState, useEffect } from 'react';
import {
  BasicInformationSection,
  ImageUploadSection,
  StatsSection,
  CategoriesSection,
  TextFieldsSection,
  KeywordsTagsSection,
  FlagsSection,
  FormActions,
  LoadingSpinner,
  useReferenceData,
} from './CardForm/';
import type { CardFormData, CardFormProps } from './CardForm/';

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

  const [keywordsInput, setKeywordsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load reference data using custom hook
  const { referenceData, isLoading: isLoadingRef } = useReferenceData(
    initialData,
    setFormData
  );

  // Initialize keywords and tags inputs
  useEffect(() => {
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
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInformationSection
        formData={formData}
        errors={errors}
        referenceData={referenceData}
        onChange={handleChange}
      />

      <ImageUploadSection
        imageUrl={formData.imageUrl}
        onUpload={handleImageUpload}
      />

      <StatsSection formData={formData} onChange={handleChange} />

      <CategoriesSection formData={formData} onChange={handleChange} />

      <TextFieldsSection formData={formData} onChange={handleChange} />

      <KeywordsTagsSection
        keywordsInput={keywordsInput}
        tagsInput={tagsInput}
        onKeywordsChange={setKeywordsInput}
        onTagsChange={setTagsInput}
      />

      <FlagsSection formData={formData} onChange={handleChange} />

      <FormActions
        onCancel={onCancel}
        isLoading={isLoading}
        isUpdate={!!initialData}
      />
    </form>
  );
}
