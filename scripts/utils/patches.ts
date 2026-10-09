import type { Route } from '@/features/encounters/types.ts';

import { getGraniteCavePatch } from '../patches/granite-cave.ts';

type RoutePatch = (routeId: string) => Route;

export const patchedRoutes: Record<string, RoutePatch | undefined> = {
  granitecave: getGraniteCavePatch,
};
