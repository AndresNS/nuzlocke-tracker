import type { PokemonEncounter, Route } from '@/features/encounters/types.ts';

import giftsList from '../data/patch-gifts.json' with { type: 'json' };

export function getRouteGifts(routeId: Route['id']): PokemonEncounter[] {
  const routeGifts = (
    giftsList as Record<Route['id'], PokemonEncounter[] | undefined>
  )[routeId];

  return routeGifts ?? [];
}
