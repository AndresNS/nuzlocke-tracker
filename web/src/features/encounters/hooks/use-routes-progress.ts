import { STORAGE_KEYS } from '@/constants';
import useLocalStorage from '@/hooks/use-local-storage';

import type { PokemonEncounter, Route, StorageEncounter } from '../types';

const useRoutesProgress = () => {
  const [encounters, setEncounters] = useLocalStorage<StorageEncounter>(
    STORAGE_KEYS.ENCOUNTERS,
    {},
  );

  const selectEncounter = (
    routeId: Route['id'],
    encounter: PokemonEncounter['species'] | undefined,
  ) => {
    setEncounters((prev) => ({ ...prev, [routeId]: encounter }));
  };

  const resetRun = () => {
    setEncounters({});
  };

  return { encounters, selectEncounter, resetRun };
};

export default useRoutesProgress;
