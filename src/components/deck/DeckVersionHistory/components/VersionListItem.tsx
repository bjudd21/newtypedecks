/**
 * Individual version list item component
 */

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { VersionStats } from './VersionStats';
import { VersionCardGrid } from './VersionCardGrid';
import type { DeckVersion } from '../types';

interface VersionListItemProps {
  version: DeckVersion;
  currentVersion?: number;
  selectedVersion: DeckVersion | null;
  isRestoring: boolean;
  isDeleting: boolean;
  hasMultipleVersions: boolean;
  onVersionSelect: (version: DeckVersion) => void;
  onRestore: (versionId: string) => void;
  onDelete: (versionId: string, versionNumber: number) => void;
}

export const VersionListItem: React.FC<VersionListItemProps> = ({
  version,
  currentVersion,
  selectedVersion,
  isRestoring,
  isDeleting,
  hasMultipleVersions,
  onVersionSelect,
  onRestore,
  onDelete,
}) => {
  const isSelected = selectedVersion?.id === version.id;
  const isCurrent = version.version === currentVersion;

  return (
    <div className="hover:bg-accent rounded-lg border p-4 transition-colors">
      {/* Version Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isCurrent ? 'primary' : 'secondary'}>
            v{version.version}
            {isCurrent && ' (Current)'}
          </Badge>
          {version.versionName && (
            <span className="text-foreground font-medium">
              {version.versionName}
            </span>
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(version.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>

      {/* Version Details */}
      <div className="text-muted-foreground mb-2 text-sm">
        <div>
          <strong>{version.name}</strong>
        </div>
        {version.description && <div>{version.description}</div>}
        {version.changeNote && (
          <div className="mt-1 italic">&quot;{version.changeNote}&quot;</div>
        )}
      </div>

      {/* Version Stats */}
      <VersionStats version={version} />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onVersionSelect(version)}
          variant="outline"
          size="sm"
        >
          {isSelected ? 'Hide Details' : 'View Cards'}
        </Button>

        {!isCurrent && (
          <Button
            onClick={() => onRestore(version.id)}
            variant="outline"
            size="sm"
            disabled={isRestoring}
          >
            {isRestoring ? 'Restoring...' : 'Restore'}
          </Button>
        )}

        {hasMultipleVersions && (
          <Button
            onClick={() => onDelete(version.id, version.version)}
            variant="outline"
            size="sm"
            disabled={isDeleting}
            className="text-red-600 hover:border-red-300 hover:text-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        )}
      </div>

      {/* Version Details - Card Grid */}
      {isSelected && <VersionCardGrid version={selectedVersion} />}
    </div>
  );
};
