import { Button } from '@heroui/react';

import type { Method } from '../constants';
import type { PokemonEncounter, Route } from '../types';

interface RouteChoiceButtonProps {
  routeId: Route['id'];
  method: Method;
  species: PokemonEncounter['species'];
  selected: boolean;
  disabled: boolean;
  label: string;
  onClick: (
    routeId: Route['id'],
    method: Method,
    species: PokemonEncounter['species'],
  ) => void;
}

const RouteChoiceButton: React.FC<RouteChoiceButtonProps> = ({
  routeId,
  method,
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
        onClick(routeId, method, species);
      }}
    >
      {label}
    </Button>
  );
};

export default RouteChoiceButton;
