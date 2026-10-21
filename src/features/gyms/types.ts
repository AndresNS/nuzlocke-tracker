import type { Location, PokemonType, TrainerPokemon } from '@/types';

export interface Gym {
  location: Location;
  leader: string;
  isDouble: boolean;
  type: PokemonType;
  badge: string;
  sprite: string;
  levelCap: number;
  team: TrainerPokemon[];
}
