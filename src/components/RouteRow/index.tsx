import {
  Button,
  cn,
  Disclosure,
  Label,
  Separator,
  Tag,
  TagGroup,
} from "@heroui/react";
import { Fragment, memo, useCallback } from "react";
import { getEvolutionLine } from "../../utils/helpers";

type SetValue<T> = T | ((val: T) => T);

const RouteRow = memo(function RouteRow({
  route,
  isExpanded,
  encounters,
  setEncounters,
}: {
  route: { id: string; name: string; encounters: string[] };
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
                <Label>Available Encounters</Label>
                <TagGroup.List>
                  {route.encounters.map((encounter) => (
                    <Tag
                      id={encounter}
                      key={encounter}
                      isDisabled={!isValidEncounter(encounter, route.id)}
                    >
                      {encounter}
                    </Tag>
                  ))}
                  <Tag id={"missed"} key={"missed"}>
                    Missed
                  </Tag>
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
