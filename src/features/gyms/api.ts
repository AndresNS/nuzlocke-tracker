import gyms from './data/gyms.json';
import type { Gym } from './types';

export const getGyms = (): Gym[] => {
  return gyms as Gym[];
};
