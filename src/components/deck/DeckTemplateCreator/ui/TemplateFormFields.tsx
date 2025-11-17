/**
 * Template form fields component
 */

import React from 'react';
import { Input, Select } from '@/components/ui';

interface TemplateFormFieldsProps {
  templateName: string;
  templateDescription: string;
  templateSource: string;
  onTemplateNameChange: (name: string) => void;
  onTemplateDescriptionChange: (description: string) => void;
  onTemplateSourceChange: (source: string) => void;
}

export const TemplateFormFields: React.FC<TemplateFormFieldsProps> = ({
  templateName,
  templateDescription,
  templateSource,
  onTemplateNameChange,
  onTemplateDescriptionChange,
  onTemplateSourceChange,
}) => {
  return (
    <>
      {/* Template Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Template Name *
        </label>
        <Input
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          placeholder="Enter template name..."
          className="w-full"
        />
      </div>

      {/* Template Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={templateDescription}
          onChange={(e) => onTemplateDescriptionChange(e.target.value)}
          placeholder="Describe this template's strategy, strengths, and when to use it..."
          className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          rows={3}
        />
        <div className="mt-1 text-xs text-gray-500">
          Help other players understand when and how to use this template.
        </div>
      </div>

      {/* Template Source */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Source Type
        </label>
        <Select
          value={templateSource}
          onChange={onTemplateSourceChange}
          options={[
            { value: 'Community', label: 'Community' },
            { value: 'Tournament', label: 'Tournament' },
            { value: 'Competitive', label: 'Competitive' },
            { value: 'Casual', label: 'Casual' },
            { value: 'Beginner', label: 'Beginner-Friendly' },
          ]}
        />
        <div className="mt-1 text-xs text-gray-500">
          Choose the category that best describes this deck template.
        </div>
      </div>
    </>
  );
};
