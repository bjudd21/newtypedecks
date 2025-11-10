import { AdminSubmissionsDashboard } from '@/components/admin/AdminSubmissionsDashboard';

export default function AdminSubmissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Submission Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review, approve, and manage community card submissions.
          </p>
        </div>

        <AdminSubmissionsDashboard />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Submission Management - Admin | Gundam Card Game',
  description:
    'Admin interface for managing community card submissions and reviews.',
};
