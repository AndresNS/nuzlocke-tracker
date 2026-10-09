import { getGyms } from './scrappers/gyms.ts';
import { getPokemonDex } from './scrappers/pokemon-dex.ts';
import { getRoutesEncounters } from './scrappers/routes-encounters.ts';
import { saveFile } from './utils/storage.ts';

const config = {
  output: {
    path: './scripts/outputs',
  },
  testing: false,
  scrapers: {
    gyms: {
      enabled: false,
      print: true,
      outputFile: 'gyms.json',
      run: getGyms,
    },
    pokemonDex: {
      enabled: false,
      print: false,
      outputFile: 'pokemon-dex.json',
      run: getPokemonDex,
    },
    routesEncounters: {
      enabled: true,
      print: true,
      outputFile: 'routes-encounters.json',
      run: getRoutesEncounters,
    },
  },
};

// https://pokemondb.net/emerald

// Get list of routes
// sort routes based on gym
// get encounters by route
//

await Promise.all(
  Object.keys(config.scrapers).map(async (key: string) => {
    const scrapper = config.scrapers[key as keyof typeof config.scrapers];
    if (!scrapper.enabled) return;

    console.log(`Running ${key}...`);

    const data = await scrapper.run();

    if (scrapper.print) console.dir(data, { depth: null });
    if (config.testing) return;

    await saveFile(config.output.path, scrapper.outputFile, data);
  }),
);

console.log('Script finished');
