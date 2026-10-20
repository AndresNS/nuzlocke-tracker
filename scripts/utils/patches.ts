import type { Route } from '@/features/encounters/types.ts';

import { getGraniteCavePatch } from '../patches/granite-cave.ts';
import { getMeteorFallsPatch } from '../patches/meteor-falls.ts';

type RoutePatch = (routeId: string) => Route;

export const patchedRoutes: Record<string, RoutePatch | undefined> = {
  granitecave: getGraniteCavePatch,
  meteorfalls: getMeteorFallsPatch,
};
