/**
 * Root landing page — game selector.
 *
 * Server component: fetches all active games with card/deck counts via ISR.
 * Interactive rendering is delegated to LandingClient.
 */

import { getAllActiveGamesWithCounts } from '@/lib/database/games';
import { LandingClient } from './LandingClient';

// Revalidate once per hour so card/deck counts stay reasonably fresh
export const revalidate = 3600;

export default async function Home() {
  const games = await getAllActiveGamesWithCounts();
  return <LandingClient games={games} />;
}
