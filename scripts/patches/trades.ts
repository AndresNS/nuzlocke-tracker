import type { Route, Trade } from '@/features/encounters/types.ts';

import tradeslist from '../data/patch-trades.json' with { type: 'json' };

export function getRouteTrades(routeId: Route['id']): Trade[] {
  const routeTrades = (tradeslist as Record<Route['id'], Trade[] | undefined>)[
    routeId
  ];

  return routeTrades ?? [];
}
