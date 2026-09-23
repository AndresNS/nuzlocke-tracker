import {
  Button,
  cn,
  Disclosure,
  Separator,
  Tag,
  TagGroup,
} from "@heroui/react";
import { Fragment, memo, useCallback } from "react";
import { getEvolutionLine } from "../../utils/helpers";

type SetValue<T> = T | ((val: T) => T);

type Pokemon = {
  species: string;
  rate?: number;
  level: { min: number; max: number };
};

type Area = {
  method: string;
  pokemon: Pokemon[];
};

type Trade = {
  give: string;
  receive: Pokemon;
};

export type Route = {
  id: string;
  name: string;
  areas: Area[];
  trades: Trade[];
  gifts: Pokemon[];
  static: Pokemon[];
};

const RouteRow = memo(function RouteRow({
  route,
  isExpanded,
  encounters,
  setEncounters,
}: {
  route: Route;
  isExpanded: boolean;
  encounters: Record<string, string | undefined>;
  setEncounters: (value: SetValue<Record<string, string | undefined>>) => void;
}) {
  const handleTagSelectionChange = (route: string, encounter: string) => {
    setEncounters({ ...encounters, [route]: encounter });
  };

  const getClaimedEncounter = useCallback(
    (routeId: string) => {
      const claimedEncounter = encounters[routeId];
      if (!claimedEncounter) return [];

      return new Set([claimedEncounter]);
    },
    [encounters],
  );

  const isValidEncounter = useCallback(
    (pokemon: string, routeId: string) => {
      const evolutionLine = getEvolutionLine(pokemon);
      const isCaught = Object.entries(encounters).find((entry) => {
        if (entry[0] === routeId) return false;
        return evolutionLine.includes(entry[1]!);
      });

      return !isCaught;
    },
    [encounters],
  );

  const encounterClaimed = Array.from(getClaimedEncounter(route.id)).length > 0;

  // TODO
  // - Add sections and remake onChange handler

  return (
    <Fragment>
      <Disclosure aria-label={route.name} id={route.id}>
        <Disclosure.Heading>
          <Button
            slot="trigger"
            variant={isExpanded ? "secondary" : "tertiary"}
            className={cn("w-full border-none", {
              "bg-transparent": !isExpanded,
            })}
          >
            <div className="flex w-full justify-between gap-2">
              <p className={cn({ "text-muted": encounterClaimed })}>
                {route.name}
              </p>
              <p>{encounterClaimed ? "Claimed" : "Available"}</p>
            </div>
            <Disclosure.Indicator className="text-muted" />
          </Button>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="flex flex-col gap-2 p-4 bg-surface rounded-3xl">
            {isExpanded && (
              <TagGroup
                selectedKeys={getClaimedEncounter(route.id)}
                selectionMode="single"
                size="lg"
                onSelectionChange={(keys) =>
                  handleTagSelectionChange(
                    route.id,
                    Array.from(keys)[0] as string,
                  )
                }
              >
                <TagGroup.List>
                  {route.areas.map((area) =>
                    area.pokemon.map((pokemon) => (
                      <Tag
                        key={`${route.id}-${area.method}-${pokemon.species}`}
                        id={pokemon.species}
                        isDisabled={
                          !isValidEncounter(pokemon.species, route.id)
                        }
                      >
                        {pokemon.species}
                      </Tag>
                    )),
                  )}

                  {route.static.length > 0 &&
                    route.static.map((staticEncounter) => (
                      <Tag
                        key={`${route.id}-static-${staticEncounter.species}`}
                        id={staticEncounter.species}
                        isDisabled={
                          !isValidEncounter(staticEncounter.species, route.id)
                        }
                      >
                        {staticEncounter.species}
                      </Tag>
                    ))}
                  {route.gifts.length > 0 &&
                    route.gifts.map((gift) => (
                      <Tag
                        key={`${route.id}-gift-${gift.species}`}
                        id={gift.species}
                        isDisabled={!isValidEncounter(gift.species, route.id)}
                      >
                        {gift.species}
                      </Tag>
                    ))}
                  <div className="w-full">
                    <Tag id={"missed"} key={"missed"}>
                      Missed
                    </Tag>
                  </div>
                </TagGroup.List>
              </TagGroup>
            )}
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
      <Separator className="my-2" />
    </Fragment>
  );
});

export default RouteRow;
