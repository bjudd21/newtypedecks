'use client';

import React from 'react';
import type { ComparableDeck } from './types';

function computeCostDistribution(deck: ComparableDeck): Record<number, number> {
  const dist: Record<number, number> = {};
  for (const dc of deck.cards) {
    const cost = dc.card.cost ?? 0;
    dist[cost] = (dist[cost] ?? 0) + dc.quantity;
  }
  return dist;
}

function computeTypeDistribution(deck: ComparableDeck): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const dc of deck.cards) {
    const type = dc.card.type?.name ?? 'Unknown';
    dist[type] = (dist[type] ?? 0) + dc.quantity;
  }
  return dist;
}

interface MiniChartEntry {
  label: string;
  countA: number;
  countB: number;
}

interface MiniChartProps {
  title: string;
  entries: MiniChartEntry[];
  nameA: string;
  nameB: string;
}

const MiniChart: React.FC<MiniChartProps> = ({
  title,
  entries,
  nameA,
  nameB,
}) => {
  const globalMax = Math.max(
    ...entries.map((e) => Math.max(e.countA, e.countB)),
    1
  );

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold tracking-wide text-[#8b7aaa] uppercase">
        {title}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#8b7aaa]" />
          <span className="max-w-[80px] truncate">{nameA}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#5a8a6b]" />
          <span className="max-w-[80px] truncate">{nameB}</span>
        </span>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.label} className="space-y-0.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">{entry.label}</span>
              <span className="text-gray-500">
                {entry.countA} / {entry.countB}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#2d2640]">
              <div
                className="h-1.5 rounded-full bg-[#8b7aaa]"
                style={{
                  width: `${(entry.countA / globalMax) * 100}%`,
                }}
              />
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#2d2640]">
              <div
                className="h-1.5 rounded-full bg-[#5a8a6b]"
                style={{
                  width: `${(entry.countB / globalMax) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ComparisonStatsProps {
  deckA: ComparableDeck;
  deckB: ComparableDeck;
}

export const ComparisonStats: React.FC<ComparisonStatsProps> = ({
  deckA,
  deckB,
}) => {
  const costA = computeCostDistribution(deckA);
  const costB = computeCostDistribution(deckB);
  const typeA = computeTypeDistribution(deckA);
  const typeB = computeTypeDistribution(deckB);

  const allCosts = [
    ...new Set([
      ...Object.keys(costA).map(Number),
      ...Object.keys(costB).map(Number),
    ]),
  ].sort((a, b) => a - b);

  const allTypes = [
    ...new Set([...Object.keys(typeA), ...Object.keys(typeB)]),
  ].sort();

  const costEntries: MiniChartEntry[] = allCosts.map((cost) => ({
    label: String(cost),
    countA: costA[cost] ?? 0,
    countB: costB[cost] ?? 0,
  }));

  const typeEntries: MiniChartEntry[] = allTypes.map((type) => ({
    label: type,
    countA: typeA[type] ?? 0,
    countB: typeB[type] ?? 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 rounded-xl border border-[#443a5c] bg-[#2d2640] p-4 sm:grid-cols-2">
      <MiniChart
        title="Cost Curve"
        entries={costEntries}
        nameA={deckA.name}
        nameB={deckB.name}
      />
      <MiniChart
        title="Type Distribution"
        entries={typeEntries}
        nameA={deckA.name}
        nameB={deckB.name}
      />
    </div>
  );
};
