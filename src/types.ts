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
  url: string;
}

export interface BasePokemon {
  id: string;
  name: string;
  types: PokemonType[];
}

export interface TrainerPokemon extends BasePokemon {
  sprite: string;
  level: number;
  item: Item;
  moves: Move[];
}

export interface Location {
  id: string;
  name: string;
}

export interface Gym {
  location: Location;
  leader: string;
  isDouble: boolean;
  type: PokemonType;
  badge: string;
  sprite: string;
  team: TrainerPokemon[];
}
