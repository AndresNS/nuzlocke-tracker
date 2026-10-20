import { ROUTE_STATUS, type Method } from '../constants';
import type { PokemonEncounter, Route } from '../types';

import RouteChoiceButton from './route-choice-button';

interface RouteRowExceptionsProps {
  routeId: Route['id'];
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

const RouteRowExceptions: React.FC<RouteRowExceptionsProps> = ({
  routeId,
  isChoiceDisabled,
  handleChoiceButtonClick,
  isChoiceSelected,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <RouteChoiceButton
          key={`${routeId}-${ROUTE_STATUS.MISSED}`}
          species={'missed'}
          label="Missed"
          routeId={routeId}
          disabled={
            isChoiceDisabled(ROUTE_STATUS.MISSED) &&
            !isChoiceSelected(routeId, ROUTE_STATUS.MISSED)
          }
          selected={isChoiceSelected(routeId, ROUTE_STATUS.MISSED)}
          onClick={handleChoiceButtonClick}
        />
      </div>
    </div>
  );
};

export default RouteRowExceptions;
