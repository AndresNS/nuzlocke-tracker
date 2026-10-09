import type { PokemonEncounter, Route } from '@/features/encounters/types.ts';

import staticsList from '../data/patch-static.json' with { type: 'json' };

export function getRouteStatics(routeId: Route['id']): PokemonEncounter[] {
  const routeStatics = (
    staticsList as Record<Route['id'], PokemonEncounter[] | undefined>
  )[routeId];

  return routeStatics ?? [];
}
