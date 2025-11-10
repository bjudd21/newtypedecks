'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

interface UserDashboardProps {
  user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const router = useRouter();

  const quickActions = [
    {
      title: 'Build New Deck',
      description: 'Create a new deck with the deck builder',
      icon: '🃏',
      action: () => router.push('/decks/create'),
    },
    {
      title: 'Browse Cards',
      description: 'Explore the complete card database',
      icon: '🔍',
      action: () => router.push('/cards'),
    },
    {
      title: 'My Collection',
      description: 'Manage your card collection',
      icon: '📚',
      action: () => router.push('/collection'),
    },
    {
      title: 'My Decks',
      description: 'View and edit your saved decks',
      icon: '📋',
      action: () => router.push('/decks'),
    },
  ];

  const stats = [
    {
      title: 'Total Decks',
      value: '0', // TODO: Replace with actual data
      icon: '🃏',
      color: 'text-blue-600',
    },
    {
      title: 'Cards Owned',
      value: '0', // TODO: Replace with actual data
      icon: '📚',
      color: 'text-green-600',
    },
    {
      title: 'Collection Value',
      value: '$0', // TODO: Replace with actual data
      icon: '💰',
      color: 'text-purple-600',
    },
    {
      title: 'Favorite Format',
      value: 'Standard', // TODO: Replace with actual data
      icon: '⭐',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-600">
          Ready to dive into the Gundam Card Game? Here&apos;s your personal dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-3">{action.icon}</span>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity yet.</p>
                <p className="text-sm mt-1">
                  Start building decks or managing your collection to see activity here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Management */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">{user.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <p className="text-gray-900 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
                className="w-full"
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Settings & Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Display Preferences</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Customize how cards and decks are displayed.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Coming Soon
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Privacy Settings</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Control who can see your decks and collection.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Coming Soon
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download your decks and collection data.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help & Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📖</div>
              <h4 className="font-medium text-gray-900 mb-1">User Guide</h4>
              <p className="text-sm text-gray-600 mb-3">
                Learn how to use all features effectively.
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">❓</div>
              <h4 className="font-medium text-gray-900 mb-1">FAQs</h4>
              <p className="text-sm text-gray-600 mb-3">
                Find answers to common questions.
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-medium text-gray-900 mb-1">Community</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with other Gundam Card Game players.
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDashboard;