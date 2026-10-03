import { Button, cn, Disclosure, Separator } from '@heroui/react';

import { METHOD, METHOD_LABELS, ROUTE_STATE, type Method } from '../constants';
import type { PokemonEncounter, Route, StorageEncounter } from '../types';
import { toEncounterFormat } from '../utils/encounters-format';
import { getEvolutionLine } from '../utils/evolution-line';

import RouteRowExceptions from './route-row-exceptions';
import RouteRowSection from './route-row-section';

interface RouteRowProps {
  route: Route;
  isExpanded: boolean;
  encounters: StorageEncounter;
  onSelectEncounter: (
    routeId: Route['id'],
    encounter: PokemonEncounter['species'] | undefined,
  ) => void;
}

const RouteRow: React.FC<RouteRowProps> = ({
  route,
  isExpanded,
  encounters,
  onSelectEncounter,
}) => {
  const routeEncounterClaimed = (route: string) => encounters[route];

  const isChoiceSelected = (
    routeId: Route['id'],
    method: Method,
    encounter: PokemonEncounter['species'],
  ) => {
    if (encounter === ROUTE_STATE.MISSED)
      return encounters[routeId] === ROUTE_STATE.MISSED;
    return encounters[routeId] === toEncounterFormat(method, encounter);
  };

  const isChoiceDisabled = (species: PokemonEncounter['species']) => {
    const evolutionLine = getEvolutionLine(species);
    const isCaught = Object.entries(encounters).find((entry) => {
      if (!entry[1]) return false;
      const encounter = entry[1].split('-');

      return evolutionLine.includes(encounter[encounter.length - 1]);
    });

    return !!isCaught;
  };

  const handleChoiceButtonClick = (
    routeId: Route['id'],
    method: Method,
    encounter: PokemonEncounter['species'],
  ) => {
    const routeEncounter =
      encounter !== ROUTE_STATE.MISSED
        ? toEncounterFormat(method, encounter)
        : ROUTE_STATE.MISSED;

    if (encounters[routeId] === routeEncounter) {
      onSelectEncounter(routeId, undefined);
      return;
    }
    onSelectEncounter(routeId, routeEncounter);
  };

  return (
    <>
      <Disclosure aria-label={route.name} id={route.id}>
        <Disclosure.Heading>
          <Button
            slot="trigger"
            variant={isExpanded ? 'secondary' : 'tertiary'}
            className={cn('w-full border-none', {
              'bg-transparent': !isExpanded,
            })}
          >
            <div className="flex w-full justify-between gap-2">
              <p
                className={cn({
                  'text-muted': routeEncounterClaimed(route.id) && !isExpanded,
                })}
              >
                {route.name}
              </p>
              <p>{routeEncounterClaimed(route.id) ? 'Claimed' : 'Available'}</p>
            </div>
            <Disclosure.Indicator className="text-muted" />
          </Button>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="flex flex-col gap-2 rounded-3xl bg-surface p-4">
            {isExpanded && (
              <>
                {/* Areas */}
                {route.areas.map((area) => (
                  <RouteRowSection
                    key={`section-${route.id}-${area.method}`}
                    method={area.method}
                    routeId={route.id}
                    title={METHOD_LABELS[area.method]}
                    sectionEncounters={area.encounters}
                    isChoiceSelected={isChoiceSelected}
                    handleChoiceButtonClick={handleChoiceButtonClick}
                    isChoiceDisabled={isChoiceDisabled}
                  />
                ))}

                {/* Static */}
                {route.static.length > 0 && (
                  <RouteRowSection
                    method={METHOD.STATIC}
                    routeId={route.id}
                    title={METHOD_LABELS.static}
                    sectionEncounters={route.static}
                    isChoiceSelected={isChoiceSelected}
                    handleChoiceButtonClick={handleChoiceButtonClick}
                    isChoiceDisabled={isChoiceDisabled}
                  />
                )}

                {/* Gift */}
                {route.gifts.length > 0 && (
                  <RouteRowSection
                    method={METHOD.GIFT}
                    routeId={route.id}
                    title={METHOD_LABELS.gift}
                    sectionEncounters={route.gifts}
                    isChoiceSelected={isChoiceSelected}
                    handleChoiceButtonClick={handleChoiceButtonClick}
                    isChoiceDisabled={isChoiceDisabled}
                  />
                )}

                <Separator className="my-2" />

                {/* Missed */}
                <RouteRowExceptions
                  method={METHOD.STATIC}
                  routeId={route.id}
                  isChoiceSelected={isChoiceSelected}
                  handleChoiceButtonClick={handleChoiceButtonClick}
                  isChoiceDisabled={isChoiceDisabled}
                />
              </>
            )}
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>

      <Separator className="my-2" />
    </>
  );
};

export default RouteRow;
