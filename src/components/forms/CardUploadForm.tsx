/**
 * Card Upload Form
 *
 * Form component for manual card submissions including image upload,
 * card data entry, and validation.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/components/ui';
import type { CreateSubmissionData, SubmissionPriority } from '@/lib/types/submission';

export interface CardUploadFormProps {
  onSubmit?: (data: CreateSubmissionData, image?: File) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const CardUploadForm: React.FC<CardUploadFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateSubmissionData>({
    name: '',
    setNumber: '',
    level: undefined,
    cost: undefined,
    description: '',
    officialText: '',
    clashPoints: undefined,
    hitPoints: undefined,
    attackPoints: undefined,
    faction: '',
    pilot: '',
    model: '',
    series: '',
    nation: '',
    keywords: [],
    tags: [],
    isFoil: false,
    isPromo: false,
    isAlternate: false,
    isLeak: false,
    isPreview: false,
    priority: 'NORMAL',
    submitterName: '',
    submitterEmail: '',
  });

  // Handle form input changes
  const handleInputChange = (field: keyof CreateSubmissionData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.type === 'number'
      ? e.target.value ? parseInt(e.target.value, 10) : undefined
      : e.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle array fields (keywords, tags)
  const handleArrayChange = (field: 'keywords' | 'tags') => (value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  // Handle image upload
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Only JPEG, PNG, and WebP images are allowed',
      }));
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'Image must be smaller than 10MB',
      }));
      return;
    }

    // Clear image error
    setErrors(prev => ({
      ...prev,
      image: '',
    }));

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Remove image
  const handleImageRemove = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Card name is required';
    }

    if (!formData.setNumber.trim()) {
      newErrors.setNumber = 'Set number is required';
    }

    // Email validation for anonymous submissions
    if (formData.submitterEmail && !isValidEmail(formData.submitterEmail)) {
      newErrors.submitterEmail = 'Please enter a valid email address';
    }

    // Numeric validation
    if (formData.level !== undefined && (formData.level < 0 || formData.level > 10)) {
      newErrors.level = 'Level must be between 0 and 10';
    }

    if (formData.cost !== undefined && (formData.cost < 0 || formData.cost > 20)) {
      newErrors.cost = 'Cost must be between 0 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData, selectedFile || undefined);
    }
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Submit Card</CardTitle>
        <p className="text-sm text-gray-600">
          Submit a new card for review. All submissions will be reviewed before publication.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Card preview"
                    className="max-w-48 max-h-64 object-contain rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                    >
                      Change Image
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleImageRemove}
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Card Image
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Basic Card Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter card name"
                error={errors.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Number *
              </label>
              <Input
                type="text"
                value={formData.setNumber}
                onChange={handleInputChange('setNumber')}
                placeholder="e.g., 001, A-01"
                error={errors.setNumber}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.level || ''}
                onChange={handleInputChange('level')}
                placeholder="0-10"
                error={errors.level}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <Input
                type="number"
                min="0"
                max="20"
                value={formData.cost || ''}
                onChange={handleInputChange('cost')}
                placeholder="0-20"
                error={errors.cost}
              />
            </div>
          </div>

          {/* Game Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clash Points
              </label>
              <Input
                type="number"
                min="0"
                value={formData.clashPoints || ''}
                onChange={handleInputChange('clashPoints')}
                placeholder="CP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hit Points
              </label>
              <Input
                type="number"
                min="0"
                value={formData.hitPoints || ''}
                onChange={handleInputChange('hitPoints')}
                placeholder="HP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attack Points
              </label>
              <Input
                type="number"
                min="0"
                value={formData.attackPoints || ''}
                onChange={handleInputChange('attackPoints')}
                placeholder="AP"
              />
            </div>
          </div>

          {/* Card Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faction
              </label>
              <select
                value={formData.faction}
                onChange={handleInputChange('faction')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Faction</option>
                <option value="Earth Federation">Earth Federation</option>
                <option value="Zeon">Zeon</option>
                <option value="AEUG">AEUG</option>
                <option value="Titans">Titans</option>
                <option value="Celestial Being">Celestial Being</option>
                <option value="A-Laws">A-Laws</option>
                <option value="Gjallarhorn">Gjallarhorn</option>
                <option value="Tekkadan">Tekkadan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series
              </label>
              <select
                value={formData.series}
                onChange={handleInputChange('series')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Series</option>
                <option value="UC">Universal Century (UC)</option>
                <option value="CE">Cosmic Era (CE)</option>
                <option value="AD">Anno Domini (AD)</option>
                <option value="AG">Advanced Generation (AG)</option>
                <option value="PD">Post Disaster (PD)</option>
                <option value="AC">After Colony (AC)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilot
              </label>
              <Input
                type="text"
                value={formData.pilot}
                onChange={handleInputChange('pilot')}
                placeholder="Pilot name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <Input
                type="text"
                value={formData.model}
                onChange={handleInputChange('model')}
                placeholder="Mobile suit model"
              />
            </div>
          </div>

          {/* Card Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Card description..."
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Official Text
            </label>
            <textarea
              value={formData.officialText}
              onChange={handleInputChange('officialText')}
              placeholder="Official card text..."
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Keywords and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <Input
                type="text"
                value={formData.keywords?.join(', ')}
                onChange={(e) => handleArrayChange('keywords')(e.target.value)}
                placeholder="Keyword1, Keyword2, ..."
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <Input
                type="text"
                value={formData.tags?.join(', ')}
                onChange={(e) => handleArrayChange('tags')(e.target.value)}
                placeholder="tag1, tag2, ..."
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Submission Flags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Flags
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFoil}
                  onChange={handleInputChange('isFoil')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Foil</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPromo}
                  onChange={handleInputChange('isPromo')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Promo</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAlternate}
                  onChange={handleInputChange('isAlternate')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Alt Art</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isLeak}
                  onChange={handleInputChange('isLeak')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Leak</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPreview}
                  onChange={handleInputChange('isPreview')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">Preview</span>
              </label>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={handleInputChange('priority')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Submitter Information */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Submitter Information (Optional)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  type="text"
                  value={formData.submitterName}
                  onChange={handleInputChange('submitterName')}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.submitterEmail}
                  onChange={handleInputChange('submitterEmail')}
                  placeholder="your@email.com"
                  error={errors.submitterEmail}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
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
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Card'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CardUploadForm;