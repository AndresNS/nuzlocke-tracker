import { useState } from "react";
import { DisclosureGroup, Typography } from "@heroui/react";

// Components
import Header from "../components/Header";
import RouteRow, { type Route } from "../components/RouteRow";

// Hooks
import { useLocalStorage } from "../hooks/useLocalStorage";

// Constants
import { STORAGE_KEYS } from "../utils/constants";

// Data
import routes from "../../data/encounters.json";

function App() {
  const [encounters, setEncounters] = useLocalStorage<
    Record<string, string | undefined>
  >(STORAGE_KEYS.ENCOUNTERS, {});
  const [expandedKeys, setExpandedKeys] = useState(
    new Set<string | number>(["starter"]),
  );

  const handleExpandedChange = (value: Set<string | number>) => {
    const routeId = [...value][0];
    const claimedEncounter = encounters[routeId];
    console.log(claimedEncounter);
    setExpandedKeys(value);
  };

  return (
    <>
      <Header />
      <main className="container m-auto">
        <Typography type="h3">Routes</Typography>
        <div className="w-full">
          <div className="flex flex-col gap-4 bg-transparent p-4">
            <DisclosureGroup
              expandedKeys={expandedKeys}
              onExpandedChange={handleExpandedChange}
            >
              {routes.map((route) => (
                <RouteRow
                  isExpanded={expandedKeys.has(route.id)}
                  key={route.id}
                  route={route as Route}
                  encounters={encounters}
                  setEncounters={setEncounters}
                />
              ))}
            </DisclosureGroup>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
