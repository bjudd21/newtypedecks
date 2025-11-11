'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';

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
    <div className="mx-auto max-w-6xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-3xl font-bold text-transparent">
          Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-400">
          Ready to dive into the Gundam Card Game? Here&apos;s your personal
          dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-[#443a5c] bg-[#2d2640]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-400">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-[#443a5c] bg-[#2d2640]">
          <CardHeader>
            <CardTitle className="text-[#a89ec7]">QUICK ACTIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group rounded-lg border border-[#443a5c] bg-[#1a1625] p-4 text-left transition-all duration-200 hover:border-[#8b7aaa] hover:bg-[#3a3050] hover:shadow-lg hover:shadow-[#8b7aaa]/20"
                >
                  <div className="mb-2 flex items-center">
                    <span className="mr-3 text-xl">{action.icon}</span>
                    <h3 className="font-medium text-white transition-colors group-hover:text-[#a89ec7]">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-[#443a5c] bg-[#2d2640]">
          <CardHeader>
            <CardTitle className="text-[#a89ec7]">RECENT ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="py-8 text-center text-gray-400">
                <p>No recent activity yet.</p>
                <p className="mt-1 text-sm text-gray-500">
                  Start building decks or managing your collection to see
                  activity here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Management */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Account Info */}
        <Card className="border-[#443a5c] bg-[#2d2640]">
          <CardHeader>
            <CardTitle className="text-[#a89ec7]">ACCOUNT INFORMATION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Name
                </label>
                <p className="text-white">{user.name || 'Not set'}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Email
                </label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Account Type
                </label>
                <p className="text-white capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
                className="w-full border-[#8b7aaa] bg-[#2d2640] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white"
              >
                EDIT PROFILE
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Preferences */}
        <Card className="border-[#443a5c] bg-[#2d2640]">
          <CardHeader>
            <CardTitle className="text-[#a89ec7]">SETTINGS & PREFERENCES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
                <h4 className="mb-2 font-medium text-white">
                  Privacy Settings
                </h4>
                <p className="mb-3 text-sm text-gray-400">
                  Control who can see your decks and collection.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-[#8b7aaa] bg-[#2d2640] text-[#8b7aaa]"
                >
                  COMING SOON
                </Button>
              </div>

              <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
                <h4 className="mb-2 font-medium text-white">Export Data</h4>
                <p className="mb-3 text-sm text-gray-400">
                  Download your decks and collection data.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-[#8b7aaa] bg-[#2d2640] text-[#8b7aaa]"
                >
                  COMING SOON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default UserDashboard;
