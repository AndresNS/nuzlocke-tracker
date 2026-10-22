import type { STAT_KEYS } from './constants';

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface Item {
  name: string;
  url: string;
}

export interface Move {
  name: string;
  type: PokemonType;
  power: number | null;
  url: string;
  effect: string;
}

export type StatKey = (typeof STAT_KEYS)[number];
export type Stats = Record<StatKey, number>;

export interface BasePokemon {
  id: string;
  name: string;
  types: PokemonType[];
}

export interface TrainerPokemon extends BasePokemon {
  sprite: string;
  level: number;
  item?: Item;
  moves: Move[];
  stats: Stats;
}

export interface Location {
  id: string;
  name: string;
}
