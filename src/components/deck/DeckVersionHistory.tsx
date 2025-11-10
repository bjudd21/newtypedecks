'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';

interface DeckVersion {
  id: string;
  version: number;
  name: string;
  description?: string;
  versionName?: string;
  changeNote?: string;
  createdBy: {
    id: string;
    name?: string;
    image?: string;
  };
  createdAt: string;
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  cards: Array<{
    id: string;
    cardId: string;
    quantity: number;
    category?: string;
    card: {
      id: string;
      name: string;
      cost?: number;
      type: { name: string };
      rarity: { name: string };
      imageUrl: string;
    };
  }>;
}

interface DeckVersionHistoryProps {
  deckId: string;
  currentVersion?: number;
  onVersionRestore?: (versionId: string) => void;
  onVersionDelete?: (versionId: string) => void;
  className?: string;
}

export const DeckVersionHistory: React.FC<DeckVersionHistoryProps> = ({
  deckId,
  currentVersion,
  onVersionRestore,
  onVersionDelete,
  className
}) => {
  const [versions, setVersions] = useState<DeckVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DeckVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch version history
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/decks/${deckId}/versions`);
        if (!response.ok) {
          throw new Error('Failed to fetch version history');
        }

        const data = await response.json();
        setVersions(data.versions || []);
      } catch (err) {
        console.error('Error fetching versions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load version history');
      } finally {
        setIsLoading(false);
      }
    };

    if (deckId) {
      fetchVersions();
    }
  }, [deckId]);

  // Handle version selection for detailed view
  const handleVersionSelect = async (version: DeckVersion) => {
    if (selectedVersion?.id === version.id) {
      setSelectedVersion(null);
      return;
    }

    try {
      const response = await fetch(`/api/decks/${deckId}/versions/${version.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch version details');
      }

      const data = await response.json();
      setSelectedVersion(data.version);
    } catch (err) {
      console.error('Error fetching version details:', err);
      // TODO: Replace with proper UI notification component
      console.warn('Failed to load version details');
    }
  };

  // Handle version restoration
  const handleRestore = async (versionId: string) => {
    console.warn('TODO: Replace with proper UI confirmation dialog');
    // For now, proceed without confirmation

    try {
      setIsRestoring(true);
      setError(null);

      const response = await fetch(`/api/decks/${deckId}/versions/${versionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restore' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to restore version');
      }

      const result = await response.json();
      console.warn(`TODO: Replace with proper UI notification - ${result.message}`);

      // Refresh version history
      window.location.reload();

      if (onVersionRestore) {
        onVersionRestore(versionId);
      }
    } catch (err) {
      console.error('Error restoring version:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore version');
    } finally {
      setIsRestoring(false);
    }
  };

  // Handle version deletion
  const handleDelete = async (versionId: string, versionNumber: number) => {
    console.warn(`TODO: Replace with proper UI confirmation dialog - Deleting version ${versionNumber}`);
    // For now, proceed without confirmation

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/decks/${deckId}/versions/${versionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete version');
      }

      // Remove from local state
      setVersions(prevVersions => prevVersions.filter(v => v.id !== versionId));

      if (selectedVersion?.id === versionId) {
        setSelectedVersion(null);
      }

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
    const versionName = 'Manual Save'; // Default name for now
    const changeNote: string | undefined = undefined; // No notes for now

    try {
      const response = await fetch(`/api/decks/${deckId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          versionName: (versionName as string | undefined)?.trim() || undefined,
          changeNote: (changeNote as string | undefined)?.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create version');
      }

      const result = await response.json();

      // Add new version to the list
      setVersions(prevVersions => [result.version, ...prevVersions]);
      console.warn('TODO: Replace with proper UI notification - Version created successfully!');
    } catch (err) {
      console.error('Error creating version:', err);
      console.warn(`TODO: Replace with proper UI notification - ${err instanceof Error ? err.message : 'Failed to create version'}`);
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-600">Loading version history...</div>
          </CardContent>
        </Card>
      </div>
    );
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {versions.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <div className="text-lg font-medium">No versions yet</div>
              <div className="text-sm mt-1">
                Versions are created automatically when you make changes to your deck.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={version.version === currentVersion ? 'primary' : 'secondary'}
                      >
                        v{version.version}
                        {version.version === currentVersion && ' (Current)'}
                      </Badge>
                      {version.versionName && (
                        <span className="font-medium text-gray-900">{version.versionName}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <div><strong>{version.name}</strong></div>
                    {version.description && <div>{version.description}</div>}
                    {version.changeNote && (
                      <div className="mt-1 italic">&quot;{version.changeNote}&quot;</div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span>{version.cardCount} cards</span>
                    <span>{version.uniqueCards} unique</span>
                    <span>{version.totalCost} total cost</span>
                    <span>by {version.createdBy.name || 'Unknown'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleVersionSelect(version)}
                      variant="outline"
                      size="sm"
                    >
                      {selectedVersion?.id === version.id ? 'Hide Details' : 'View Cards'}
                    </Button>

                    {version.version !== currentVersion && (
                      <Button
                        onClick={() => handleRestore(version.id)}
                        variant="outline"
                        size="sm"
                        disabled={isRestoring}
                      >
                        {isRestoring ? 'Restoring...' : 'Restore'}
                      </Button>
                    )}

                    {versions.length > 1 && (
                      <Button
                        onClick={() => handleDelete(version.id, version.version)}
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    )}
                  </div>

                  {/* Version Details */}
                  {selectedVersion?.id === version.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Cards in this version:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {selectedVersion.cards.map((versionCard) => (
                          <div
                            key={versionCard.id}
                            className="flex items-center gap-2 p-2 bg-white border rounded text-sm"
                          >
                            <Image
                              src={versionCard.card.imageUrl}
                              alt={versionCard.card.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{versionCard.card.name}</div>
                              <div className="text-xs text-gray-500">
                                {versionCard.card.type.name} • {versionCard.card.rarity.name}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              x{versionCard.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckVersionHistory;