import routes from './data/routes-encounters.json';
import type { Route } from './types';

export const getRoutes = (): Route[] => {
  return routes as Route[];
};
