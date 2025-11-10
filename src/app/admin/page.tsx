import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage the Gundam Card Game database and community contributions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/submissions">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-3 text-2xl">📝</span>
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Review and manage community card submissions. Approve, reject,
                or publish new cards.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Manage Submissions →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/cards">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-3 text-2xl">🃏</span>
                Card Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage the card database, edit card information, and handle card
                metadata.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Manage Cards →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/import">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-3 text-2xl">📥</span>
                Data Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Import card data from official sources and manage automated data
                updates.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Manage Imports →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-3 text-2xl">👥</span>
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage user accounts, permissions, and community moderation.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Manage Users →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-3 text-2xl">📊</span>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Monitor system health and performance metrics.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Database Status:</span>
                <span className="font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Import Service:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>File Storage:</span>
                <span className="font-medium text-green-600">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-3 text-2xl">⚠️</span>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Pending Submissions:</span>
                <span className="font-medium text-yellow-600">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Cards:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Users:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Visit specific sections for detailed analytics
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-gray-500">
            <p>Activity feed will be displayed here.</p>
            <p className="mt-2 text-sm">
              Recent submissions, approvals, and system events will appear in
              this section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard | Gundam Card Game',
  description:
    'Administrative dashboard for managing the Gundam Card Game database.',
};
