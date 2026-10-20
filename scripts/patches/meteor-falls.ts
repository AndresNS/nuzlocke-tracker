import type { Route } from '@/features/encounters/types.ts';

import meteorFallsPatch from '../data/patch-meteor-falls.json' with { type: 'json' };

export function getMeteorFallsPatch(): Route {
  return meteorFallsPatch;
}
