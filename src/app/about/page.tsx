// About page - Information about the site and project
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { PageLayout } from '@/components/layout';

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About</h1>
          <p className="text-gray-600">
            Learn more about the Gundam Card Game Database and Deck Builder
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                The Gundam Card Game Database is a comprehensive platform designed to help players
                discover, collect, and build decks for the Gundam Card Game. Our mission is to
                provide the community with the tools they need to enhance their gaming experience.
              </p>
              <p className="text-gray-700">
                This project is built with modern web technologies and follows best practices
                for performance, accessibility, and user experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Card Database</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comprehensive card search and filtering</li>
                    <li>• High-resolution card images</li>
                    <li>• Detailed card information and rulings</li>
                    <li>• Set information and release dates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Deck Building</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Intuitive drag-and-drop interface</li>
                    <li>• Deck validation and statistics</li>
                    <li>• Save and share decks</li>
                    <li>• Import/export functionality</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Collection Management</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Track your personal collection</li>
                    <li>• Quantity management</li>
                    <li>• Collection statistics</li>
                    <li>• Integration with deck building</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Share decks with the community</li>
                    <li>• Browse popular decks</li>
                    <li>• User profiles and collections</li>
                    <li>• Community-driven content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Next.js 15 with App Router</li>
                    <li>• React 19 with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Redux Toolkit for state management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PostgreSQL database</li>
                    <li>• Prisma ORM</li>
                    <li>• Redis for caching</li>
                    <li>• Next.js API routes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Development</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Docker for local development</li>
                    <li>• Jest and React Testing Library</li>
                    <li>• ESLint and Prettier</li>
                    <li>• TypeScript for type safety</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                This website is not affiliated with Bandai Namco Entertainment Inc. All card images
                and game content are used under fair use for educational and community purposes.
                The Gundam Card Game is a trademark of Bandai Namco Entertainment Inc.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
