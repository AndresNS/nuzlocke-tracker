import { Label } from '@heroui/react';

import { type Method } from '../constants';
import type { AreaEncounter, PokemonEncounter, Route } from '../types';

import { RouteChoiceButton } from './route-choice-button';

interface RouteRowSectionProps {
  title: string;
  routeId: Route['id'];
  method: Method;
  floor?: string;
  sectionEncounters: AreaEncounter[] | PokemonEncounter[];
  isChoiceSelected: (
    routeId: Route['id'],
    encounter: PokemonEncounter['species'],
    method?: Method,
    floor?: string,
  ) => boolean;
  isChoiceDisabled: (species: PokemonEncounter['species']) => boolean;
  handleChoiceButtonClick: (
    routeId: Route['id'],
    encounter: PokemonEncounter['species'],
    method?: Method,
    floor?: string,
  ) => void;
}

export const RouteRowSection: React.FC<RouteRowSectionProps> = ({
  title,
  routeId,
  method,
  floor,
  sectionEncounters,
  isChoiceSelected,
  isChoiceDisabled,
  handleChoiceButtonClick,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {title} {floor && '(' + floor + ')'}
      </Label>
      <div className="flex flex-wrap gap-2">
        {sectionEncounters.map((encounter: PokemonEncounter) => (
          <RouteChoiceButton
            key={`${routeId}-${floor ? floor + method : method}-${encounter.species}`}
            species={encounter.species}
            method={method}
            floor={floor}
            label={encounter.species}
            routeId={routeId}
            disabled={
              isChoiceDisabled(encounter.species) &&
              !isChoiceSelected(routeId, encounter.species, method, floor)
            }
            selected={isChoiceSelected(
              routeId,
              encounter.species,
              method,
              floor,
            )}
            onClick={handleChoiceButtonClick}
          />
        ))}
      </div>
    </div>
  );
};
