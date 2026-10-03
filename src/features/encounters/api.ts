import routes from './data/encounters.json';
import type { Route } from './types';

export const getRoutes = (): Route[] => {
  return routes as Route[];
};
