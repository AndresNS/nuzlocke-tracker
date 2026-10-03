import type { Method } from './constants';

export interface PokemonEncounter {
  species: string;
  level: { min: number; max: number };
}

export interface AreaEncounter extends PokemonEncounter {
  rate?: number;
}

interface Trade {
  give: string;
  receive: PokemonEncounter;
}

export interface Area {
  method: Method;
  encounters: AreaEncounter[];
}

export interface EncounterTypes {
  areas: Area[];
  trades: Trade[];
  gifts: PokemonEncounter[];
  static: PokemonEncounter[];
}

export interface Route extends EncounterTypes {
  id: string;
  name: string;
}

export type StorageEncounter = Record<
  Route['id'],
  PokemonEncounter['species'] | undefined
>;
