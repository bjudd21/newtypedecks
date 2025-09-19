import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Gundam Card Game Database
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The most comprehensive database and deck building platform for the Gundam Card Game. 
          Search cards, build decks, and manage your collection.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Card Database</CardTitle>
            <CardDescription>
              Search and browse all Gundam Card Game cards with advanced filtering
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

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          We're building the ultimate Gundam Card Game platform. 
          The card database is currently in development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
