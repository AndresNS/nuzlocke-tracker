import type { Method } from '../constants';
import type { PokemonEncounter } from '../types';

export const toEncounterFormat = (
  method: Method,
  encounter: PokemonEncounter['species'],
) => `${method}-${encounter}`;

export const getSpeciesFromEncounter = (value: string) =>
  value.slice(value.indexOf('-') + 1);
