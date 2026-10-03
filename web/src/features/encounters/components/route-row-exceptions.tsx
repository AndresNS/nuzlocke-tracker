import { ROUTE_STATE, type Method } from '../constants';
import type { PokemonEncounter, Route } from '../types';

import RouteChoiceButton from './route-choice-button';

interface RouteRowExceptionsProps {
  routeId: Route['id'];
  method: Method;
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

const RouteRowExceptions: React.FC<RouteRowExceptionsProps> = ({
  routeId,
  method,
  isChoiceDisabled,
  handleChoiceButtonClick,
  isChoiceSelected,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <RouteChoiceButton
          key={`${routeId}-${method}`}
          species={'missed'}
          label="Missed"
          method={method}
          routeId={routeId}
          disabled={
            isChoiceDisabled(ROUTE_STATE.MISSED) &&
            !isChoiceSelected(routeId, method, ROUTE_STATE.MISSED)
          }
          selected={isChoiceSelected(routeId, method, ROUTE_STATE.MISSED)}
          onClick={handleChoiceButtonClick}
        />
      </div>
    </div>
  );
};

export default RouteRowExceptions;
