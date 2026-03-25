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
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
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
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          value={templateDescription}
          onChange={(e) => onTemplateDescriptionChange(e.target.value)}
          placeholder="Describe this template's strategy, strengths, and when to use it..."
          className="border-border focus:border-primary focus:ring-primary w-full resize-none rounded-md border px-3 py-2 shadow-sm focus:ring-1 focus:outline-none"
          rows={3}
        />
        <div className="text-muted-foreground/70 mt-1 text-xs">
          Help other players understand when and how to use this template.
        </div>
      </div>

      {/* Template Source */}
      <div>
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
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
        <div className="text-muted-foreground/70 mt-1 text-xs">
          Choose the category that best describes this deck template.
        </div>
      </div>
    </>
  );
};
