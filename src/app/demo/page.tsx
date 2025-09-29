"use client"

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge, RarityBadge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen particle-field relative z-10 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-display mb-4 text-gradient">
            Component Showcase
          </h1>
          <p className="text-xl text-cyan-300 tech-text">
            Advanced shadcn/ui Components with Microanimations
          </p>
        </motion.div>

        {/* Button Variants */}
        <Card variant="cyber" className="mb-8">
          <CardHeader>
            <CardTitle>Advanced Button Components</CardTitle>
            <CardDescription>
              Sophisticated buttons with sci-fi theming and microanimations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="cyber">Cyber Style</Button>
              <Button variant="neon">Neon Effect</Button>
              <Button variant="plasma">Plasma Glow</Button>
              <Button variant="hologram">Hologram</Button>

              <Button variant="cyber" size="lg">Large Cyber</Button>
              <Button variant="neon" size="lg">Large Neon</Button>
              <Button variant="plasma" size="lg">Large Plasma</Button>
              <Button variant="hologram" size="lg">Large Holo</Button>

              <Button variant="outline">Outline</Button>
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div className="mt-6 flex gap-4">
              <Button variant="cyber" isLoading>Loading Cyber</Button>
              <Button variant="neon" isLoading>Loading Neon</Button>
              <Button variant="plasma" disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="cyber">
            <CardHeader>
              <CardTitle>Cyber Card</CardTitle>
              <CardDescription>Advanced neural interface</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-300">Hover to see effects</p>
            </CardContent>
          </Card>

          <Card variant="neon">
            <CardHeader>
              <CardTitle>Neon Card</CardTitle>
              <CardDescription>Tactical systems online</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-green-300">Interactive animations</p>
            </CardContent>
          </Card>

          <Card variant="plasma">
            <CardHeader>
              <CardTitle>Plasma Card</CardTitle>
              <CardDescription>Energy core activated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-300">Dynamic gradients</p>
            </CardContent>
          </Card>

          <Card variant="hologram">
            <CardHeader>
              <CardTitle>Hologram Card</CardTitle>
              <CardDescription>Projection system active</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-300">Scanning animations</p>
            </CardContent>
          </Card>
        </div>

        {/* Input Variants */}
        <Card variant="neon" className="mb-8">
          <CardHeader>
            <CardTitle>Advanced Input Fields</CardTitle>
            <CardDescription>
              Interactive inputs with scan lines and particle effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  variant="cyber"
                  label="Cyber Interface"
                  placeholder="Enter neural link code..."
                  helperText="Focus to activate particle effects"
                />
                <Input
                  variant="neon"
                  label="Tactical Scanner"
                  placeholder="Scan target coordinates..."
                />
              </div>
              <div className="space-y-4">
                <Input
                  variant="plasma"
                  label="Plasma Core"
                  placeholder="Input energy levels..."
                />
                <Input
                  variant="default"
                  label="Standard Input"
                  placeholder="Regular interface..."
                  error="Example error state"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Variants */}
        <Card variant="plasma" className="mb-8">
          <CardHeader>
            <CardTitle>Dynamic Badge System</CardTitle>
            <CardDescription>
              Status indicators and rarity badges with animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-purple-300">Standard Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="cyber" animate>Cyber</Badge>
                  <Badge variant="neon" animate>Neon</Badge>
                  <Badge variant="plasma" animate>Plasma</Badge>
                  <Badge variant="hologram" animate>Hologram</Badge>
                  <Badge variant="primary" animate>Primary</Badge>
                  <Badge variant="success" animate>Success</Badge>
                  <Badge variant="warning" animate>Warning</Badge>
                  <Badge variant="destructive" animate>Danger</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3 text-purple-300">Rarity Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <RarityBadge rarity="Common" size="lg" />
                  <RarityBadge rarity="Uncommon" size="lg" />
                  <RarityBadge rarity="Rare" size="lg" />
                  <RarityBadge rarity="Epic" size="lg" />
                  <RarityBadge rarity="Legendary" size="lg" />
                  <RarityBadge rarity="Mythic" size="lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card variant="hologram" className="mb-8">
          <CardHeader>
            <CardTitle>Interactive Component Demo</CardTitle>
            <CardDescription>
              Try the components in a realistic interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  variant="cyber"
                  label="Search Database"
                  placeholder="Enter card name or ID..."
                />
                <div className="flex gap-2">
                  <Button variant="cyber" size="sm">Search</Button>
                  <Button variant="neon" size="sm">Filter</Button>
                  <Button variant="plasma" size="sm">Sort</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="cyber">Online</Badge>
                  <Badge variant="neon">Active</Badge>
                  <Badge variant="success">Connected</Badge>
                </div>
                <p className="text-cyan-300 text-sm">
                  Status: All systems operational. Neural interface stable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link href="/">
            <Button variant="hologram" size="lg">
              Return to Neural Interface
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}