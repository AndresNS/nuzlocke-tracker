import { STORAGE_KEYS } from '@/constants';
import { useLocalStorage } from '@/hooks/use-local-storage';

import type { Route, StorageEncounter, StorageRouteProgress } from '../types';

export const useStoredRoutesProgress = () => {
  const [encounters, setEncounters] = useLocalStorage<StorageRouteProgress>(
    STORAGE_KEYS.ENCOUNTERS,
    {},
  );

  const selectEncounter = (
    routeId: Route['id'],
    encounter: StorageEncounter | undefined,
  ) => {
    setEncounters((prev) => ({ ...prev, [routeId]: encounter }));
  };

  const resetRun = () => {
    setEncounters({});
  };

  return { encounters, selectEncounter, resetRun };
};
