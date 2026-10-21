import { getGyms } from './scrapers/gyms.ts';
import { getMoves } from './scrapers/moves.ts';
import { getPokemonDex } from './scrapers/pokemon-dex.ts';
import { getRoutesEncounters } from './scrapers/routes-encounters.ts';
import { saveFile } from './utils/storage.ts';

const config = {
  output: {
    path: './scripts/outputs',
  },
  testing: false,
  scrapers: {
    gyms: {
      enabled: true,
      print: false,
      outputFile: 'gyms.json',
      run: getGyms,
    },
    moves: {
      enabled: false,
      print: false,
      outputFile: 'moves.json',
      run: getMoves,
    },
    pokemonDex: {
      enabled: false,
      print: false,
      outputFile: 'pokemon-dex.json',
      run: getPokemonDex,
    },
    routesEncounters: {
      enabled: false,
      print: false,
      outputFile: 'routes-encounters.json',
      run: getRoutesEncounters,
    },
  },
};

// https://pokemondb.net/emerald

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
