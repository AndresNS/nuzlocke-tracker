import { Label } from '@heroui/react';

import { type Method } from '../constants';
import type { AreaEncounter, PokemonEncounter, Route } from '../types';

import RouteChoiceButton from './route-choice-button';

interface RouteRowSectionProps {
  title: string;
  routeId: Route['id'];
  method: Method;
  sectionEncounters: AreaEncounter[] | PokemonEncounter[];
  isChoiceSelected: (
    routeId: Route['id'],
    method: Method,
    encounter: PokemonEncounter['species'],
  ) => boolean;
  isChoiceDisabled: (species: PokemonEncounter['species']) => boolean;
  handleChoiceButtonClick: (
    routeId: Route['id'],
    method: Method,
    encounter: PokemonEncounter['species'],
  ) => void;
}

const RouteRowSection: React.FC<RouteRowSectionProps> = ({
  title,
  routeId,
  method,
  sectionEncounters,
  isChoiceSelected,
  isChoiceDisabled,
  handleChoiceButtonClick,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {sectionEncounters.map((encounter: PokemonEncounter) => (
          <RouteChoiceButton
            key={`${routeId}-${method}-${encounter.species}`}
            species={encounter.species}
            method={method}
            label={encounter.species}
            routeId={routeId}
            disabled={
              isChoiceDisabled(encounter.species) &&
              !isChoiceSelected(routeId, method, encounter.species)
            }
            selected={isChoiceSelected(routeId, method, encounter.species)}
            onClick={handleChoiceButtonClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RouteRowSection;
