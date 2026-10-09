import type { Method } from './constants';

export interface PokemonEncounter {
  species: string;
  level: { min: number; max: number };
}

export interface AreaEncounter extends PokemonEncounter {
  rate: number;
}

export interface TradeEncounter {
  species: string;
  item: string;
}

export interface Trade {
  give: string;
  receive: TradeEncounter;
}

export interface Area {
  method: Method;
  floor?: string;
  encounters: AreaEncounter[];
}

export interface Route {
  id: string;
  name: string;
  areas: Area[];
  trades: Trade[];
  gifts: PokemonEncounter[];
  static: PokemonEncounter[];
}

export type StorageEncounter = Record<
  Route['id'],
  PokemonEncounter['species'] | undefined
>;
