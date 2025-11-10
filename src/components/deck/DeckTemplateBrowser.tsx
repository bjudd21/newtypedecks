'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Select,
} from '@/components/ui';
import { useAuth } from '@/hooks';

interface DeckTemplate {
  id: string;
  name: string;
  description?: string;
  templateSource?: string;
  creator: {
    id: string;
    name?: string;
    image?: string;
  };
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  colors: string[];
  usageCount: number;
  favoriteCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

interface DeckTemplateBrowserProps {
  onTemplateSelect?: (template: DeckTemplate) => void;
  onCreateFromTemplate?: (templateId: string, customizations?: any) => void;
  className?: string;
}

export const DeckTemplateBrowser: React.FC<DeckTemplateBrowserProps> = ({
  onTemplateSelect,
  onCreateFromTemplate,
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<DeckTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DeckTemplate | null>(
    null
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('usage');

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

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (sourceFilter) {
        params.append('source', sourceFilter);
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
  }, [currentPage, searchQuery, sourceFilter, sortBy]);

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
      console.warn(
        'TODO: Replace with proper UI notification - Please sign in to create decks from templates!'
      );
      return;
    }

    console.warn('TODO: Replace with proper UI dialog');
    const deckName = 'New Deck from Template'; // Default name for now
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
        `TODO: Replace with proper UI notification - Deck "${result.deck.name}" created successfully from template!`
      );

      if (onCreateFromTemplate) {
        onCreateFromTemplate(templateId);
      }

      // Refresh templates to update usage count
      fetchTemplates();
    } catch (err) {
      console.error('Error creating deck from template:', err);
      console.warn(
        `TODO: Replace with proper UI notification - ${err instanceof Error ? err.message : 'Failed to create deck from template'}`
      );
    } finally {
      setIsCreating(false);
    }
  };

  const getSourceBadgeColor = (source?: string) => {
    switch (source) {
      case 'Official':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Community':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Tournament':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isLoading && templates.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-600">Loading templates...</div>
          </CardContent>
        </Card>
      </div>
    );
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
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="flex-1"
              />

              <Select
                value={sourceFilter}
                onChange={setSourceFilter}
                options={[
                  { value: '', label: 'All Sources' },
                  { value: 'Official', label: 'Official' },
                  { value: 'Community', label: 'Community' },
                  { value: 'Tournament', label: 'Tournament' },
                ]}
              />

              <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'usage', label: 'Most Used' },
                  { value: 'favorites', label: 'Most Favorited' },
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'name', label: 'Name' },
                ]}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Templates Grid */}
          {templates.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              <div className="text-lg font-medium">No templates found</div>
              <div className="mt-1 text-sm">
                Try adjusting your search criteria or check back later for new
                templates.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-gray-900">
                        {template.name}
                      </h3>
                      <div className="truncate text-sm text-gray-600">
                        by {template.creator.name || 'Unknown'}
                      </div>
                    </div>
                    {template.templateSource && (
                      <Badge
                        className={getSourceBadgeColor(template.templateSource)}
                      >
                        {template.templateSource}
                      </Badge>
                    )}
                  </div>

                  {template.description && (
                    <div className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {template.description}
                    </div>
                  )}

                  <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>{template.cardCount} cards</div>
                    <div>{template.uniqueCards} unique</div>
                    <div>Cost: {template.totalCost}</div>
                    <div>{template.usageCount} uses</div>
                  </div>

                  {template.colors.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {template.colors.slice(0, 3).map((color) => (
                        <Badge
                          key={color}
                          variant="secondary"
                          className="text-xs"
                        >
                          {color}
                        </Badge>
                      ))}
                      {template.colors.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.colors.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFromTemplate(template.id);
                      }}
                      size="sm"
                      variant="default"
                      disabled={isCreating}
                      className="flex-1"
                    >
                      {isCreating ? 'Creating...' : 'Use Template'}
                    </Button>

                    <div className="text-xs text-gray-400">
                      ♥ {template.favoriteCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              <strong>Sign in to use templates!</strong> Create an account or
              sign in to start building decks from these templates.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckTemplateBrowser;
