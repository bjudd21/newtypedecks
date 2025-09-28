import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { GameContentAttribution, AttributionTooltip } from '@/components/layout';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
          Welcome to Gundam Card Game Database
          <AttributionTooltip />
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          The most comprehensive database and deck building platform for the
          Gundam Card Game. Search cards, build decks, and manage your
          collection.
        </p>
        <div className="mt-4">
          <GameContentAttribution className="text-sm" />
        </div>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Card Database</CardTitle>
            <CardDescription>
              Search and browse all Gundam Card Game cards with advanced
              filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="primary">
              Browse Cards
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deck Building</CardTitle>
            <CardDescription>
              Create and manage your decks with drag-and-drop functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Build Decks
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection</CardTitle>
            <CardDescription>
              Track your physical card collection and see what you own
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Manage Collection
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg bg-blue-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Coming Soon
        </h2>
        <p className="mb-6 text-gray-600">
          We&apos;re building the ultimate Gundam Card Game platform. The card
          database is currently in development.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg">
            Get Notified
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
