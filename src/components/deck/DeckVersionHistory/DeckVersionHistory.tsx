/**
 * Deck version history component - main orchestrator
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { useVersionHistory } from './hooks/useVersionHistory';
import { useVersionActions } from './hooks/useVersionActions';
import { LoadingState } from './components/LoadingState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EmptyState } from './components/EmptyState';
import { VersionListItem } from './components/VersionListItem';
import type { DeckVersionHistoryProps } from './types';

export const DeckVersionHistory: React.FC<DeckVersionHistoryProps> = ({
  deckId,
  currentVersion,
  onVersionRestore,
  onVersionDelete,
  className,
}) => {
  const {
    versions,
    setVersions,
    selectedVersion,
    setSelectedVersion,
    isLoading,
    error,
    setError,
    handleVersionSelect,
  } = useVersionHistory(deckId);

  const {
    isRestoring,
    isDeleting,
    handleRestore,
    handleDelete,
    handleCreateVersion,
  } = useVersionActions({
    deckId,
    onVersionRestore,
    onVersionDelete,
    setVersions,
    setSelectedVersion,
    setError,
  });

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Version History</CardTitle>
            <Button onClick={handleCreateVersion} variant="outline" size="sm">
              Save Current Version
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <ErrorDisplay error={error} />}

          {versions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <VersionListItem
                  key={version.id}
                  version={version}
                  currentVersion={currentVersion}
                  selectedVersion={selectedVersion}
                  isRestoring={isRestoring}
                  isDeleting={isDeleting}
                  hasMultipleVersions={versions.length > 1}
                  onVersionSelect={handleVersionSelect}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckVersionHistory;
