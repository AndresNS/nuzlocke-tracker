import { Fragment, memo, useCallback } from "react";
import { Button, cn, Disclosure, Label, Separator } from "@heroui/react";

// Helpers
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
  const encounterClaimed = (route: string) => encounters[route];

  const handleButtonClick = (
    route: string,
    method: string | null,
    pokemon: string,
  ) => {
    const encounter = pokemon !== "missed" ? `${method}-${pokemon}` : "missed";
    if (encounters[route] === encounter)
      return setEncounters({ ...encounters, [route]: undefined });
    setEncounters({ ...encounters, [route]: encounter });
  };

  const isClaimedEncounter = (
    route: string,
    method: string | null,
    pokemon: string,
  ) => {
    if (pokemon === "missed") return encounters[route] === "missed";
    return encounters[route] === `${method}-${pokemon}`;
  };

  const isValidEncounter = useCallback(
    (species: string) => {
      const evolutionLine = getEvolutionLine(species);
      const isCaught = Object.entries(encounters).find((entry) => {
        if (!entry[1]) return false;
        const pokemon = entry[1].split("-");
        return evolutionLine.includes(pokemon[pokemon.length - 1]);
      });

      return !isCaught;
    },
    [encounters],
  );

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
              <p
                className={cn({
                  "text-muted": encounterClaimed(route.id) && !isExpanded,
                })}
              >
                {route.name}
              </p>
              <p>{encounterClaimed(route.id) ? "Claimed" : "Available"}</p>
            </div>
            <Disclosure.Indicator className="text-muted" />
          </Button>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="flex flex-col gap-2 p-4 bg-surface rounded-3xl">
            {isExpanded && (
              <>
                <div className="flex flex-col gap-4">
                  {route.areas.map(
                    (area) =>
                      area.pokemon.length > 0 && (
                        <div
                          key={`${route.id}-${area.method}`}
                          className="flex flex-col gap-2"
                        >
                          <Label>{area.method}</Label>
                          <div className="flex gap-2">
                            {area.pokemon.map((pokemon) => (
                              <Button
                                key={`${route.id}-${area.method}-${pokemon.species}`}
                                variant={
                                  isClaimedEncounter(
                                    route.id,
                                    area.method,
                                    pokemon.species,
                                  )
                                    ? "tertiary"
                                    : "outline"
                                }
                                isDisabled={
                                  !isValidEncounter(pokemon.species) &&
                                  !isClaimedEncounter(
                                    route.id,
                                    area.method,
                                    pokemon.species,
                                  )
                                }
                                onClick={() =>
                                  handleButtonClick(
                                    route.id,
                                    area.method,
                                    pokemon.species,
                                  )
                                }
                              >
                                {pokemon.species}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
                </div>

                {route.static.length > 0 && (
                  <div>
                    <Label>Static</Label>
                    <div className="flex gap-2">
                      {route.static.map((pokemon) => (
                        <Button
                          key={`${route.id}-static-${pokemon.species}`}
                          variant={
                            isClaimedEncounter(
                              route.id,
                              "static",
                              pokemon.species,
                            )
                              ? "tertiary"
                              : "outline"
                          }
                          isDisabled={
                            !isValidEncounter(pokemon.species) &&
                            !isClaimedEncounter(
                              route.id,
                              "static",
                              pokemon.species,
                            )
                          }
                          onClick={() =>
                            handleButtonClick(
                              route.id,
                              "static",
                              pokemon.species,
                            )
                          }
                        >
                          {pokemon.species}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {route.gifts.length > 0 && (
                  <div>
                    <Label>Gift</Label>
                    <div className="flex gap-2">
                      {route.gifts.map((pokemon) => (
                        <Button
                          key={`${route.id}-static-${pokemon.species}`}
                          variant={
                            isClaimedEncounter(
                              route.id,
                              "static",
                              pokemon.species,
                            )
                              ? "tertiary"
                              : "outline"
                          }
                          isDisabled={
                            !isValidEncounter(pokemon.species) &&
                            !isClaimedEncounter(
                              route.id,
                              "static",
                              pokemon.species,
                            )
                          }
                          onClick={() =>
                            handleButtonClick(
                              route.id,
                              "static",
                              pokemon.species,
                            )
                          }
                        >
                          {pokemon.species}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    variant={
                      isClaimedEncounter(route.id, null, "missed")
                        ? "tertiary"
                        : "outline"
                    }
                    isDisabled={
                      !isValidEncounter("missed") &&
                      !isClaimedEncounter(route.id, null, "missed")
                    }
                    onClick={() => handleButtonClick(route.id, null, "missed")}
                  >
                    Missed
                  </Button>
                </div>
              </>
            )}
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>

      <Separator className="my-2" />
    </Fragment>
  );
});

export default RouteRow;
