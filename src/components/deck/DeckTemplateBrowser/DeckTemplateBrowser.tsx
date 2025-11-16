/**
 * Deck template browser component - main orchestrator
 */

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useTemplates } from './hooks/useTemplates';
import { LoadingState } from './components/LoadingState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EmptyState } from './components/EmptyState';
import { FilterPanel } from './components/FilterPanel';
import { TemplateCard } from './components/TemplateCard';
import { Pagination } from './components/Pagination';
import { SignInPrompt } from './components/SignInPrompt';
import type { DeckTemplateBrowserProps } from './types';

export const DeckTemplateBrowser: React.FC<DeckTemplateBrowserProps> = ({
  onTemplateSelect,
  onCreateFromTemplate,
  className,
}) => {
  const {
    templates,
    isLoading,
    error,
    selectedTemplate,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    isCreating,
    isAuthenticated,
    handleTemplateClick,
    handleCreateFromTemplate,
  } = useTemplates(onTemplateSelect, onCreateFromTemplate);

  if (isLoading && templates.length === 0) {
    return <LoadingState className={className} />;
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Deck Templates</CardTitle>
          <div className="text-sm text-gray-600">
            Browse and use community-created deck templates to jumpstart your
            deck building
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <FilterPanel
            filters={filters}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
          />

          {error && <ErrorDisplay error={error} />}

          {/* Templates Grid */}
          {templates.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  isCreating={isCreating}
                  onTemplateClick={handleTemplateClick}
                  onCreateFromTemplate={handleCreateFromTemplate}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {!isAuthenticated && <SignInPrompt />}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckTemplateBrowser;
