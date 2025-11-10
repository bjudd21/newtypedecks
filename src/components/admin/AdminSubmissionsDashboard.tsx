'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from '@/components/ui';
import { SubmissionReviewCard } from './SubmissionReviewCard';
import type {
  CardSubmissionWithDetails,
  SubmissionSearchFilters,
  SubmissionStatistics,
} from '@/lib/types/submission';

export interface AdminSubmissionsDashboardProps {
  className?: string;
}

export const AdminSubmissionsDashboard: React.FC<
  AdminSubmissionsDashboardProps
> = ({ className }) => {
  const [submissions, setSubmissions] = useState<CardSubmissionWithDetails[]>(
    []
  );
  const [statistics, setStatistics] = useState<SubmissionStatistics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(
    new Set()
  );
  const [filters, setFilters] = useState<SubmissionSearchFilters>({
    status: ['PENDING'],
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Load submissions and statistics
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load statistics
      const statsResponse = await fetch(
        '/api/admin/submissions?action=statistics'
      );
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }

      // Load submissions based on current filters
      const searchParams = new URLSearchParams();
      if (filters.status?.length) {
        filters.status.forEach((status) =>
          searchParams.append('status', status)
        );
      }
      if (filters.priority?.length) {
        filters.priority.forEach((priority) =>
          searchParams.append('priority', priority)
        );
      }
      if (searchQuery) {
        searchParams.set('search', searchQuery);
      }

      const submissionsResponse = await fetch(
        `/api/submissions/search?${searchParams.toString()}`
      );
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData.submissions || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, searchQuery]);

  // Handle submission review
  const handleReview = async (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNotes?: string,
    rejectionReason?: string
  ) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reviewNotes,
          rejectionReason,
        }),
      });

      if (response.ok) {
        await loadData(); // Reload data to reflect changes
      } else {
        console.error('Failed to review submission');
      }
    } catch (error) {
      console.error('Review error:', error);
    }
  };

  // Handle submission publish
  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}/publish`, {
        method: 'POST',
      });

      if (response.ok) {
        await loadData(); // Reload data to reflect changes
      } else {
        console.error('Failed to publish submission');
      }
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  // Handle batch operations
  const handleBatchOperation = async (action: string) => {
    if (selectedSubmissions.size === 0) return;

    const submissionIds = Array.from(selectedSubmissions);

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          submissionIds,
        }),
      });

      if (response.ok) {
        setSelectedSubmissions(new Set());
        await loadData(); // Reload data to reflect changes
      } else {
        console.error('Failed to execute batch operation');
      }
    } catch (error) {
      console.error('Batch operation error:', error);
    }
  };

  // Toggle submission selection
  const toggleSubmissionSelection = (id: string) => {
    const newSelection = new Set(selectedSubmissions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSubmissions(newSelection);
  };

  // Select all visible submissions
  const selectAllVisible = () => {
    const visibleIds = submissions.map((s) => s.id);
    setSelectedSubmissions(new Set(visibleIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedSubmissions(new Set());
  };

  return (
    <div className={className}>
      {/* Statistics Overview */}
      {statistics && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {statistics.byStatus.PENDING}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {statistics.byStatus.APPROVED}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {statistics.byStatus.REJECTED}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.byStatus.PUBLISHED}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submission Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value
                      ? [
                          e.target
                            .value as import('@prisma/client').SubmissionStatus,
                        ]
                      : undefined,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PUBLISHED">Published</option>
              </select>

              <select
                value={filters.priority?.[0] || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priority: e.target.value
                      ? [
                          e.target
                            .value as import('@prisma/client').SubmissionPriority,
                        ]
                      : undefined,
                  }))
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Priority</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
              </select>

              <Button onClick={loadData} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </div>

          {/* Batch Operations */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedSubmissions.size} selected
            </span>

            {submissions.length > 0 && (
              <>
                <Button onClick={selectAllVisible} variant="outline" size="sm">
                  Select All Visible
                </Button>
                <Button onClick={clearSelection} variant="outline" size="sm">
                  Clear Selection
                </Button>
              </>
            )}

            {selectedSubmissions.size > 0 && (
              <>
                <Button
                  onClick={() => handleBatchOperation('approve')}
                  variant="default"
                  size="sm"
                >
                  Batch Approve
                </Button>
                <Button
                  onClick={() => handleBatchOperation('reject')}
                  variant="secondary"
                  size="sm"
                >
                  Batch Reject
                </Button>
                <Button
                  onClick={() => handleBatchOperation('priority')}
                  variant="outline"
                  size="sm"
                >
                  Set Priority
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-600">Loading submissions...</div>
            </CardContent>
          </Card>
        )}

        {!isLoading && submissions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-600">
                No submissions found matching your criteria.
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          submissions.map((submission) => (
            <div key={submission.id} className="relative">
              <div
                className="absolute left-4 top-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedSubmissions.has(submission.id)}
                  onChange={() => toggleSubmissionSelection(submission.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <SubmissionReviewCard
                submission={submission}
                onReview={handleReview}
                onPublish={handlePublish}
                className="ml-8"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminSubmissionsDashboard;
