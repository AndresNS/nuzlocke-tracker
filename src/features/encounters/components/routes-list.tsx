import { DisclosureGroup, Typography } from '@heroui/react';
import { useState } from 'react';

import { getRoutes } from '../api';
import type { PokemonEncounter, Route, StorageEncounter } from '../types';

import RouteRow from './route-row';

interface RoutesListProps {
  encounters: StorageEncounter;
  onSelectEncounter: (
    routeId: Route['id'],
    encounter: PokemonEncounter['species'] | undefined,
  ) => void;
}

const RoutesList: React.FC<RoutesListProps> = ({
  encounters,
  onSelectEncounter,
}) => {
  const [expandedKeys, setExpandedKeys] = useState(
    () => new Set<string | number>(['starter']),
  );

  const handleExpandedChange = (value: Set<string | number>) => {
    setExpandedKeys(value);
  };

  return (
    <>
      <Typography type="h3">Routes</Typography>
      <div className="w-full">
        <div className="flex flex-col gap-4 bg-transparent p-4">
          <DisclosureGroup
            expandedKeys={expandedKeys}
            onExpandedChange={handleExpandedChange}
          >
            {getRoutes().map((route) => (
              <RouteRow
                key={route.id}
                route={route}
                isExpanded={expandedKeys.has(route.id)}
                encounters={encounters}
                onSelectEncounter={onSelectEncounter}
              />
            ))}
          </DisclosureGroup>
        </div>
      </div>
    </>
  );
};

export default RoutesList;
