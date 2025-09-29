'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { GameContentAttribution, AttributionTooltip } from '@/components/layout';
import { CardDatabaseSearch } from '@/components/card/CardDatabaseSearch';

export default function Home() {
  return (
    <div className="min-h-screen particle-field relative z-10">
      {/* Search Interface Hero */}
      <div className="container mx-auto px-4 py-20">
        <CardDatabaseSearch className="mb-20" />

        <div className="text-center mb-12">
          <GameContentAttribution className="text-xs opacity-60 tech-text" />
          <AttributionTooltip />
        </div>

        {/* Neural Interface Modules */}
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          <div className="card-enhanced p-8 group relative z-20">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl cyber-border bg-black/50 flex items-center justify-center glow-cyber pulse-cyber">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H3a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tech-text uppercase tracking-wide text-neon">Database Module</h3>
                <div className="text-xs tech-text opacity-60 uppercase tracking-wider">Neural Search Engine</div>
              </div>
            </div>
            <p className="text-cyan-300 mb-8 leading-relaxed tech-text">
              Advanced neural network-powered card database with quantum search algorithms,
              holographic display rendering, and predictive analysis systems
            </p>
            <Link href="/cards">
              <Button variant="cyber" size="lg" className="w-full relative z-10">
                Initialize Database
              </Button>
            </Link>
          </div>

          <div className="card-enhanced p-8 group relative z-20">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl neon-border bg-black/50 flex items-center justify-center glow-neon pulse-neon">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tech-text uppercase tracking-wide text-neon">Tactical Module</h3>
                <div className="text-xs tech-text opacity-60 uppercase tracking-wider">Deck Constructor</div>
              </div>
            </div>
            <p className="text-cyan-300 mb-8 leading-relaxed tech-text">
              Military-grade deck construction system with real-time tactical analysis,
              threat assessment protocols, and strategic optimization algorithms
            </p>
            <Link href="/decks">
              <Button variant="neon" size="lg" className="w-full relative z-10">
                Deploy Constructor
              </Button>
            </Link>
          </div>

          <div className="card-enhanced p-8 group relative z-20">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl plasma-border bg-black/50 flex items-center justify-center glow-plasma pulse-plasma">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tech-text uppercase tracking-wide text-plasma">Archive Module</h3>
                <div className="text-xs tech-text opacity-60 uppercase tracking-wider">Collection Matrix</div>
              </div>
            </div>
            <p className="text-cyan-300 mb-8 leading-relaxed tech-text">
              Quantum storage system for personal asset tracking with dimensional
              cataloging, completion analytics, and acquisition recommendations
            </p>
            <Link href="/collection">
              <Button variant="plasma" size="lg" className="w-full relative z-10">
                Access Archive
              </Button>
            </Link>
          </div>
        </div>

        {/* Neural Network Status */}
        <div className="card-enhanced p-16 text-center relative overflow-hidden mb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-deep-space to-nebula-dark"></div>

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full cyber-border bg-black/60 backdrop-blur-strong">
              <div className="w-3 h-3 rounded-full pulse-cyber"></div>
              <span className="tech-text text-sm font-medium uppercase tracking-widest">Neural Network Status</span>
              <div className="w-3 h-3 rounded-full pulse-neon"></div>
            </div>

            <h2 className="mb-8 relative">
              <span className="block text-gradient text-4xl md:text-6xl mb-4">System Architecture</span>
              <span className="block text-neon text-2xl md:text-3xl tech-text">Fully Operational</span>
            </h2>

            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-xl tech-text leading-relaxed text-cyan-300 mb-6">
                Advanced quantum-computational platform featuring neural deck analysis,
                holographic card visualization, and predictive meta-game algorithms.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 neon-border bg-black/30 backdrop-blur-strong rounded-lg">
                  <div className="text-3xl font-bold text-neon mb-1">∞</div>
                  <div className="text-xs tech-text uppercase opacity-80">Possibilities</div>
                </div>
                <div className="p-4 cyber-border bg-black/30 backdrop-blur-strong rounded-lg">
                  <div className="text-3xl font-bold text-cyber mb-1">AI</div>
                  <div className="text-xs tech-text uppercase opacity-80">Enhanced</div>
                </div>
                <div className="p-4 plasma-border bg-black/30 backdrop-blur-strong rounded-lg">
                  <div className="text-3xl font-bold text-plasma mb-1">24/7</div>
                  <div className="text-xs tech-text uppercase opacity-80">Active</div>
                </div>
                <div className="p-4 neon-border bg-black/30 backdrop-blur-strong rounded-lg">
                  <div className="text-3xl font-bold text-energy mb-1">PWA</div>
                  <div className="text-xs tech-text uppercase opacity-80">Ready</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button variant="cyber" size="xl" className="px-10 relative z-10">
                Initialize Access
              </Button>
              <Button variant="hologram" size="xl" className="px-10 relative z-10">
                System Diagnostics
              </Button>
            </div>
          </div>
        </div>

        {/* System Specifications */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-enhanced p-6 text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl cyber-border bg-black/50 flex items-center justify-center glow-cyber">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="tech-text uppercase tracking-wide text-neon mb-3">Quantum Speed</h3>
            <p className="text-sm text-cyan-300 tech-text leading-relaxed">
              Hyper-optimized neural processing with instantaneous search algorithms and real-time data streams
            </p>
          </div>

          <div className="card-enhanced p-6 text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl neon-border bg-black/50 flex items-center justify-center glow-neon">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="tech-text uppercase tracking-wide text-neon mb-3">Battle Ready</h3>
            <p className="text-sm text-cyan-300 tech-text leading-relaxed">
              Military-grade tournament protocols with tactical validation and strategic meta-analysis systems
            </p>
          </div>

          <div className="card-enhanced p-6 text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl plasma-border bg-black/50 flex items-center justify-center glow-plasma">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="tech-text uppercase tracking-wide text-plasma mb-3">Neural Network</h3>
            <p className="text-sm text-cyan-300 tech-text leading-relaxed">
              Advanced social consciousness protocols enabling collective intelligence and strategic collaboration
            </p>
          </div>

          <div className="card-enhanced p-6 text-center group">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl cyber-border bg-black/50 flex items-center justify-center glow-cyber">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="tech-text uppercase tracking-wide text-neon mb-3">Omnipresent</h3>
            <p className="text-sm text-cyan-300 tech-text leading-relaxed">
              Multi-dimensional compatibility matrix with offline consciousness backup and sync protocols
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
