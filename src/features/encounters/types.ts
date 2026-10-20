import type { Method, ROUTE_STATUS } from './constants';

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

export type RouteStatus = (typeof ROUTE_STATUS)[keyof typeof ROUTE_STATUS];

export interface StorageEncounter {
  method?: Method;
  floor?: string;
  species: string;
  status: RouteStatus;
}

export type StorageRouteProgress = Record<
  Route['id'],
  StorageEncounter | undefined
>;
