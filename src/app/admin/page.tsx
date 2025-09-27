import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage the Gundam Card Game database and community contributions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/submissions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">📝</span>
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Review and manage community card submissions. Approve, reject, or publish new cards.
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                Manage Submissions →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/cards">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">🃏</span>
                Card Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage the card database, edit card information, and handle card metadata.
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                Manage Cards →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/import">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">📥</span>
                Data Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Import card data from official sources and manage automated data updates.
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                Manage Imports →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">👥</span>
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage user accounts, permissions, and community moderation.
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                Manage Users →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Monitor system health and performance metrics.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Database Status:</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Import Service:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span>File Storage:</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
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
              <div className="text-xs text-gray-500 mt-2">
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
          <div className="text-center py-8 text-gray-500">
            <p>Activity feed will be displayed here.</p>
            <p className="text-sm mt-2">
              Recent submissions, approvals, and system events will appear in this section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard | Gundam Card Game',
  description: 'Administrative dashboard for managing the Gundam Card Game database.',
};