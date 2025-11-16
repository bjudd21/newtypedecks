/**
 * Hook for managing template browsing state and API calls
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import type { DeckTemplate, TemplateFilters } from '../types';

export function useTemplates(
  onTemplateSelect?: (template: DeckTemplate) => void,
  onCreateFromTemplate?: (templateId: string) => void
) {
  const { isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<DeckTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DeckTemplate | null>(
    null
  );

  // Filters
  const [filters, setFilters] = useState<TemplateFilters>({
    searchQuery: '',
    sourceFilter: '',
    sortBy: 'usage',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (filters.searchQuery.trim()) {
        params.append('search', filters.searchQuery.trim());
      }

      if (filters.sourceFilter) {
        params.append('source', filters.sourceFilter);
      }

      const response = await fetch(`/api/templates?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data.templates || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.searchQuery, filters.sourceFilter, filters.sortBy]);

  // Handle template selection
  const handleTemplateClick = (template: DeckTemplate) => {
    setSelectedTemplate(selectedTemplate?.id === template.id ? null : template);

    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  // Handle creating deck from template
  const handleCreateFromTemplate = async (templateId: string) => {
    if (!isAuthenticated) {
      console.warn('Please sign in to create decks from templates!');
      return;
    }

    console.warn('TODO: Replace with proper UI dialog');
    const deckName = 'New Deck from Template';
    if (!deckName?.trim()) return;

    try {
      setIsCreating(true);

      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: deckName.trim(),
          description: 'Deck created from template',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to create deck from template'
        );
      }

      const result = await response.json();
      console.warn(
        `Deck "${result.deck.name}" created successfully from template!`
      );

      if (onCreateFromTemplate) {
        onCreateFromTemplate(templateId);
      }

      // Refresh templates to update usage count
      fetchTemplates();
    } catch (err) {
      console.error('Error creating deck from template:', err);
      console.warn(
        err instanceof Error ? err.message : 'Failed to create deck from template'
      );
    } finally {
      setIsCreating(false);
    }
  };

  return {
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
  };
}
