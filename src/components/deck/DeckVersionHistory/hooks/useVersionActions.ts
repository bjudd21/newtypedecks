/**
 * Hook for version actions (restore, delete, create)
 */

import { useState } from 'react';
import type { DeckVersion } from '../types';

interface UseVersionActionsOptions {
  deckId: string;
  onVersionRestore?: (versionId: string) => void;
  onVersionDelete?: (versionId: string) => void;
  setVersions: React.Dispatch<React.SetStateAction<DeckVersion[]>>;
  setSelectedVersion: React.Dispatch<React.SetStateAction<DeckVersion | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useVersionActions({
  deckId,
  onVersionRestore,
  onVersionDelete,
  setVersions,
  setSelectedVersion,
  setError,
}: UseVersionActionsOptions) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle version restoration
  const handleRestore = async (versionId: string) => {
    console.warn('TODO: Replace with proper UI confirmation dialog');

    try {
      setIsRestoring(true);
      setError(null);

      const response = await fetch(
        `/api/decks/${deckId}/versions/${versionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'restore' }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to restore version');
      }

      const result = await response.json();
      console.warn(
        `TODO: Replace with proper UI notification - ${result.message}`
      );

      // Refresh version history
      window.location.reload();

      if (onVersionRestore) {
        onVersionRestore(versionId);
      }
    } catch (err) {
      console.error('Error restoring version:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to restore version'
      );
    } finally {
      setIsRestoring(false);
    }
  };

  // Handle version deletion
  const handleDelete = async (versionId: string, versionNumber: number) => {
    console.warn(
      `TODO: Replace with proper UI confirmation dialog - Deleting version ${versionNumber}`
    );

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(
        `/api/decks/${deckId}/versions/${versionId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete version');
      }

      // Remove from local state
      setVersions((prevVersions) =>
        prevVersions.filter((v) => v.id !== versionId)
      );

      setSelectedVersion((prev) => (prev?.id === versionId ? null : prev));

      if (onVersionDelete) {
        onVersionDelete(versionId);
      }
    } catch (err) {
      console.error('Error deleting version:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete version');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle creating a new manual version
  const handleCreateVersion = async () => {
    console.warn('TODO: Replace with proper UI dialog');
    const versionName = 'Manual Save';
    const changeNote: string | undefined = undefined;

    try {
      const response = await fetch(`/api/decks/${deckId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          versionName: (versionName as string | undefined)?.trim() || undefined,
          changeNote: (changeNote as string | undefined)?.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create version');
      }

      const result = await response.json();

      // Add new version to the list
      setVersions((prevVersions) => [result.version, ...prevVersions]);
      console.warn(
        'TODO: Replace with proper UI notification - Version created successfully!'
      );
    } catch (err) {
      console.error('Error creating version:', err);
      console.warn(
        `TODO: Replace with proper UI notification - ${err instanceof Error ? err.message : 'Failed to create version'}`
      );
    }
  };

  return {
    isRestoring,
    isDeleting,
    handleRestore,
    handleDelete,
    handleCreateVersion,
  };
}
