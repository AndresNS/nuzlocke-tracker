import type { Route } from '@/features/encounters/types.ts';

import graniteCavePatch from '../data/patch-granite-cave.json' with { type: 'json' };

export function getGraniteCavePatch(): Route {
  return graniteCavePatch;
}
