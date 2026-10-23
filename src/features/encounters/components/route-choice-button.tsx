import { Button } from '@heroui/react';

import type { Method } from '../constants';
import type { PokemonEncounter, Route } from '../types';

interface RouteChoiceButtonProps {
  routeId: Route['id'];
  method?: Method;
  floor?: string;
  species: PokemonEncounter['species'];
  selected: boolean;
  disabled: boolean;
  label: string;
  onClick: (
    routeId: Route['id'],
    species: PokemonEncounter['species'],
    method?: Method,
    floor?: string,
  ) => void;
}

export const RouteChoiceButton: React.FC<RouteChoiceButtonProps> = ({
  routeId,
  method,
  floor,
  species,
  selected,
  disabled,
  label,
  onClick,
}) => {
  return (
    <Button
      variant={selected ? 'tertiary' : 'outline'}
      isDisabled={disabled}
      onClick={() => {
        onClick(routeId, species, method, floor);
      }}
    >
      {label}
    </Button>
  );
};
